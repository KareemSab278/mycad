
import { ScrollView } from 'react-native';
import { styles } from './style';

export const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {children}
        </ScrollView>
    );
};