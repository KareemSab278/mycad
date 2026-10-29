import * as LS from '@/storage';
const dev = process.env.EXPO_PUBLIC_DEV_MODE === 'development';

// Finds the logged-in user's email from local storage else returns false
export const findLoggedInCreds = async (): Promise<string | false> => {
    try {
        const user = await LS.Creds.get();
        let email = user?.login?.email?.trim() ?? false;
        return email && email.length > 0 ? email : false;
    } catch (e) {
        dev && console.error('Error finding logged-in credentials: ', e);
        return false;
    }
};