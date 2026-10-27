import { Linking } from 'react-native';

const goToPage = (page: 'forgot' | 'join') => {
    const urls: Record<'forgot' | 'join', string> = {
        'forgot': 'https://my.coin-a-drink.co.uk/forgotten_password.php',
        'join': 'https://coin-a-drink.co.uk/contact-us/'
    }
    return Linking.openURL(urls[page]);
};

export { goToPage, signIn };


const signIn = () => { };
