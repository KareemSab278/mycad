import { View } from 'react-native';
import * as C from '../../../components';
import { styles } from '../styles';

type Props = {
  onShowInvoices: () => void;
  onAskForHelp: () => void;
};

export const SupportActionCards = ({ onShowInvoices, onAskForHelp }: Props) => (
  <>
    <C.Card>
      <View style={styles.cardContent}>
        <C.Typography text="Invoices" variant="title" />
        <C.Typography text="Review your recent invoice history and open an invoice." variant="body" />
        <C.Buttons.Primary label="Show invoices" onPress={onShowInvoices} />
      </View>
    </C.Card>
    <C.Card>
      <View style={styles.cardContent}>
        <C.Typography text="Ask for help" variant="title" />
        <C.Typography text="Have a question or issue? Send us the details." variant="body" />
        <C.Buttons.Danger label="Ask for help" onPress={onAskForHelp} />
      </View>
    </C.Card>
  </>
);
