import { ToastAndroid } from 'react-native';

export const handleAsync = async <T>(
  fn: () => Promise<T>,
  successMessage?: string
): Promise<T | null> => {
  try {
    const result = await fn();
    if (successMessage) showToast(successMessage);
    return result;
  } catch (error: any) {
    console.error(error);
    showToast(error.message || 'Something went wrong', true);
    return null;
  }
};

export const showToast = (message: string, isError = false) => {
  ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
};
