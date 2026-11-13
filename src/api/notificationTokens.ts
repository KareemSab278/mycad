import { Api } from './apiMethods';
import { User } from './user';

export type RegisterNotificationTokenResponse = {
  success: boolean;
  error?: string;
};

const createIdempotencyKey = () =>
  Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 0x100000000)
      .toString(16)
      .padStart(8, '0'),
  ).join('');

const Register = async (
  expoPushToken: string,
  signal?: AbortSignal,
): Promise<RegisterNotificationTokenResponse> => {
  const user = await User.GetInfo(signal);
  const response = await Api.Post<RegisterNotificationTokenResponse>(
    '/smartfridge/register_notification_token',
    {
      customer_id: user.user_id,
      expo_push_token: expoPushToken,
    },
    { key: createIdempotencyKey(), signal },
  );

  if (!response.success) {
    throw new Error(response.error ?? 'Failed to register notification token.');
  }

  return response;
};

export const NotificationToken = { Register };
