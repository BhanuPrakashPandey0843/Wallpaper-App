import React from 'react';
import { View, useWindowDimensions, Pressable } from 'react-native';
import { styles } from './styles';
import { HeaderTitle } from './HeaderTitle';
import { CoinBadge } from './CoinBadge';
import { UserAvatar } from './UserAvatar';
import { useAppHeaderData } from '../../../features/user/hooks';
import { AppHeaderSkeleton } from './AppHeaderSkeleton';
import { Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme/colors';

export const AppHeader: React.FC = React.memo(() => {
  const { appName, greeting, coins, multiplier, premium, role, coinAccessibleLabel, avatarUri, onPressAvatar, loading } = useAppHeaderData();
  const { width } = useWindowDimensions();
  const router = useRouter();

  if (loading) {
    return <AppHeaderSkeleton />;
  }

  const gap = width < 360 ? 8 : 12;

  const onShare = () => {
    router.push('/settings-view/share');
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <HeaderTitle title={greeting ?? appName} subtitle={greeting ? appName : role} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>
          <Pressable 
            onPress={onShare}
            style={({ pressed }) => [
              { opacity: pressed ? 0.6 : 1, padding: 4 }
            ]}
          >
            <Share2 size={22} color={colors.primary} />
          </Pressable>
          <CoinBadge coins={coins ?? 0} multiplier={multiplier} premium={premium} accessibleLabel={coinAccessibleLabel} />
          <UserAvatar uri={avatarUri} premium={premium} onPress={onPressAvatar} />
        </View>
      </View>
    </View>
  );
});

export default AppHeader;
