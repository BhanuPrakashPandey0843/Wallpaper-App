import { useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { bootstrapAuthThunk } from '../authSlice';
import * as SplashScreen from 'expo-splash-screen';

export const useAuthInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await dispatch(bootstrapAuthThunk()).unwrap();
      } catch {
        // Auth bootstrap failures are intentionally swallowed;
        // navigation guards will continue with logged-out state.
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    bootstrap();
  }, [dispatch]);
};
