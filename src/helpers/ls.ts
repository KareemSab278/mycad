import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
const isWeb = Platform.OS === 'web';

export const Try = {
    save: async (key: string, value: any) => {
        try {
            await Storage.saveObjToKey(key, value);
        } catch (e) {
            console.error(`Error saving ${key}:`, e);
        }
    },

    get: async (key: string, orElse?: any) => {
        try {
            const value = await Storage.getObjFromKey(key);
            return value !== null ? value : orElse;
        } catch (e) {
            console.error(`Error retrieving ${key}:`, e);
            return orElse;
        }
    },

    remove: async (key: string) => {
        try {
            await Storage.removeDataFromKey(key);
        } catch (e) {
            console.error(`Error removing ${key}:`, e);
        }
    },

    clear: async () => {
        try {
            await Storage.clearAllData();
        } catch (e) {
            console.error('Error clearing all data:', e);
        }
    }
};


const Storage = {
    saveValToKey: async (key: string, value: string) => {
        try {
            if (isWeb) {
                localStorage.setItem(key, value);
            } else {
                await AsyncStorage.setItem(key, value);
            }
        } catch (e) {
            console.error('Error storing value to key:', e);
        }
    },

    getDataFromKey: async (key: string) => {
        try {
            if (isWeb) {
                return localStorage.getItem(key);
            }
            return await AsyncStorage.getItem(key);
        } catch (e) {
            console.error('Error retrieving data from key:', e);
        }
    },

    saveObjToKey: async (key: string, value: any) => {
        try {
            const jsonValue = JSON.stringify(value);
            if (isWeb) {
                localStorage.setItem(key, jsonValue);
            } else {
                await AsyncStorage.setItem(key, jsonValue);
            }
        } catch (e) {
            console.error('Error storing object to key:', e);
        }
    },

    getObjFromKey: async (key: string) => {
        try {
            const jsonValue = isWeb
                ? localStorage.getItem(key)
                : await AsyncStorage.getItem(key);
            return jsonValue !== null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Error retrieving object from key:', e);
        }
    },

    removeDataFromKey: async (key: string) => {
        try {
            if (isWeb) {
                localStorage.removeItem(key);
            } else {
                await AsyncStorage.removeItem(key);
            }
        } catch (e) {
            console.error('Error removing data from key:', e);
        }
    },

    clearAllData: async () => {
        try {
            if (isWeb) {
                localStorage.clear();
            } else {
                await AsyncStorage.clear();
            }
        } catch (e) {
            console.error('Error clearing all data:', e);
        }
    },
};