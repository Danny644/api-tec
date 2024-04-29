const { body, validationResult } = require('express-validator');

const validateDepartment = [
    body('name')
        .notEmpty().withMessage('Se requiere que ingrese un nombre de departamento')
        .matches(/^[a-zA-Z\s]*$/).withMessage('El nombre del departamento no tiene que contener números ni caracteres especiales')
        .trim(),
    body('series')
        .notEmpty().withMessage('Se requiere que ingrese una serie de departamento')
        .matches(/^[a-zA-Z.]*$/).withMessage('La serie del departamento solo puede contener letras y puntos'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessage = errors.array().map(error => error.msg).join('. ');
            return res.status(400).json({ error: errorMessage });
        }
        next();
    }
];

const validateUpdateDepartment = [
    body('name')
        .optional()
        .notEmpty().withMessage('Se requiere que ingrese un nombre de departamento')
        .matches(/^[a-zA-Z\s]*$/).withMessage('El nombre del depatamento no tiene que contener números ni caracteres especiales')
        .trim(),
    body('series')
        .optional()
        .notEmpty().withMessage('Se requiere que ingrese una serie de departamento')
        .matches(/^[a-zA-Z.]*$/).withMessage('La serie del departamento solo puede contener letras y puntos'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessage = errors.array().map(error => error.msg).join('. ');
            return res.status(400).json({ error: errorMessage });
        }
        next();
    }
];

module.exports = { validateDepartment, validateUpdateDepartment };
