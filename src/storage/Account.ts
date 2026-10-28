import * as T from '@/types';
import { Try } from '../helpers/ls';

export const Account = {
    save: async (account: T.SingleAccountInfo) => await Try.save('account', account),
    get: async (orElse?: any): Promise<T.SingleAccountInfo | null> => await Try.get('account', orElse),
    remove: async () => await Try.remove('account'),
    clear: async () => await Try.clear()
}