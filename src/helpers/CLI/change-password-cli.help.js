const UserModel = require('../../models/users.model');
const passwordUtils = require('../../utils/pass.util');

async function changePassword(email, newPassword) {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            console.log(`Usuario ${email} no encontrado.`);
            return;
        }

        // Verificar si se proporciona una contraseña
        if (!newPassword) {
            console.log('Debe ingresar una contraseña.');
            return;
        }

        // Verificar si la contraseña cumple con los criterios
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            console.log('La contraseña no cumple con los requisitos:');
            console.log('- Debe tener al menos 8 caracteres');
            console.log('- Debe contener al menos una letra');
            console.log('- Debe contener al menos un dígito');
            console.log('- Debe contener al menos uno de los siguientes caracteres @$!%*?&');
            return;
        }

        const password = passwordUtils.encryptPassword(password);

        if (!password) {
            throw new Error('Error al encriptar la contraseña');
        }

        user.password = password;

        await user.save();

        console.log(`Contraseña para el usuario ${email} actualizada correctamente.`);
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
    }
}

const [, , email, newPassword] = process.argv;

changePassword(email, newPassword);