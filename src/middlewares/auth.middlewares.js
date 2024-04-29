
const twjErrors = require('../helpers/errors/jwt.error');

const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const  UserModel  = require('../models/users.model')


const validateEmail = [
    body('email').notEmpty().isEmail().trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "Formato de email invalido" });
        }
        next();
    }
];

const validatePassword = [
    body('newPassword')
        .notEmpty().withMessage('La contraseña no puede estar vacía')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-zA-Z])/).withMessage('La contraseña debe contener al menos una letra')
        .matches(/^(?=.*\d)/).withMessage('La contraseña debe contener al menos un dígito (numero)')
        .matches(/^(?=.*[@$!%*?&])/).withMessage('La contraseña debe contener al menos uno de los siguientes caracteres @$!%*?&')
        .matches(/[A-Za-z\d@$!%*?&]{8,}$/).withMessage('La contraseña debe cumplir con los requisitos de longitud y caracteres especiales'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const messages = errors.array().map(error => error.msg);          
            return res.status(400).json({ errors: messages });
        }
        next();
    }
];

function verifyAccessToken(req, res, next) {
 try{
    let accessToken = req.headers?.authorization;

    if (!accessToken || !accessToken.startsWith("Bearer ")) {
        return res.status(401).send({ message: 'Necesitas autentificarte' });
    }

    accessToken = accessToken.split(' ')[1];
    const { id } = jwt.verify(accessToken, process.env.SECRET_KEY); 
    

    const userId = id;

    UserModel.findOne({ _id: userId, revokedTokens: accessToken }).then((user) => {
        if (!user) {
             jwt.verify(accessToken, process.env.SECRET_KEY, (err, decoded) => {
                
                if (err) {
                    return res.status(401).send({ message: twjErrors[err.message] });
                }
                
                req.user = decoded;
                next();
            })
        } else {
            return res.status(401).send({ message: 'Token de acceso revocado' });
        }
    }).catch((error) => {
        res.status(500).send({ message: 'Error al verificar el token de acceso', error: error });
    });

}catch (e) {
if(!twjErrors[e.message]){ res.status(500).send({ message: 'Error en el servidor' }); }
res.status(401).send({ message: twjErrors[e.message] });
}
}

module.exports = { validateEmail, validatePassword, verifyAccessToken };