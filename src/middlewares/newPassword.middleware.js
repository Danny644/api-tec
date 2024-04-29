const UserModel = require('../models/users.model');

async function tokenPassword(req, res, next) {
    try{

    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Utilice Bearer para enviar el token' });
    } 
    
    const resetTokenPassword = authorizationHeader.split(' ')[1];
    const user = await UserModel.findOne({
        resetPasswordToken: resetTokenPassword,
        resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
        const temp = await UserModel.findOneAndUpdate(
            { resetPasswordToken: resetTokenPassword },
            { $unset: { resetPasswordToken: 1, resetPasswordTokenExpires: 1 } },
            { new: true });

            if (!temp) {
                return res.status(400).send({ error: 'Su token ya fue removido' });
            }
            await temp.save();
        return res.status(400).send({ error: 'Token inválido o expirado' });
    }

    req.resetTokenPassword = resetTokenPassword;
    req.user = user; 
    next();

     }catch(err){

        res.status(401).send({ message: 'Ocurrio un error en el servidor' });
    } 
    
}

module.exports = { tokenPassword }
