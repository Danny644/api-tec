const multer = require('multer');
const fs = require('fs');
const path = require('path'); 

const multerErrorHandler = (err, req, res, next) => {
    if (err) {
        console.error('Error de Multer:', err.message);
        if (err.field === 'imageFilter' || err.field === 'fontFilter') {
            res.status(400).json({ error: 'Error en la subida de archivos', message: err.message });
        } 
        if (err.field === 'imageStorage' || err.field === 'fontStorage') {
            res.status(400).json({ error: 'Error en la subida de archivos', message: err.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        next();
    }
};

// Configuración multer para almacenar archivos de imagen en la carpeta assets
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            const tipo = req.body.tipo;

            if (!tipo)  throw { message: 'El tipo de archivo es incorrecto', field: 'imageStorage' };

            // Verificar si se están subiendo más de una imagen en membrete y logotipos
            const tiposPermitidos = ['logo', 'letterhead'];
            if (tiposPermitidos.includes(tipo) && req.files.length > 1) {
                throw { message: 'Solo se permite subir un archivo de imagen', field: 'imageStorage' };
            }

            const ruta = path.join(__dirname, `../assets/${tipo}s`);
             
            //Verifica si existe la carpeta destino, si no la crea
            if (!fs.existsSync(ruta)) {
                fs.mkdirSync(ruta, { recursive: true });
            }

            cb(null, ruta);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        // funcion que genera un nombre de archivo único 
        const uniqueName = file.originalname;
        cb(null, uniqueName);
    }
});

// Middleware de filtrado para permitir solo archivos JPG y PNG
const imageFileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const extname = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extname)) {
        cb(null, true);
    } else {
        cb({ message: 'Solo se permiten archivos en formato JPG o PNG', field: 'imageFilter' }, false);
    }
};

const imageUpload = multer({ storage: imageStorage, fileFilter: imageFileFilter });


// Configuración multer para almacenar archivos de fuente en la carpeta assets/fonts
const fontStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            //const tipo = req.body.tipo;

            //if (!tipo)  throw { message: 'El tipo de archivo es incorrecto', field: 'fontStorage' };

            const ruta = path.join(__dirname, `../assets/fonts`);

            if (!fs.existsSync(ruta)) {
                fs.mkdirSync(ruta, { recursive: true });
            }

            cb(null, ruta);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        const uniqueName = file.originalname;
        cb(null, uniqueName);
    }
});

// Middleware de filtrado para permitir solo archivos TTF
const fontFileFilter = (req, file, cb) => {
    const allowedExtensions = ['.ttf'];
    const extname = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extname)) {
        cb(null, true);
    } else {
        cb({ message: 'Solo se permite subir archivos de fuente en formato TTF', field: 'fontFilter' }, false);
    }
};

const fontUpload = multer({ storage: fontStorage, fileFilter: fontFileFilter });


module.exports = { multerErrorHandler, imageUpload, fontUpload };



