import { useCallback, useEffect, useMemo } from 'react';
import { useGetUserProfileQuery, useGetUserCoinsQuery } from './userApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setProfile, setCoins } from './userSlice';
import { storage } from '../../services/storage';
import { getFeatureFlags } from '../../services/featureFlags';
import { getAppName } from '../../utils/config';

const CACHE_KEYS = {
  coins: 'user.coins',
  profile: 'user.profile',
};

export const useAppHeaderData = () => {
  const dispatch = useAppDispatch();
  const { data: profileData, isLoading: profileLoading, isFetching: profileFetching } = useGetUserProfileQuery();
  const { data: coinData, isLoading: coinsLoading, isFetching: coinsFetching } = useGetUserCoinsQuery();

  useEffect(() => {
    const hydrate = async () => {
      const cachedProfile = await storage.get<typeof profileData>(CACHE_KEYS.profile);
      const cachedCoins = await storage.get<typeof coinData>(CACHE_KEYS.coins);
      if (cachedProfile) dispatch(setProfile(cachedProfile));
      if (cachedCoins) dispatch(setCoins(cachedCoins));
    };
    hydrate();
  }, [dispatch]);

  useEffect(() => {
    if (profileData) {
      dispatch(setProfile(profileData));
      storage.set(CACHE_KEYS.profile, profileData);
    }
  }, [dispatch, profileData]);

  useEffect(() => {
    if (coinData) {
      dispatch(setCoins(coinData));
      storage.set(CACHE_KEYS.coins, coinData);
    }
  }, [dispatch, coinData]);

  const user = useAppSelector((s) => s.user.profile);
  const coins = useAppSelector((s) => s.user.coins);
  const multiplier = useAppSelector((s) => s.user.multiplier);

  const flags = useMemo(() => getFeatureFlags(), []);
  const appName = useMemo(() => getAppName(), []);

  const greeting = useMemo(() => {
    if (!flags.enableGreeting || !user?.name) return null;
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
    return `Good ${timeOfDay}, ${user.name}`;
  }, [flags.enableGreeting, user?.name]);

  const role = user?.role ?? 'guest';
  const premium = user?.premium ?? false;

  const coinAccessibleLabel = useMemo(() => `You have ${coins ?? 0} coins`, [coins]);

  const onPressAvatar = useCallback(() => {
    // navigation can be injected later; leave as extension point
  }, []);

  return {
    appName,
    greeting,
    coins,
    multiplier,
    role,
    premium,
    coinAccessibleLabel,
    avatarUri: user?.avatar,
    flags,
    onPressAvatar,
    loading: profileLoading || coinsLoading,
    fetching: profileFetching || coinsFetching,
  };
};
