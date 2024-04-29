const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Importa la función convertirFecha 
const convertirFecha = require('../lib/dateFormat.js');

//importa las configuracines del asset
const { getUrlFont, getUrlImagen } = require('../services/assetsConfig.service.js');

const generarPDF = async (nuevoArchivo, numeroOficio) => {
    
    try{

        return new Promise( async (resolve, reject) => {

            //configuración del documento (tamaño y margenes)
            const pdfDoc = new PDFDocument({
                size: 'LETTER',
                margin: {
                    top: -85.04,
                    bottom: 56.7,
                    left: 72,
                    right: 56.7
                }
            });
    
        // Configuraciones de estilo y formato
        const fontPath = await getUrlFont('fonts');
        const fontBoldPath = path.join(__dirname, '../assets/fonts/Montserrat-Bold.ttf');
        const fontPathDefault = path.join(__dirname, '../assets/fonts/Montserrat-Regular.ttf');
        const fontBoldPathDefault = path.join(__dirname, '../assets/fonts/Montserrat-Bold.ttf');
        
        pdfDoc.font(fontPath).fontSize(12);
      
        // Agrega imagen al encabezado
        const imagePath =await getUrlImagen('logos');
        pdfDoc.image(imagePath, 71, 71, { width: 264.1889763779212, height: 33.165354330704695, align: 'left' });
        pdfDoc.font(fontBoldPath).fontSize(8).text('Instituto Tecnológico de Tlaxiaco', { align: 'right', bold: true });
        pdfDoc.font(fontPath);
        pdfDoc.fontSize(7).text(`${nuevoArchivo.departamentoEmisor}`, { align: 'right', bold: true });
    
        pdfDoc.fontSize(12)
    
        // Personaliza el PDF con un tipo de letra, negritas, alineación, etc.
        pdfDoc.moveDown(3);
        pdfDoc.text('Heroica Ciudad de Tlaxiaco, Oax; '+ `${convertirFecha(nuevoArchivo.fecha)}`, { align: 'right', bold: true });
        pdfDoc.fillColor('black');
        pdfDoc.text(`OFICIO: ${numeroOficio}`, { align: 'right', bold: true });
        pdfDoc.text(`ASUNTO: ${nuevoArchivo.asunto}`, { align: 'right', bold: true });
        pdfDoc.moveDown(2);
        pdfDoc.font(fontBoldPath).text(`${nuevoArchivo.destinatario}`.toUpperCase(), { align: 'left', fill: true });
        pdfDoc.text(`${nuevoArchivo.puesto}`.toUpperCase(), { align: 'left', bold: true });
        pdfDoc.text('PRESENTE', { align: 'left', bold: true });
        pdfDoc.moveDown(2);
        pdfDoc.font(fontPath);
        pdfDoc.text(`${nuevoArchivo.contexto}`, { align: 'justify', bold: true });
        pdfDoc.moveDown(2);
        pdfDoc.font(fontBoldPath).text('ATENTAMENTE', { align: 'left', bold: true });
        pdfDoc.font(fontPath);
        pdfDoc.text('Excelencia en Educación Tecnológicas.®', { align: 'left', bold: true });
        pdfDoc.text('Educación, Ciencia y Tecnología, Progreso Dia con Dia.®', { align: 'left', bold: true });
        pdfDoc.moveDown(4);
        pdfDoc.font(fontBoldPath).text(`${nuevoArchivo.emisor}`.toUpperCase(), { align: 'left', bold: true });
        pdfDoc.text(`${nuevoArchivo.ocupacionEmisor}`.toUpperCase(), { align: 'left', bold: true });
        pdfDoc.moveDown(2);
        pdfDoc.font(fontPath);
        pdfDoc.text('ARPG/'+`${nuevoArchivo.rubricas}`, { align: 'left', bold: true });
        pdfDoc.text(`${nuevoArchivo.ccp}`, { align: 'left', bold: true });
    
        pdfDoc.moveDown(4);
        const imgBottonPath = await getUrlImagen('letterheads');
        pdfDoc.image(imgBottonPath, { width: 507.401574803089, height: 114.8031496062855, align: 'center',  baseline: 'bottom' });
        
    
        const buffers = []; // arreglo donde se almacenara los datos del archivo
    
            pdfDoc.on('data', buffers.push.bind(buffers)); //este evento se dispara cada vez que se generan datos en el documento PDF,
                                                           // en este caso, los datos se almacenan en un arreglo llamado 'buffres'.
    
            pdfDoc.on('end', () => { // se dispara cuando finaliza la generación del documento PDF y devuelve un buffer con el documento PDF
                const pdfBuffer = Buffer.concat(buffers); // Concatenar todos los buffers en un único buffer
                resolve({ pdfBuffer, numeroOficio }); //Resuelve la promesa con el buffer del PDF y el número de oficio
            });
            pdfDoc.end();// Finaliza la generación del documento PDF.
        });

    }catch(err){
        console.error('Error al generar el PDF:', error);
        return { error: 'Error al generar el PDF' };

    }
};

module.exports = { generarPDF };



