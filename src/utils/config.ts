export const getAppName = (): string => {
  const name = process.env.EXPO_PUBLIC_APP_NAME;
  return typeof name === 'string' && name.length > 0 ? name : 'App';
};
