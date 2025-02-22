import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserDetails {
  id: string;
  email: string;
  fullName: string;
}

const USER_STORAGE_KEY = '@user_details';

export const userStorage = {
  saveUser: async (userDetails: UserDetails): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(userDetails);
      await AsyncStorage.setItem(USER_STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving user details:', error);
      throw error;
    }
  },

  getUser: async (): Promise<UserDetails | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting user details:', error);
      throw error;
    }
  },

  deleteUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Error deleting user details:', error);
      throw error;
    }
  },

  hasUser: async (): Promise<boolean> => {
    try {
      const user = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return user !== null;
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw error;
    }
  },
};
