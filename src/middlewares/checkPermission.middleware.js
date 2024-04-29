function verifyAdminPermission(req, res, next) {
    try {

        if (req.user.permissionLevel !== 1) {
            return res.status(403).send({ message: 'Permiso insuficiente para realizar esta acción' });
        }
        next();
    } catch (error) {
        // Manejar errores internos del servidor
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
}

module.exports = { verifyAdminPermission };