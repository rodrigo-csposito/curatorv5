const crypto = require("crypto");

const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b";
const IV = "5183666c72eec9e4";

function encrypt(value) {
  let cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, IV);
  let encrypted = cipher.update(value, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

function decrypt(value) {
  let decipher = crypto.createDecipheriv("aes-256-cbc", ENC_KEY, IV);
  let decrypted = decipher.update(value, "base64", "utf8");
  return decrypted + decipher.final("utf8");
}

module.exports = {
  encrypt,
  decrypt,
};
