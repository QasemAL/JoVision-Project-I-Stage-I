import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';

export default requestCameraPermission = async () => {
  const status = await check(PERMISSIONS.ANDROID.CAMERA);

  if (status === RESULTS.GRANTED) {
    return true;
  }
  const result = await request(PERMISSIONS.ANDROID.CAMERA);
  return result === RESULTS.GRANTED;
};