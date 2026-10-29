import { fakeAccountMultiple } from '@/fakeAccountInfo';
import * as LS from '@/storage';
import { Linking } from 'react-native';

const goToPage = (page: 'forgot' | 'join') => {
    const urls: Record<'forgot' | 'join', string> = {
        'forgot': 'https://my.coin-a-drink.co.uk/forgotten_password.php',
        'join': 'https://coin-a-drink.co.uk/contact-us/'
    }
    return Linking.openURL(urls[page]);
};


const signInCall = async (email: string, password: string): Promise<string> => {
    if (!email.trim() || !password.trim()) throw new Error('Email and password are required.');
    if (!email.includes('@')) throw new Error('Invalid email address.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters long.');
    await new Promise(resolve => setTimeout(resolve, 1500)); // simulate network delay
    await LS.Creds.save(fakeAccountMultiple);
    return fakeAccountMultiple.login.email;
};
export { goToPage, signInCall };
