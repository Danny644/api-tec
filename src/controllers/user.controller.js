const UserModel = require('../models/users.model');
const jwt = require('jsonwebtoken');
const passwordUtils = require('../utils/pass.util');
const { paginationOptions, paginationArray } = require('../utils/paginationOptions.util.js');

exports.getAll = async (req, res) => {

    try {
        
        if (req.user.permissionLevel !== 1) {
            return res.status(403).send({ message: 'Permiso insuficiente para obtener usuarios' });
        }

        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 


        let select = '-password -permissionLevel -refreshToken -revokedTokens -resetPasswordToken ';
             select += '-resetPassword -resetPasswordExpires -resetPasswordTokenExpires -loggedOut -__v';

        const populate = { path: 'department', select: 'name -_id' };

        const options = paginationOptions(page, limit, select, populate);


        const users = await UserModel.paginate({}, options);

        if (!users.docs || users.docs.length === 0) {
            return res.status(404).json({ error: 'No existen registros de usuarios' });
        }

        res.status(200).send(users);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.getAllDepartmentHead = async (req, res) => {
    try {
        if (req.user.permissionLevel !== 1) {
            return res.status(403).send({ message: 'Permiso insuficiente para obtener a los jefes de departamentos' });
        }

        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;

        // Filtra usuarios por nivel de permiso (en este caso, 2 para jefes de departamento)
        /* const departmentHead = await UserModel.find({ permissionLevel: 2 })
            .select('-password')
            .populate('department', 'name') */

           
            let select = '-password -permissionLevel -refreshToken -revokedTokens -resetPasswordToken ';
                select += '-resetPassword -resetPasswordExpires -resetPasswordTokenExpires -loggedOut -__v';

            const populate = { path: 'department', select: 'name -_id' };
    
            const options = paginationOptions(page, limit, select, populate);

            const departmentHead = await UserModel.paginate({ permissionLevel: 2 }, options);

        if (!departmentHead || departmentHead.length === 0) {
            return res.status(404).json({ error: 'No existen registros de jefes de departamento' });
        }

        res.status(200).send(departmentHead);
            
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.getById = (req, res) => {
    try{
        let select = '-password -permissionLevel -refreshToken -revokedTokens -resetPasswordToken ';
                select += '-resetPassword -resetPasswordExpires -resetPasswordTokenExpires -loggedOut -__v';
                
        UserModel.findById(req.params.userId).
        select(select).
        then((result) => {
        if(!result){
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        result = result.toJSON();
        res.status(200).send(result);
    });
        }catch(error){
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
};

exports.patchById = async (req, res) => {
    try {

        let select = '-password -permissionLevel -refreshToken -revokedTokens -resetPasswordToken ';
            select += '-resetPassword -resetPasswordExpires -resetPasswordTokenExpires -loggedOut -__v';

        const updatedUser = await UserModel.findByIdAndUpdate(req.params.userId, req.body, { new: true }).
                            select(select);
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const sanitizedUser = updatedUser.toJSON();

        res.status(200).json(sanitizedUser);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'El email ingresado debe ser distinto al existente' });
    }
};

exports.deleteById = async (req, res) => {
    try {
        if (req.user.permissionLevel !== 1) {
            return res.status(403).send({ message: 'Permiso insuficiente para eliminar al usuario' });
        }
        const deletedUser = await UserModel.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'El usuario que trata de eliminar no existe' });
        }
        res.status(200).json({ message: 'El usuario ha sido eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



exports.getByName = async (req, res) => {
    try {
        if (req.user.permissionLevel !== 1) {
            return res.status(403).send({ message: 'Permiso insuficiente para buscar usuarios' });
        }

        const { nombre } = req.query;
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;

        if (!nombre) {
            return res.status(400).json({ error: 'El parámetro de consulta "nombre" es necesario para la búsqueda' });
        }

           let select = '-password -permissionLevel -refreshToken -revokedTokens -resetPasswordToken ';
            select += '-resetPasswordExpires -resetPasswordTokenExpires -loggedOut -__v';

        const populate = { path: 'department', select: 'name -_id' };

        const options = paginationOptions(page, limit, select, populate);

        const result = await UserModel.paginate(
            { name: { $regex: new RegExp(nombre, 'i') } },
            options
        );

        if (!result.docs || result.docs.length === 0) {
            return res.status(404).json({ error: 'No se encontraron usuarios con el nombre proporcionado' });
        }

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.resetPassword = async (req, res) => {
    try{
        const  userId  = req.params.id; 

        console.log( userId );

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        // Genera una contraseña temporal de 1 hora
        const temporaryPassword = passwordUtils.generateTemporaryPassword();
        const temporaryPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); 

        if (!temporaryPassword) {
            return res.status(404).send({ message: 'Ocurrio un error al generar la contraseña temporal' });
        }

        // Encripta la contraseña temporal y almacenarla en el usuario
        user.resetPassword = passwordUtils.encryptPassword(temporaryPassword);

        if (!user.resetPassword) {
            return res.status(404).send({ message: 'ocurrio un error al encriptar la contraseña' });
        }

        user.resetPasswordExpires = temporaryPasswordExpiry;
        await user.save();

        // posible envio a correo electronico si es necesario (pendiente)

        res.status(200).send({ message: 'Contraseña temporal generada exitosamente', pass: temporaryPassword  });

    }catch(error) {
        res.status(500).send({ message: 'Error interno del servidor' });
    }
};

