const express = require('express');
const writtenController = require('../controllers/written.controller');
const {  verifyAccessToken } = require('../middlewares/auth.middlewares');
const { verifyAdminPermission } = require('../middlewares/checkPermission.middleware');

const { sanitizeData, validateData, sanitizeUpdateData, validateUpdateData, handleValidationErrors } = require('../middlewares/written.middlewares');
const { decodeSearchParameters, errorHandler } = require('../middlewares/decodedSearch.middleware');


const router = express.Router();

router.post('/preview', verifyAccessToken, sanitizeData, validateData, 
handleValidationErrors, writtenController.previewWritten);

router.post('/save',verifyAccessToken, sanitizeData, validateData, 
handleValidationErrors, writtenController.guardarArchivo);

router.get('/get',verifyAccessToken, verifyAdminPermission, writtenController.allGetFiles); //obtener todos los documentos

router.get('/get/search', verifyAccessToken, decodeSearchParameters, errorHandler, 
writtenController.searchDataFiles);

router.get('/user/get/:id', verifyAccessToken, writtenController.getFilesByIdUser) //obtener documentos de un usuario

router.get('/get/:id', verifyAccessToken, writtenController.getFileById); //obtener documentos por id

router.patch('/update/:id', verifyAccessToken, sanitizeUpdateData, validateUpdateData, writtenController.updateFileById);

router.delete('/delete/:id',verifyAccessToken, writtenController.deleteFileById);

module.exports = router;

