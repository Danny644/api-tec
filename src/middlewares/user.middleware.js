const { body, validationResult } = require('express-validator');

const validateUser = [
    body('email')
        .notEmpty().withMessage('Se requiere que ingrese un email')
        .isEmail().withMessage('Formato de email inválido')
        .trim(),
    body('name')
        .notEmpty().withMessage('Se requiere que ingrese el nombre del usuario')
        .matches(/^[a-zA-Z\s]*$/).withMessage('El nombre no debe contener números ni caracteres especiales')
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessage = errors.array().map(error => error.msg).join('. ');
            return res.status(400).json({ error: errorMessage });
        }
        next();
    }
];

const validateUpdateUser = [
    body('email')
        .optional()
        .notEmpty().withMessage('Se requiere que ingrese un email')
        .isEmail().withMessage('Formato de email inválido')
        .trim(),
    body('name')
        .optional()
        .notEmpty().withMessage('Se requiere que ingrese el nombre del usuario')
        .matches(/^[a-zA-Z\s]*$/).withMessage('El nombre no debe contener números ni caracteres especiales')
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessage = errors.array().map(error => error.msg).join('. ');
            return res.status(400).json({ error: errorMessage });
        }
        next();
    }
];

module.exports = { validateUser, validateUpdateUser };



