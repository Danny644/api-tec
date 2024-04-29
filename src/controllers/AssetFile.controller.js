const { settingPageModel } = require('../models/settingPage.model'); 
const { ImageModel } = require('../models/images.model'); 
const { FontFileModel } = require('../models/fonts.model');

const fs = require('fs');
const path = require('path');
const assetMiddleware = require('../middlewares/assetFile.middleware');;

// la función saveUtilsData manejar la subida de archivos
const saveAssetFont = async (req, res) => {
    try {

        // Almacena los archivos en MongoDB
        const fonts = req.files.map(font => ({
            name: font.filename,
            url: font.path
        }));

        await FontFileModel.create(fonts);
        res.status(200).send({menssage: 'Archivo guardado exitosamente'});

    } catch (error) {
        console.error(error);
        res.status(500).send({error: 'Error interno del servidor'});
    }
};

const saveAssetImage = async (req, res) => {
    try { 
            // Obtiene el tipo de archivo y el nombre del archivo
            const type = req.body.tipo;
            const nameFile = req.files[0].filename;

            const countImg = await ImageModel.countDocuments({ type: type });

            const newAsset = {
                    name: nameFile,
                    url:path.join(__dirname, `../assets/${type}s/${nameFile}`),
                    type: type,
                    version: `version${countImg + 1}`
            };
    
            const image = new ImageModel(newAsset);
            await image.save();

            let settingPage = await settingPageModel.findOne({ type: 'document' }); 

            if (!settingPage) {
                const countS = await settingPageModel.countDocuments();
                const newConfig = new settingPageModel({
                    type: "document",
                    fields: [],
                    version: `version${countS + 1}`,
                    date: Date.now()
                });

                await newConfig.save();
                settingPage = newConfig;
            }

            if (type === 'letterhead') {
                settingPage.letterhead = image._id;
            } else if (type === 'logo') {
                settingPage.logo = image._id;
            }

            const countSetting = await settingPageModel.countDocuments({ type: "document" });

            // Actualiza la versión y la fecha
            settingPage.version = `version${countSetting + 1}`;
            settingPage.date = Date.now() ;

            await settingPage.save();

             return res.status(200).send({ message: 'Archivo guardado exitosamente' });
        
    } catch (error) {
        console.error(error);
        res.status(500).send({error: 'Error interno del servidor'});
    }
};


const getAllFonts = async (req, res) => {
    try {

        const fonts = await FontFileModel.find().select('-__v');

        if(!fonts) {
            res.status(404).json({error: 'No se encontraron fuentes'});
        }
        res.status(200).json(fonts);
    } catch (error) {
        console.error(error);
        res.status(500).send({error: 'Error interno del servidor'});
    }
};

/* const SaveSelectFonts = async (req, res) => {
    try{
        const idConfig = req.params.id;
        const font = req.body.id;     
        const updateConfig = await FileModel.findByIdAndUpdate(idConfig,{font}, { new: true });  
        
        if(!updateConfig) {
            res.status(404).send({error: 'No se encontro el archivo a actualizar'});
        }
    
    res.status(200).send({ message: 'Archivo guardado exitosamente' });
    }catch(error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    }
}; */


const deleteFontById = async (req, res) => {

        try{
            const fontId = req.params.id;
        
            //const font = await FontFileModel.findById(fontId);

            // Obtener el nombre de la fuente
            //const nameFont = font.name;
    
            // Eliminar los archivos relacionados con el id de la fuente
            //const deleteFontConfig = await FileModel.deleteMany({ font: fontId });
    
            // Eliminar la fuente por ID
            const deleteFont = await FontFileModel.findByIdAndDelete(fontId);

            if (!deleteFont) {
                return res.status(404).send({ error: 'No se encontró la fuente con el nombre proporcionado' });
            }

            res.status(200).json( { message: 'Archivo eliminado exitosamente' } );

        }catch(error){
            console.error(error);
            res.status(500).send({ error: 'Error interno del servidor' });
        }    
                
    };



module.exports = { saveAssetFont, saveAssetImage, getAllFonts,  deleteFontById };


