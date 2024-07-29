import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';

// Function to request both camera and storage permissions
const requestPermissions = async () => {
  try {
    // Check current permission statuses
    const cameraStatus = await check(PERMISSIONS.ANDROID.CAMERA);
    const storageStatus = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

    if (cameraStatus === RESULTS.GRANTED && storageStatus === RESULTS.GRANTED) {
      // Both permissions already granted
      return true;
    }

    // Request permissions if not granted
    const cameraResult = cameraStatus === RESULTS.GRANTED ? RESULTS.GRANTED : await request(PERMISSIONS.ANDROID.CAMERA);
    const storageResult = storageStatus === RESULTS.GRANTED ? RESULTS.GRANTED : await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

    // Return true only if both permissions are granted
    return cameraResult === RESULTS.GRANTED && storageResult === RESULTS.GRANTED;
  } catch (error) {
    // Log error and return false if there's an issue
    console.error('Error requesting permissions:', error);
    return false;
  }
};

export default requestPermissions;
