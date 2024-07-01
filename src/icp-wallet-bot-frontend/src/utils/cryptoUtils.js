import * as CryptoJS from "crypto-js";

// Şifreleme fonksiyonu
export const encrypt = (text, key, salt) => {
  const derivedKey = CryptoJS.PBKDF2(key, CryptoJS.enc.Base64.parse(salt), {
    keySize: 256 / 32,
    iterations: 1000,
  });

  const encrypted = CryptoJS.AES.encrypt(
    text,
    derivedKey.toString()
  ).toString();

  return encrypted;
};

// Deşifreleme fonksiyonu
export const decrypt = (ciphertext, key, salt) => {
  const derivedKey = CryptoJS.PBKDF2(key, CryptoJS.enc.Base64.parse(salt), {
    keySize: 256 / 32,
    iterations: 1000,
  });
  const splitString = ciphertext.split(",");
  const decrypted = splitString.map((a) => {
    return CryptoJS.AES.decrypt(a, derivedKey.toString()).toString(
      CryptoJS.enc.Utf8
    );
  });
  return decrypted;
};
