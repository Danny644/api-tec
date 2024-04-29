// Función para convertir la fecha al formato DD/MM/YYYY

 /**
             * La siguiente función ayuda formatear una fecha.
             *
             * Ingresa una fecha en formato Date y la devuelve en el formato DD/MM/YYYY
             *
             * @param fecha parametro en formato date.
             * @throws {TypeError} si ocurre algun error devuelve un string.
*/

function convertirFecha(fecha) {
    try{
      if (!(fecha instanceof Date)) {
        throw new TypeError('El parámetro proporcionado no es una instancia de Date.');
    }
    // Obtiene día, mes y año
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Nota: los meses comienzan desde 0
    const anio = fecha.getFullYear();
  
    // Formatea la fecha con ceros a la izquierda solo si lo necesita
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
  
    // Construye la cadena (string) de fecha en formato DD/MM/YYYY
    const fechaFormateada = `${diaFormateado}/${mesFormateado}/${anio}`;
  
    return fechaFormateada;
    }catch(error){
      return 'sin fecha';
    }
  }
  
  // Exporta la función para que pueda ser utilizada en otros módulos
  module.exports = convertirFecha;