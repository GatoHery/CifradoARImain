const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const ivLength = 16; //Longitud del vector de inicialización

//Funcion para generar una clave de 256 bits (32 bytes) a partir de cualquier cadena
const generateKey = (key) => {
    return crypto.createHash('sha256').update(key).digest();
};

//Funcion para cifrar el numero de tarjeta
const encryptCreditCard = (creditCard, key) => {
    const iv = crypto.randomBytes(ivLength);
    const cipherKey = generateKey(key);
    const cipher = crypto.createCipheriv(algorithm, cipherKey, iv);
    let encrypted = cipher.update(creditCard, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

//Funcion para descifrar el numero de tarjeta
const decryptCreditCard = (encryptedCard, key) => {
    const parts = encryptedCard.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const cipherKey = generateKey(key);
    const decipher = crypto.createDecipheriv(algorithm, cipherKey, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
};

module.exports = {
    encryptCreditCard,
    decryptCreditCard
};
