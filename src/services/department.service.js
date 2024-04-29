const { DepartmentModel } = require('../models/departments.model');

const getDepartmentSeries = async (departmentName, filesTotals) => {
    try {
        // Lógica para obtener la serie del departamento
        const department = await DepartmentModel.findOne({ name: departmentName });

        if (!department) {
            throw new Error('Departamento no encontrado');
        }

        // Generar la serie del oficio
        const seriesOfficeDepartment = `${department.series}/${filesTotals.toString().padStart(4, '0')}/2024`;

        return seriesOfficeDepartment;
    } catch (error) {
        console.error(error);
        send('Error al obtener la sere del departamento');
    }
};

module.exports = { getDepartmentSeries };