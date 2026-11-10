import { Try } from '../helpers/ls';

export const Creds = {
    remove: async () => await Try.remove('creds'),
    saveToken: async (token: string) => await Try.save('token', token),
    getToken: async (orElse?: string | null): Promise<string | null> => await Try.get('token', orElse),
    removeToken: async () => await Try.remove('token'),
};