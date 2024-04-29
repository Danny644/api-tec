const express = require('express');
const fileController = require('../controllers/AssetFile.controller');
const assetMiddleware = require('../middlewares/assetFile.middleware');
const {  verifyAccessToken } = require('../middlewares/auth.middlewares');
const { verifyAdminPermission } = require('../middlewares/checkPermission.middleware');

const router = express.Router();

router.post(
    '/save-asset-data',
    verifyAccessToken,
    verifyAdminPermission,
    assetMiddleware.fontUpload.array('archivos'),
    assetMiddleware.multerErrorHandler,
    fileController.saveAssetFont
);

router.post(
    '/save-asset-image',
    verifyAccessToken,
    verifyAdminPermission,
    assetMiddleware.imageUpload.array('archivos'),
    assetMiddleware.multerErrorHandler,
    fileController.saveAssetImage
);

router.get(
    '/get/fonts',
    verifyAccessToken,
    verifyAdminPermission,
    fileController.getAllFonts
);

module.exports = router;

