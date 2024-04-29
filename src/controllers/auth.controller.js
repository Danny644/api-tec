const UserModel = require('../models/users.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { tempLoginPassword } = require('../services/tempLoginPassword.service');
const passwordUtils = require('../utils/pass.util');


exports.login = (req, res) => {
    UserModel.findOne({ email: req.body.email }).then(async (user) => {
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        let salt = user.password.split('$')[0];
        let hash = crypto.createHmac('sha512', salt)
            .update(req.body.password)
            .digest("base64");

        if (user.password !== salt + "$" + hash) {       
           
                if (user.resetPassword) {
                    const result = await tempLoginPassword(user, req);
                    console.log(result);
                    return res.status(result.status).send({ message: result.message });
                }else
                return res.status(422).send({ message: 'Invalid password' });
           
        }
        user.loggedOut = false;
        await user.save();
        
        let token = jwt.sign({ id: user._id, permissionLevel: user.permissionLevel }, process.env.SECRET_KEY, 
            { expiresIn:  process.env.AUTH_ACCESS_TOKEN_EXPIRY } );
        
        let refreshToken = generateRefreshToken(user, res);
        user.refreshToken = refreshToken;

        const savedUser = await user.save();

        res.cookie("refreshToken", savedUser.refreshToken, {
            httpOnly: true,
            secure: !(process.env.MODO === "dev"),
            expires: new Date(Date.now() + 60 * 60 *24 * 1000),
            SameSite: "none"
        });

        res.json({ accessToken: token });

    }).catch((error) => {
        console.error(error);
        res.status(500).send({ message: 'Error during login', error: error });//eliminar el envio de error en producción
    });
};


exports.register = (req, res) => {
    if (req.user?.permissionLevel !== 1) {
        return res.status(403).send({ message: 'Permiso insuficiente para registrar usuarios' });
    }
    // Verifica si el usuario ya existe por su dirección de correo electrónico
    UserModel.findOne({ email: req.body.email }).then((existingUser) => {
        if (existingUser) {
            return res.status(400).send({ message: 'El email esta en uso' });
        }

        // Crea un nuevo usuario
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt)
            .update(req.body.password)
            .digest('base64');

        const newUser = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: `${salt}$${hash}`,
            permissionLevel: req.body.permissionLevel, //  nivel de permiso 
        });

        // Guardar el nuevo usuario en la base de datos
        newUser.save().then((savedUser) => {    
                res.status(201).send({ message: 'Usuario registrado exitosamente' });
        }).catch((error) => {
            res.status(500).send({ message: 'Error al crear al usuario', error: error });
        });
    });
};


exports.refreshToken = (req, res) => {

    let refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).send({ error: 'Necesitas autentificarte' });
    }

    // Esto verifica si el token de actualización ha caducado
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {

            // El token de actualización no es válido o ha caducado
            return res.status(401).send({ error: 'Token de actualización no válido' });
        }

        // Busca al usuario por refreshToken en la base de datos
        UserModel.findOne({ refreshToken: refreshToken, loggedOut: false }).then(async (user) => {
            if (!user) {
                return res.status(404).send({ error: 'Token de actualización no válido' });
            }

            // Genera nuevo token de acceso si el token de actualización existe
            let token = jwt.sign({ id: user._id, permissionLevel: user.permissionLevel }, 
                process.env.SECRET_KEY, { expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRY });    

            res.status(200).send({ accessToken: token });

        }).catch((error) => {
            res.status(500).send({ message: 'Error al actualizar el token de acceso', error: error });
        });
    });
};



exports.logout = (req, res) => {

    const accessToken = req.accessToken;
    const refreshToken = req.refreshToken;
    UserModel.findOne({ refreshToken: refreshToken, loggedOut: false }).then((user) => {
        if (user) {
            if (accessToken && refreshToken) {
                user.loggedOut = true;
                user.revokedTokens.push({ accessToken, refreshToken });
                user.save();
            }
            res.clearCookie("refreshToken");
            res.json({ message: 'Cierre de sesión exitoso' });
        } else {
            res.status(404).send({ message: 'Su sesión no está activa' });
        }
    }).catch((error) => {
        res.status(500).send({ message: 'Error al actualizar el estado de la sesión', error: error });
    });    
};


exports.changeForgottenPassword = async (req, res) => {
    try{
        const { newPassword } = req.body;

        const user = req.user;

        // Restablecer la contraseña
        user.password = passwordUtils.encryptPassword(newPassword);
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;
        await user.save();

        res.status(200).send({ code:200, message: 'Contraseña restablecida exitosamente' });
    }catch(error){
        res.status(500).send({ error: 'Error interno del servidor', message: error.message });
   }
};

function generateRefreshToken(user) {
      return  jwt.sign({ id: user._id, permissionLevel: user.permissionLevel },
         process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRY });
}