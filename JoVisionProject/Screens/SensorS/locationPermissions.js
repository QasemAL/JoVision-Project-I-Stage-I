import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';

export const requestLocationPermission = async () => {
  const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

  if (status === RESULTS.GRANTED) {
    return true;
  }
  const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  return result === RESULTS.GRANTED;
};
