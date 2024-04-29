const  {DepartamentModel}  = require('../models/departments.model');

exports.createDepartments = async (req, res) => {
    try {
        if (req.user.permissionLevel !== 1) {
            return res.status(403).send({ message: 'No tiene permisos suficiente para realizar esta acción' });
        }
        const newDepartment = new DepartamentModel(req.body);
        await newDepartment.save();
        res.status(200).send(newDepartment);
    }catch(error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    }
}

exports.getAllDepartaments = async (req, res) => {
    try {
        const departaments = await DepartamentModel.find();
        if(!departaments) {
            res.status(404).json({error: 'No existen registros de departamentos'});
        }
        res.status(200).json(departaments);
    } catch (error) {
        console.error(error);
        res.status(500).send({error: 'Error interno del servidor'});
    }
}

exports.getDepartamentById = async (req, res) => {
        try {
            const _id = req.params.id;
            const departament = await DepartamentModel.findById({_id});
            
            if (!departament){      
            res.status(404).send({error: 'No se encontro el departamento solicitado'});
            } 
            res.status(200).json(departament);
    
        } catch (error) {
            console.error(error);
            res.status(500).send({error: 'Error interno del servidor'});
        }
    };

    exports.updateDepartamentById = async (req, res) => {
        try{
            if (req.user.permissionLevel !== 1) {
                return res.status(403).send({ message: 'No tiene permisos suficiente para realizar esta acción' });
            }
            const _id = req.params.id;
            const departament = await DepartamentModel.findByIdAndUpdate(_id, req.body, {new: true});
            if(!departament) {
                res.status(404).send({error: 'No se encontro el departamento que desea actualizar'});
            }
            res.status(200).send(departament);

        }catch (error) {
            res.status(500).send({error: 'Error interno del servidor'})
        }
    };

    exports.deleteDepartamentById = async (req, res) => {
        try{
            if (req.user.permissionLevel !== 1) {
                return res.status(403).send({ message: 'No tiene permisos suficiente para realizar esta acción' });
            }
            const _id = req.params.id;
            const departament = await DepartamentModel.findByIdAndDelete(_id)
            if(!departament){
                res.status(404).send({ error: 'No se encontro el departamento a eliminar'});
            }
            res.status(200).send({menssage: 'El departamento se elimino exitosamente'});
        }catch(error){
            res.status(500).send({ error: 'Error interno del servidor' });
        }
    }
