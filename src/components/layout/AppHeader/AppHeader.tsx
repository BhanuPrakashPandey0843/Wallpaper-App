import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { styles } from './styles';
import { HeaderTitle } from './HeaderTitle';
import { CoinBadge } from './CoinBadge';
import { UserAvatar } from './UserAvatar';
import { useAppHeaderData } from '../../../features/user/hooks';
import { AppHeaderSkeleton } from './AppHeaderSkeleton';

export const AppHeader: React.FC = React.memo(() => {
  const { appName, greeting, coins, multiplier, premium, role, coinAccessibleLabel, avatarUri, onPressAvatar, loading } = useAppHeaderData();
  const { width } = useWindowDimensions();

  if (loading) {
    return <AppHeaderSkeleton />;
  }

  const gap = width < 360 ? 8 : 12;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <HeaderTitle title={greeting ?? appName} subtitle={greeting ? appName : null} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>
          <CoinBadge coins={coins ?? 0} multiplier={multiplier} premium={premium} accessibleLabel={coinAccessibleLabel} />
          <UserAvatar uri={avatarUri} premium={premium} onPress={onPressAvatar} />
        </View>
      </View>
    </View>
  );
});

export default AppHeader;
