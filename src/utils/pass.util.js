const crypto = require('crypto');

function generateTemporaryPassword() {
    try{
        let length = 12
        // Defirne los caracteres permitidos en la contraseña temporal
        const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        // se crea un buffer aleatorio
        const randomBytes = crypto.randomBytes(length);
    
        // Se crea una contraseña temporal basada en el buffer aleatorio y los caracteres permitidos
        const temporaryPassword = Array.from(randomBytes)
            .map(byte => allowedChars[byte % allowedChars.length])
            .join('');
    
        return temporaryPassword

    }catch(error){

        return null;

    }
}

function encryptPassword(password) {
    try{
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt)
            .update(password)
            .digest('base64');
        const pass = `${salt}$${hash}`         
        return  pass
    }catch(error){
        return null;
    } 
}


function decryptPassword(password, passwordEntered) {
    try{

    let salt = password.split('$')[0];
    let hash = crypto.createHmac('sha512', salt)
            .update(passwordEntered)
            .digest("base64");

    return { salt: salt, hash: hash };

}catch(error){
    return null;
}

}

function generateResetPasswordToken() {
    try{
        // Genera un token único para restablecer la contraseña
        return crypto.randomBytes(20).toString('hex');

    }catch(error){
        return null;
    }
}

module.exports = {
    generateTemporaryPassword,
    encryptPassword,
    decryptPassword,
    generateResetPasswordToken
};