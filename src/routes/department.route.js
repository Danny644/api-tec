const express = require('express');

const departmentController = require('../controllers/department.controller');

const {  verifyAccessToken } = require('../middlewares/auth.middlewares');
const { verifyAdminPermission } = require('../middlewares/checkPermission.middleware');
const { validateDepartment, validateUpdateDepartment } = require('../middlewares/department.middleware');

const router = express.Router();

router.post('/save-department',  verifyAccessToken, verifyAdminPermission, validateDepartment, departmentController.createDepartments);
router.get('/get',  verifyAccessToken, verifyAdminPermission, departmentController.getAllDepartments);
router.get('/get/:id',  verifyAccessToken, verifyAdminPermission, departmentController.getDepartmentById);
router.patch('/update/:id',  verifyAccessToken, verifyAdminPermission, validateUpdateDepartment, departmentController.updateDepartmentById);
router.delete('/delete/:id',  verifyAccessToken, verifyAdminPermission, departmentController.deleteDepartmentById);

module.exports = router;