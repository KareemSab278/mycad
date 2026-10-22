/*
import NotificationToken from '@/ApiCallers/NotificationTokens';
import { UserStorage } from '@/Store/Storage';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const DEV_MODE = process.env.EXPO_PUBLIC_DEV_MODE === 'true';

type DevicePlatform = 'android' | 'ios' | 'unknown';
const PLATFORM: DevicePlatform = Platform.OS === 'android'
    ? 'android'
    : Platform.OS === 'ios'
        ? 'ios'
        : 'unknown';

type PushTokenResult = {
    pushToken: string | null;
    deviceId: string | null;
    platform: DevicePlatform;
    permissionStatus: Notifications.PermissionStatus;
};


const getDeviceId = async (): Promise<string | null> => {
    try {
        if (Platform.OS === 'android') {
            const res =  Application.getAndroidId();
            DEV_MODE && console.log('Android Device ID:', res);
            return res;
        }

        if (Platform.OS === 'ios') {
            const res = await Application.getIosIdForVendorAsync();
            DEV_MODE && console.log('iOS Device ID:', res);
            return res;
        }

        return null;
    } catch {
        return null;
    }
};

export const getAndSavePushTokenAndDeviceId =
    async (): Promise<PushTokenResult> => {

        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();

        const permissionResponse =
            existingStatus === 'granted'
                ? { status: existingStatus }
                : await Notifications.requestPermissionsAsync();

        const permissionStatus = permissionResponse.status;

        if (permissionStatus !== 'granted') {
            return {
                pushToken: null,
                deviceId: await getDeviceId(),
                platform: PLATFORM,
                permissionStatus,
            };
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
            });
        }

        const projectId =
            Constants.expoConfig?.extra?.eas?.projectId ??
            Constants.easConfig?.projectId;

        if (!projectId) {
            throw new Error(
                'Expo projectId not found. Make sure your app is configured with EAS.',
            );
        }

        const tokenResult = await Notifications.getExpoPushTokenAsync({
            projectId,
        });

        DEV_MODE && console.log('Expo Push Token:', tokenResult.data);
        const deviceId = await getDeviceId();
        
        await UserStorage.savePushToken(tokenResult.data);
        
        await NotificationToken.register();
        
        return {
            pushToken: tokenResult.data,
            deviceId,
            platform: PLATFORM,
            permissionStatus,
        };
    };
*/