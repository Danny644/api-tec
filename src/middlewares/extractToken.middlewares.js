const jwt = require('jsonwebtoken');
const twjErrors = require('../helpers/errors/jwt.error');


function extractTokens(req, res, next) {
    try{

    const authorizationHeader = req.headers.authorization;
    req.tokenRefresh = req.cookies?.refreshToken;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Necesitas autentificarte' });
    } 

    if (!req.tokenRefresh) {
        return res.status(401).send({ message: 'Su sesión ha caducado' });
    } 

    req.accessToken = extractAccessToken(authorizationHeader);    
   

    if (!req.accessToken) {
        return res.status(401).send({ message: 'Token de acceso no proporcionado' });
    }

    next()
     }catch(err){
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ message: 'Token de acceso expirado' });
        }
        res.status(401).send({ message: twjErrors[err.message]});
    } 
    
}

function extractAccessToken(authorizationHeader) {
    return authorizationHeader.split(' ')[1];
}

module.exports = {extractTokens}