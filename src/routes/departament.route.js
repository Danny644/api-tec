const express = require('express');

const departamentController = require('../controllers/departament.controller');

const {  verifyAccessToken } = require('../middlewares/auth.middlewares');

const router = express.Router();

router.post('/save-departament',  verifyAccessToken, departamentController.createDepartments);
router.get('/get',  verifyAccessToken, departamentController.getAllDepartaments);
router.get('/get/:id',  verifyAccessToken, departamentController.getDepartamentById);
router.patch('/update/:id',  verifyAccessToken, departamentController.updateDepartamentById);
router.delete('/delete/:id',  verifyAccessToken, departamentController.deleteDepartamentById);

module.exports = router;

