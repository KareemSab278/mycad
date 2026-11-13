
import { Try } from '../helpers/ls';

export const NotificationStorage = {
    savePushToken: async (token: string) => {await Try.save('push_token', token)},
    getPushToken: async (orElse?: string | null): Promise<string | null> => await Try.get('push_token', orElse)
}