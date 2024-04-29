const  {DepartmentModel}  = require('../models/departments.model');

exports.createDepartments = async (req, res) => {
    try {

        if (req.user.permissionLevel !== 1) {
            return res.status(403).send({ message: 'No tiene permisos suficiente para realizar esta acción' });
        }
        const newDepartment = new DepartmentModel(req.body);
        await newDepartment.save();
        res.status(200).send(newDepartment);
    }catch(error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    }
}

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await DepartmentModel.find();
        if(!departments) {
         return res.status(404).json({error: 'No existen registros de departamentos'});
        }
        res.status(200).json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).send({error: 'Error interno del servidor'});
    }
}

exports.getDepartmentById = async (req, res) => {
        try {
            const _id = req.params.id;
            const department = await DepartmentModel.findById({_id});
            
            if (!department){      
            return res.status(404).send({error: 'No se encontro el departamento solicitado'});
            } 
            res.status(200).json(department);
    
        } catch (error) {
            console.error(error);
            res.status(500).send({error: 'Error interno del servidor'});
        }
    };

    exports.updateDepartmentById = async (req, res) => {
        try{
            if (req.user.permissionLevel !== 1) {
                return res.status(403).send({ message: 'No tiene permisos suficiente para realizar esta acción' });
            }
            const _id = req.params.id;
            const department = await DepartmentModel.findByIdAndUpdate(_id, req.body, {new: true});
            if(!department) {
                return res.status(404).send({error: 'No se encontro el departamento que desea actualizar'});
            }
            res.status(200).send(department);

        }catch (error) {
            res.status(500).send({error: 'Error interno del servidor'})
        }
    };

    exports.deleteDepartmentById = async (req, res) => {
        try{
            if (req.user.permissionLevel !== 1) {
                return res.status(403).send({ message: 'No tiene permisos suficiente para realizar esta acción' });
            }
            const _id = req.params.id;
            const department = await DepartmentModel.findByIdAndDelete(_id)
            if(!department){
               return res.status(404).send({ error: 'No se encontro el departamento a eliminar'});
            }
            res.status(200).send({menssage: 'El departamento se elimino exitosamente'});
        }catch(error){
            res.status(500).send({ error: 'Error interno del servidor' });
        }
    }
