
const { body, validationResult } = require('express-validator');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

/* const validateLugar = body('lugar').optional()
const validateFecha = body('fecha').optional()
const validateSerieOficio = body('serieOficio').optional()
const validateAsunto = body('asunto').trim().notEmpty().withMessage('El campo asunto no puede estar vacío');
const validateDestinatario = body('destinatario').trim().notEmpty().withMessage('El campo destinatario no puede estar vacío');
const validatePuesto = body('puesto').trim().notEmpty().withMessage('El campo puesto no puede estar vacío');
const validateContexto = body('contexto').trim().notEmpty().withMessage('El campo contexto no puede estar vacío');
const validateEmisor = body('emisor').trim().notEmpty().withMessage('El campo emisor no puede estar vacío');
const validateOcupacionEmisor = body('ocupacionEmisor').trim().notEmpty().withMessage('El campo ocupacionEmisor no puede estar vacío');
const validateDepartamentoEmisor = body('departamentoEmisor').trim().notEmpty().withMessage('El campo departamentoEmisor no puede estar vacío');
const validateRubricas = body('rubricas').trim().notEmpty().withMessage('El campo rubricas no puede estar vacío');
const validateCCP = body('ccp').trim().notEmpty().withMessage('El campo ccp no puede estar vacío');
const validateIdUsuario = body('idUsuario').trim().notEmpty().withMessage('El campo idUsuario no puede estar vacío');
const validateDepartamento = body('departamento').trim().notEmpty().withMessage('El campo idDepartamento no puede estar vacío');

const writtenDataMiddleware = [
  validateLugar,
  validateFecha,
  validateSerieOficio,
  validateAsunto,
  validateDestinatario,
  validatePuesto,
  validateContexto,
  validateEmisor,
  validateOcupacionEmisor,
  validateDepartamentoEmisor,
  validateRubricas,
  validateCCP,
  validateIdUsuario,
  validateDepartamento
];

const validateUpdateLugar = body('lugar').optional()
const validateUpdateFecha = body('fecha').optional()
const validateUpdateSerieOficio = body('serieOficio').optional()
const validateUpdateAsunto = body('asunto').optional().trim().notEmpty().withMessage('El campo asunto no puede estar vacío');
const validateUpdateDestinatario = body('destinatario').optional().trim().notEmpty().withMessage('El campo destinatario no puede estar vacío');
const validateUpdatePuesto = body('puesto').optional().trim().notEmpty().withMessage('El campo puesto no puede estar vacío');
const validateUpdateContexto = body('contexto').optional().trim().notEmpty().withMessage('El campo contexto no puede estar vacío');
const validateUpdateEmisor = body('emisor').optional().trim().notEmpty().withMessage('El campo emisor no puede estar vacío');
const validateUpdateOcupacionEmisor = body('ocupacionEmisor').optional().trim().notEmpty().withMessage('El campo ocupacionEmisor no puede estar vacío');
const validateUpdateDepartamentoEmisor = body('departamentoEmisor').optional().trim().notEmpty().withMessage('El campo departamentoEmisor no puede estar vacío');
const validateUpdateRubricas = body('rubricas').optional().trim().notEmpty().withMessage('El campo rubricas no puede estar vacío');
const validateUpdateCCP = body('ccp').optional().trim().notEmpty().withMessage('El campo ccp no puede estar vacío');
const validateUpdateIdUsuario = body('idUsuario').optional().trim().notEmpty().withMessage('El campo idUsuario no puede estar vacío');
const validateUpdateDepartamento = body('departamento').optional().trim().notEmpty().withMessage('El campo idDepartamento no puede estar vacío');

const writtenUpdateDataMiddleware = [
  validateUpdateLugar,
  validateUpdateFecha,
  validateUpdateSerieOficio,
  validateUpdateAsunto,
  validateUpdateDestinatario,
  validateUpdatePuesto,
  validateUpdateContexto,
  validateUpdateEmisor,
  validateUpdateOcupacionEmisor,
  validateUpdateDepartamentoEmisor,
  validateUpdateRubricas,
  validateUpdateCCP,
  validateUpdateIdUsuario,
  validateUpdateDepartamento
]; */

const sanitizeData = (req, res, next) => {
  // Sana el título
  req.body.tittle = req.body.tittle.trim(); // Elimina los espacios al inicio y al final

  const window = new JSDOM('').window;
  const purify = DOMPurify(window);

  // Sanitizar campos
  req.body.campos.forEach((campo) => {
      campo.name = campo.name.trim(); 
      campo.text = purify.sanitize(campo.text.trim()); 
      campo.font = campo.font.trim();
      campo.alignment = campo.alignment.trim(); 
      campo.bold = Boolean(campo.bold); // Converte el valor a booleano
  });

  next();
};

const validateData = [
  // Valida  el título
  body('tittle')
      .notEmpty()
      .withMessage('El título no puede estar vacío'),

  // Valida los valores de los campos
  body('campos.*.name')
      .custom((value, { req }) => {
          const campo = value.toLowerCase();
          if (campo === 'destinatario' || campo === 'emisor') {// si el campo es destinatario o emisor
              //busca y filtra el texto asociado al campo destinatario o emisor
              const campoText = req.body.campos.find(c => c.name === campo).text;
              // Verifica que el texto no contenga números ni caracteres especiales
              if (!/^[a-zA-Z\s]*$/.test(campoText)) {
                  throw new Error(`El texto del campo ${campo} no puede contener números ni caracteres especiales`);
              }
          }
          return true;
      }) .withMessage('El nombre del campo no puede estar vacío o ser inválido'),
  body('campos.*.text')
      .notEmpty()
      .withMessage('El texto del campo no puede estar vacío'),
      body('campos.*.font').optional().escape(),
      body('campos.*.size').optional().
      isNumeric().withMessage('La propiedad "size" debe ser un número')
      .custom((value, { req }) => {
            if (typeof value !== 'undefined' && isNaN(value)) {
                throw new Error('La propiedad "size" debe ser un número');
            } else if (value < 1 || value > 100) {
                throw new Error('El tamaño de letra debe ser de entre 1 y 100');
            }
            return true;
    }),
    body('campos.*.bold')
    .isBoolean()
    .withMessage('El valor de bold debe ser un booleano'),
    body('campos.*.alignment')
    .notEmpty()
    .withMessage('El valor de bold debe ser un booleano').
    matches(/^[a-zA-Z\s]*$/).
    withMessage('La propiedad "alineacion" no debe contener números ni caracteres especiales'),
    body('idUsuario')
    .notEmpty()
    .withMessage('Falta el id del usuario creador'),
    body('departamento')
    .notEmpty()
    .withMessage('Falta el id del departamento creador')
];

const handleValidationErrors = (req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
    const messages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: messages });
}
next();
};

const sanitizeUpdateData = (req, res, next) => {
   
    if (req.body.tittle) {
        req.body.tittle = req.body.tittle.trim();
    }

    const window = new JSDOM('').window;
    const purify = DOMPurify(window);

    if (req.body.campos && Array.isArray(req.body.campos)) {
        req.body.campos.forEach((campo) => {
            if (campo.name) {
                campo.name = campo.name.trim();
            }
            if (campo.text) {
                campo.text = purify.sanitize(campo.text.trim());
            }
            if (campo.font) {
                campo.font = campo.font.trim();
            }
            if (campo.alignment) {
                campo.alignment = campo.alignment.trim();
            }
            if (campo.hasOwnProperty('bold')) {
                campo.bold = Boolean(campo.bold);
            }
        });
    }

    next();
};

const validateUpdateData = [
   
    body('tittle')
        .optional()
        .notEmpty()
        .withMessage('El título no puede estar vacío'),

    body('campos.*.name')
        .optional()
        .custom((value, { req }) => {
            if (value) {
                const campo = value.toLowerCase();
                if (campo === 'destinatario' || campo === 'emisor') {
                    const campoText = req.body.campos.find(c => c.name === campo)?.text;
                    if (!campoText || !/^[a-zA-Z\s]*$/.test(campoText.trim())) {
                        throw new Error(`El texto del campo ${campo} no puede contener números ni caracteres especiales`);
                    }
                }
            }
            return true;
        })
        .withMessage('El nombre del campo no puede estar vacío o ser inválido'),

    body('campos.*.text')
        .optional()
        .notEmpty()
        .withMessage('El texto del campo no puede estar vacío'),
    body('campos.*.font').optional().escape(),
    body('campos.*.size').optional().
        isNumeric().withMessage('La propiedad "size" debe ser un número')
        .custom((value, { req }) => {
            if (typeof value !== 'undefined' && isNaN(value)) {
                throw new Error('La propiedad "size" debe ser un número');
            } else if (value < 1 || value > 100) {
                throw new Error('El tamaño de letra debe ser de entre 1 y 100');
            }
            return true;}),
    body('campos.*.bold')
        .optional()
        .isBoolean()
        .withMessage('El valor de bold debe ser un booleano'),

    body('campos.*.alignment')
    .optional()
    .notEmpty()
    .withMessage('El valor de alignment debe ser un booleano').
     matches(/^[a-zA-Z\s]*$/).
     withMessage('La propiedad "alineacion" no debe contener números ni caracteres especiales'),
    body('idUsuario')
        .optional()
        .notEmpty()
        .withMessage('Falta el id del usuario creador'),

    body('departamento')
        .optional()
        .notEmpty()
        .withMessage('Falta el id del departamento creador'),
];

module.exports = {
sanitizeData,
validateData,
sanitizeUpdateData,
validateUpdateData,
handleValidationErrors
};
