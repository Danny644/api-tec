const { body, validationResult } = require('express-validator');


const validateFiled = [
    body('campo').exists().withMessage('la propiedad "campo" es requerida'),
    body('campo').isObject().withMessage('la propiedad "campo" debe ser un objeto'),
    body('campo.name').notEmpty().
    withMessage('Se requiere que ingrese un nombre para el campo').
    matches(/^[a-zA-Z\s]*$/).
    withMessage('El nombre del campo no debe contener números ni caracteres especiales').trim(),
    body('campo.text').optional().trim().escape().bail(),
    body('campo.font').notEmpty().
    withMessage('Se que seleccione un tipo de letra')
    .trim().escape().bail(),
    body('campo.size').optional().
    trim().
    isNumeric().withMessage('La propiedad "size" debe ser un número')
    .bail()
    .custom((value, { req }) => {
            if (typeof value !== 'undefined' && isNaN(value)) {
                throw new Error('La propiedad "size" debe ser un número');
            } else if (value < 1 || value > 100) {
                throw new Error('El tamaño de letra debe ser de entre 1 y 100');
            }
            return true;
    }),
    body('campo.alignment').optional().
    matches(/^[a-zA-Z\s]*$/).
    withMessage('La propiedad "alineacion" no debe contener números ni caracteres especiales').
    trim().bail(),
    body('campo.bold').optional().
    isBoolean().withMessage('La propiedad "bold" debe ser un booleano').trim(), 
];

const validateUpdateField = [
    body('campo').exists().withMessage('la propiedad "campo" es requerida'),
    body('campo').isObject().withMessage('la propiedad "campo" debe ser un objeto'),
    body('campo.name').notEmpty().
    withMessage('Se requiere que ingrese un nombre para el campo').
    matches(/^[a-zA-Z\s]*$/).
    withMessage('El nombre del campo no debe contener números ni caracteres especiales').trim().bail().optional(),
    body('campo.text').optional().trim().escape().bail(),
    body('campo.font').optional().trim().escape().bail(),
    body('campo.size').optional().
    trim().
    isNumeric().withMessage('La propiedad "size" debe ser un número')
    .bail()
    .custom((value, { req }) => {
        if (typeof value !== 'undefined' && isNaN(value)) {
            throw new Error('La propiedad "size" debe ser un número');
        } else if (value < 1 || value > 100) {
            throw new Error('El tamaño de letra debe ser de entre 1 y 100');
        }
        return true;
}),
    body('campo.alignment').optional().
    matches(/^[a-zA-Z\s]*$/).
    withMessage('La propiedad "alineacion" no debe contener números ni caracteres especiales').
    trim().bail(),
    body('campo.bold').optional().isBoolean().withMessage('La propiedad "bold" debe ser un booleano'), // La propiedad "bold" es opcional y debe ser un booleano
];

// manejo de errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateFiled,
    validateUpdateField,
    handleValidationErrors
};