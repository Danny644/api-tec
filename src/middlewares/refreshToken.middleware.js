const { UserModel } = require('../models/users.model')


 const requireRefreshToken = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
       
        if (!refreshToken)  return res.status(401).send({ message: 'Necesitas autentificarte' });
        
        // Buscar al usuario por refreshToken
        UserModel.findOne({ refreshToken: refreshToken, loggedOut: false }).then((user) => {
            if (!user) {
                return res.status(401).send({ message: 'Token de actualización no válido' });
            }
            res.user = user;
            next();
        
        }).catch((error) => {
            res.status(500).send({ message: 'Error al actualizar el token de acceso', error: error });
        });

    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .send({ error:'Error interno del servidor' });
    }
};

module.exports = { requireRefreshToken }
