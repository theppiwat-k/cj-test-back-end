import { createCipheriv, randomBytes } from 'crypto';

export const encryptData = async (key: string) => {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const textToEncrypt = 'Nest';
  const encryptedText = Buffer.concat([
    cipher.update(textToEncrypt),
    cipher.final(),
  ]);
  return encryptedText;
};
