const passwordUtils = require('../utils/pass.util');

async function tempLoginPassword(user, req) {
    try {
        const decryptResult = passwordUtils.decryptPassword(user?.resetPassword, req.body.password);

        if (!decryptResult) {
            return { status: 401, message: 'error al descifrar la contraseña' };
        }

        if (user.resetPasswordExpires < Date.now()) {
            user.resetPassword = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return { status: 422, message: 'La contraseña temporal ya expiró' };
        }

        if (user.resetPassword === decryptResult.salt + "$" + decryptResult.hash) {
            // Genera token de restablecimiento de contraseña
            const resetPasswordToken = passwordUtils.generateResetPasswordToken();

            if (!resetPasswordToken) {
                return { status: 422, message: 'Ocurrió un error al generar el token para el cambio de contraseña' };
            }

            user.resetPassword = undefined;
            user.resetPasswordExpires = undefined;

            // Almacenar el token y su fecha de expiración en el usuario
            user.resetPasswordToken = resetPasswordToken;
            user.resetPasswordTokenExpires = new Date(Date.now() + 60 * 10 * 1000);
            await user.save();

            return {
                status: 200,
                message: {
                    resetPasswordToken: resetPasswordToken,
                    message: 'Tienes solo 10 minutos para resetear la contraseña',
                    message2: 'Al terminar los 10 minutos tendrás que pedirle al administrador que resetee nuevamente la contraseña'
                }
            };
        } else {
            return { status: 422, message: 'La contraseña no es válida, vuelve a intentarlo' };
        }
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Error al procesar la contraseña', error: error.message };
    }
}

module.exports = { tempLoginPassword };