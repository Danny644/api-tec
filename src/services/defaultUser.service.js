const UserModel = require('../models/users.model');
const passwordUtils = require('../utils/pass.util');

async function createAdminUser() {
    try {
        const userCount = await UserModel.countDocuments();
        if (userCount === 0) {
            const password = process.env.DEFAULT_PASSWORD;
            // Si no hay usuarios, se crea un usuario administrador
            const encryptedPassword = passwordUtils.encryptPassword(password);
            if (!encryptedPassword) {
                throw new Error('Error al encriptar la contraseña');
            }
            const adminUser = new UserModel({
                name: process.env.DEFAULT_USER,
                email: process.env.DEFAULT_EMAIL,
                password: encryptedPassword,
                permissionLevel: 1, 
            });
            await adminUser.save();
            console.log('Usuario administrador creado con éxito');
        }
    } catch (error) {
        console.error('Error al verificar usuarios en la base de datos:', error);
    }
}

module.exports = {
    createAdminUser
};