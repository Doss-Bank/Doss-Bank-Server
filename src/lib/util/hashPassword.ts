import { createHash } from 'crypto';

export default (password: string): string => {
  return createHash('sha512').update(password).digest('base64');
};
