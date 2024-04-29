
const { body } = require('express-validator');

const validateLugar = body('lugar').optional()
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
];


module.exports = { writtenDataMiddleware, writtenUpdateDataMiddleware };