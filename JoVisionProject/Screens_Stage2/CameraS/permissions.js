import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';

const requestCameraPermission = async () => {
  try {
    const status = await check(PERMISSIONS.ANDROID.CAMERA);

    if (status === RESULTS.GRANTED) {
      return true;
    }

    const result = await request(PERMISSIONS.ANDROID.CAMERA);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

export default requestCameraPermission;
