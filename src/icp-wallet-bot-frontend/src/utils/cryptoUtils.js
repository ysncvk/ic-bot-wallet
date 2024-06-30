import * as CryptoJS from "crypto-js";

// Şifreleme fonksiyonu
export const encrypt = (text, key, salt) => {
  console.log("Encrypting text:", text);
  console.log("Using key:", key);
  console.log("Using salt:", salt);

  const derivedKey = CryptoJS.PBKDF2(key, CryptoJS.enc.Base64.parse(salt), {
    keySize: 256 / 32,
    iterations: 1000,
  });

  console.log("Derived key:", derivedKey.toString());

  const encrypted = CryptoJS.AES.encrypt(
    text,
    derivedKey.toString()
  ).toString();

  console.log("encrypted", encrypted);
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
