const { DepartamentModel } = require('../models/departments.model');

const getDepartamentSeries = async (departamentName, filesTotals) => {
    try {
        // Lógica para obtener la serie del departamento
        const departament = await DepartamentModel.findOne({ name: departamentName });

        if (!departament) {
            throw new Error('Departamento no encontrado');
        }

        // Incrementa el contador de series y guardar en la base de datos
/*         departament.series = (departament.series + 1) || 1;
        await departament.save(); */

        // Generar la serie del oficio
        const seriesOfficeDepartment = `${departament.series}/${filesTotals.toString().padStart(4, '0')}/2024`;

        return seriesOfficeDepartment;
    } catch (error) {
        console.error(error);
        send('Error al obtener la sere del departamento');
    }
};

module.exports = { getDepartamentSeries };