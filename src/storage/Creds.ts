import * as T from '@/types';
import { Try } from '../helpers/ls';

export const Creds = {
    save: async (creds: T.SingleAccountInfo) => await Try.save('creds', creds),
    get: async (orElse?: any): Promise<T.SingleAccountInfo | null> => await Try.get('creds', orElse),
    remove: async () => await Try.remove('creds'),
    clear: async () => await Try.clear()
}