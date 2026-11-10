import { User } from '../api';
const dev = process.env.EXPO_PUBLIC_DEV_MODE === 'development';

export const findLoggedInCreds = async (): Promise<string | false> => {
    try {
        const user = await User.GetInfo();
        const email = user.email.trim();
        return email && email.length > 0 ? email : false;
    } catch (error) {
        if (dev) console.error('Unable to load the signed-in user:', error);
        return false;
    }
};