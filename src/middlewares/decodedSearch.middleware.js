const errorHandler = (err, req, res, next) => {
    //console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
  };
  
  const decodeSearchParameters = (req, res, next) => {
    try {
      // se decodifico cada parametro de la busqueda para evitar inyeciones XSS
      for (let key in req.query) {
        req.query[key] = decodeURIComponent(req.query[key]);
        console.log(req.query[key]);
      }
      next();
    } catch (err) {
      next(err); 
    }
  };

module.exports = { decodeSearchParameters, errorHandler };
  