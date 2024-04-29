const { settingPageModel } = require('../models/settingPage.model'); 
const { ImageModel } = require('../models/images.model'); 
const { FontFileModel } = require('../models/fonts.model');


const getConfig = async (req, res) => {
    try {

        const config = await settingPageModel.findOne({type: 'document'}).
        populate('logo', 'url').
        populate('letterhead', 'url').
        sort({ version: -1 }).limit(1);

        if(!config) {
            res.status(404).json({error: 'No hay datos en la configuracion de pagina'});
        }

        if(config.fields.length > 0){

        // Recorre el arreglo field y obtiene las IDs 
        const fontIds = config.fields.map(field => field.font);

        // se busca cada fuente por su ID y se almacena
        const fonts = await FontFileModel.find({ _id: { $in: fontIds } }).select('-__v');;

        // mapeamos cada fuente por su ID y lo convertimos a objeto
        const fontMap = fonts.reduce((acc, font) => {
            acc[font._id] = font;
            return acc;
        }, {});

        // recorremos cada campo del arreglo (de campos) y le asignamos la fuente correspondiente
        config.fields.forEach(field => {
            field.font = fontMap[field.font];
        });}

        res.status(200).json(config);

    } catch (error) {
        console.error(error);
        res.status(500).send({error: 'Error interno del servidor'});
    }
};

const SaveConfig = async (req, res) => {
    try{
      const typeDocument = 'document';

      const setting = await settingPageModel.find({ type: typeDocument });

      if(!setting){
      return res.status(400).send({ message: 'Ya existe una configuracion para documentos de tipo ' + typeDocument });
      }
              
        const letterhead = await ImageModel.findOne({type: 'letterhead'}).sort({ version: -1 }).limit(1);
        const logo = await ImageModel.findOne({ type: 'logo' }).sort({ version: -1 }).limit(1);
        const countS = await settingPageModel.countDocuments();

        const newConfig = new settingPageModel(req.body);
        newConfig.type = 'document';
        newConfig.version =  `version${countS + 1}`;
        newConfig.date = Date.now();

        if (!logo) {
          newConfig.logo = logo._id;
        }
      
        if (!letterhead) {
            newConfig.letterhead = letterhead._id;
        }

        await newConfig.save(); 
    
    res.status(200).send({ message: 'Archivo guardado exitosamente' });
    }catch(error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    }
};

const getFields = async (req, res) => {
    try {

    const typeDocument = 'document';

    const setting = await settingPageModel.findOne({ type: typeDocument }).populate({ path: 'fields.font', select: '-__v' });

    if(!setting) {
       return res.status(404).json({error: 'No existe una configuración para el documento de tipo '+ typeDocument});
    }

      if (setting.fields.length < 1) {
          return res.status(404).json({ error: 'No existen campos, por favor agregue los campos a ocupar' });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10; 

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const fields = setting.fields.slice(startIndex, endIndex);

      res.status(200).json(fields);
      
    } catch (error) {
      res.status(500).send({error: 'Ocurrio un error en el servidor'});     
    }
  };


const addField = async (req, res) => {

   try {
      const { campo } = req.body; 
      const typeDocument = 'document'; 

      campo.key = campo.name;

     let setting = await settingPageModel.findOne({ type: typeDocument });

      if (!setting) {
        const letterhead = await ImageModel.findOne({ type: 'letterhead' }).sort({ version: -1 }).limit(1);
        const logo = await ImageModel.findOne({ type: 'logo' }).sort({ version: -1 }).limit(1);

        const countS = await settingPageModel.countDocuments();
        const newConfig = new settingPageModel({
            type: typeDocument,
            fields: [],
            version: `version${countS + 1}`,
            date: Date.now()
        });

        if (!logo) {
          newConfig.logo = logo._id;
        }
      
        if (!letterhead) {
            newConfig.letterhead = letterhead._id;
        }

        await newConfig.save();
        setting = newConfig;
    }

  
      setting.fields.push(campo);
  
      await setting.save();
  
      res.status(201).json( { message: 'Campo agregado exitosamente', campo } );

    } catch (error) {

      res.status(500).send(error);

    }
  };

const updateField = async (req, res) => {
    try {

    const { id } = req.params;
    const { campo } = req.body;

    const typeDocument = 'document';

    const setting = await settingPageModel.findOne({ type: typeDocument });

    if(!setting) {
       return res.status(404).json({error: 'No existe una configuración para el documento de tipo '+ typeDocument});
    }

      const index = setting.fields.findIndex(item => item.id === id);

      if (index === -1) {
          return res.status(404).json({ error: 'No se encontró el campo a actualizar' });
      }

     setting.fields[index] =  { ...setting.fields[index], ...campo };

     await setting.save();
      
      res.send({message: 'campo actualizado correctamente', campo});

    } catch (error) {
      res.status(500).send(error);     
    }
  };


  const deleteField =  async (req, res) => {

    try {

    const { id } = req.params;
    //const { tipoDocumento } = req.body;
    
    const typeDocument = 'document';

    const setting = await settingPageModel.findOne({ type: typeDocument });

    if(!setting) {
        return res.status(404).json({error: 'No existe una configuración para el documento de tipo '+typeDocument});
     }

      setting.fields.pull({_id: id});

      await setting.save();

      res.status(200).send({ message: 'Campo eliminado' });

    } catch (error) {
      res.status(500).send({error, message: 'ocurrio un error al eliminar'});
    }
  };

 
  
  const searchFieldByName = async (req, res) => {
    try {
      const { nombre } = req.query;
      const page = parseInt(req.query.page) || 1; 
      const limit = parseInt(req.query.limit) || 10; 

  
      if (!nombre) {
        return res.status(400).json({ message: 'El nombre del campo es requerido.' });
      }
  
      const results = await settingPageModel.aggregate([
        
        { $match: { type: 'document' } },
        { $match: { "fields.name": { $regex: new RegExp(nombre, 'i') } } },
        { $project: {
            fields: {
              $filter: {
                input: "$fields",
                as: "field",
                cond: { $regexMatch: { input: "$$field.name", regex: new RegExp(nombre, 'i') } }
              }
            },      
            _id: 0 
          }
        },
        { $skip: (page - 1) * limit }, 
        { $limit: limit } 
      ]);

      const fields = results.map(doc => doc.fields).flat();

      if(results.length === 0){
        return res.status(404).json({ message: 'No se encontro ningun registro que coincida con la busqueda' });
      }
      res.json(fields);
  
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar los campos', error: error });
    }
  };



// const savePosition = async (req, res) => {
//     try {

//         const position = new positionModel(req.body)

//          await position.save();

//         res.status(200).json(position);

//     } catch (error) {
//         console.error(error);
//         res.status(500).send({error: 'Error interno del servidor'});
//     }
// };

/* const updateConfig = async (req, res) => {
    try{

        const idConfig = req.params.id;     
        const updateConfig = await FileModel.findByIdAndUpdate(idConfig, req.body, { new: true });  
        
        if(!updateConfig) {
            res.status(404).send({error: 'No se encontro el archivo a actualizar'});
        }
    
    res.status(200).send({ message: 'Archivo guardado exitosamente' });
    }catch(error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    }
}; */

module.exports = { SaveConfig, getConfig, getFields, updateField, deleteField, addField, searchFieldByName };