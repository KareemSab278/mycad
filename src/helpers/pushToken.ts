import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationToken } from '../api';

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
        const deviceId = Platform.OS === 'android' ? Application.getAndroidId()
            : Platform.OS === 'ios' ? await Application.getIosIdForVendorAsync()
                : null;
        return deviceId;
        
    } catch {
        DEV_MODE && console.log('Failed to get device ID');
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
                importance: AndroidImportance.MAX,
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

        await NotificationToken.Register(tokenResult.data);

        return {
            pushToken: tokenResult.data,
            deviceId,
            platform: PLATFORM,
            permissionStatus,
        };
    };