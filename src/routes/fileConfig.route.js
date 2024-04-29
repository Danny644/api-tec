const express = require('express');
const fileConfigController = require('../controllers/fileConfig.controller');
const {  verifyAccessToken } = require('../middlewares/auth.middlewares');
const { verifyAdminPermission } = require('../middlewares/checkPermission.middleware');
const {validateFiled, validateUpdateField, handleValidationErrors  } = require('../middlewares/fields.middleware');
const { decodeSearchParameters, errorHandler } = require('../middlewares/decodedSearch.middleware');


const router = express.Router()

router.post(
    '/save-config',
    verifyAccessToken,
    verifyAdminPermission,
    fileConfigController.SaveConfig
);

router.get(
    '/get',
    verifyAccessToken,
    fileConfigController.getConfig
);

router.get('/get/fields',
verifyAccessToken,
verifyAdminPermission,
fileConfigController.getFields);

router.post('/add/field',
verifyAccessToken,
verifyAdminPermission,
validateFiled,
handleValidationErrors, 
fileConfigController.addField);

router.patch('/update/field/:id',
verifyAccessToken,
verifyAdminPermission,
validateUpdateField,
handleValidationErrors, 
fileConfigController.updateField);

router.delete('/delete/field/:id',
verifyAccessToken,
verifyAdminPermission, 
fileConfigController.deleteField);

router.get('/search/field',
verifyAccessToken,
verifyAdminPermission,
decodeSearchParameters, errorHandler, 
fileConfigController.searchFieldByName);


// router.post(
//     '/save-position',
//     fileConfigController.savePosition
// );

module.exports = router;