const puppeteer = require('puppeteer');
// Importa la función convertirFecha 
const convertirFecha = require('../lib/dateFormat.js');

//importa las configuracines del asset
const {  getUrlFont, getFont , getUrlImagen } = require('../services/assetsConfig.service.js');
const fs = require('fs');
//const base64Img = require('base64-img');
const ejs = require('ejs');

const generarPDF = async (nuevoArchivo, numeroOficio) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Configuraciones de estilo y formato
        //const fontPath = await getUrlFont('fonts');
        //const fontBoldPath = path.join(__dirname, '../assets/fonts/Montserrat-Bold.ttf');
       // const fontPathDefault = path.join(__dirname, '../assets/fonts/Montserrat-Regular.ttf');
        //const fontBoldPathDefault = path.join(__dirname, '../assets/fonts/Montserrat-Bold.ttf');

        // Reemplaza los saltos de línea en el contexto HTML
        //const contextoHtml = nuevoArchivo.cuerpo.text.replace(/\n/g, '<br>');
        
        // Agregar imágenes al PDF
        const imgLogoPath = nuevoArchivo.logo ? nuevoArchivo.logo : path.join(__dirname, '../assets/logos/ME-1.PNG');
        const imgLetterheadPath =nuevoArchivo.letterhead ? nuevoArchivo.logo : path.join(__dirname, '../assets/letterheads/MP-1.PNG');
        //const imgLetterheadPath = await getUrlImagen('letterheads');
        //console.log(imgLogoPath);

        // Configuración de posición de las imágenes
        const logoPosition = { x: 10, y: 10, width: 264.1889763779212, height: 33.165354330704695 };
        const letterheadPosition = { x: 0, y: 665, width: 507.401574803089, height: 114.8031496062855 };



        // Contenido HTML y texto plano
        let contenidoHtml = `
         <html>
         <head>
            <style>
                @font-face {
                  font-family: 'Monserrat Medium';
                  src: url('../assets/fonts/Monserrat-Medium.ttf');
                  font-weight: normal;
                  font-style: normal;
                }
            </style>
            <style>
                .alinear-derecha {
                text-align: right !important;
                }
            </style>
            </head>
            <body>
            <div style="position: relative; left: ${logoPosition.x}pt; top: ${logoPosition.y}pt; 
            width: ${logoPosition.width}pt; height: ${logoPosition.height}pt;">
                <img src="${imgLogoPath}" alt="Logo" style="width: 100%; height: 100%;">
            </div>
            <div>
            <div style="margin-bottom: -10pt; margin-top: -30pt;">
            <p class="MsoNormal" align="right" style="text-align:right;">
                <span style="color:white;  background:black; mso-highlight:black;">
                    <b>
                    <span style="font-size:8.0pt; font-family:Monserrat Medium;">
                    Instituto Tecnológico de Tlaxiaco 
                        <o:p></o:p>
                    </span>
                    </b>          
                </span>
                </p>
            </div>
            <div style="margin-bottom: -10pt;">
            <p class="MsoNormal" align="right" style="text-align:right;">
                <span style="color:white; background:black; mso-highlight:black;">
                    <b>
                        <span style="font-size:7.0pt; font-family:Monserrat Medium;">
                        ${nuevoArchivo.departamentoEmisor}  
                            <o:p></o:p>
                        </span>
                    </b>
                </span>    
            </p>
            </div>
            <br>
            <br>
            <br>
            <div style="margin-bottom: -8pt;">
                <p class="MsoNormal" align="right" style=" text-align:right; font-size:11.0pt; font-family:Montserrat;">
                    <span>Heroica Ciudad de Tlaxiaco, Oax;</span>
                    <span background="black">
                    <span color="white">
                   ${convertirFecha(nuevoArchivo.fecha)}
                    </span>
                    </span>
                    <span style="color:white; mso-themecolor:background1;">
                    <o:p></o:p
                    </span>
                </p>
            </div>

            <div style="margin-bottom: -8pt;">
                <p class="MsoNormal" align="right" style="text-align:right; font-size:11.0pt; font-family:Montserrat;">
                <span>
                    OFICIO: ${numeroOficio}
                    <o:p></o:p>
                </span>
                </p>
            </div>
        `;
        for (let index = 0; index < nuevoArchivo.campos.length; index++) {
            const field = nuevoArchivo.campos[index];

            const fontWeight = field.bold ? 'bold' : 'normal';
            let fontPath = await getFont(field.font);
             console.log(fontPath);

             contenidoHtml += `<style>
             @font-face {
                font-family:'${fontPath.name}';
                src: url(${fontPath.url}) format('truetype');
              }
              </style>
            `

            if(index === 0) {
                contenidoHtml += `
                <div style="margin-bottom: -8pt;">
                <p class="MsoNormal" align="right;" style="text-align:${field.alignment};">
                <span style="font-size:${field.size ? field.size : 11.0 }pt; font-family: ${fontPath.name}; font-weight: ${fontWeight};">
                    ASUNTO: ${field.text}
                    <o:p></o:p>
                </span>
                </p>
            </div>
            <br>
            <br>
            <br>
            `

            }else
            if(index === 3){
                contenidoHtml +=  ` <div>
                <p class="MsoNormal">
                    <b>
                        <span style="font-size:${field.size}pt; font-family: Montserrat;">
                          PRESENTE
                            <o:p></o:p>
                        </span>
                    </b>
                </p>
            </div>
            <br>
            <div>
            <p class="MsoNormal" style="text-align: ${field.alignment};">
            <span style="font-family:${field.font}; font-size:${field.size}pt; font-weight: ${fontWeight};">${field.text}</span>
            </p>
            </div>
            <br>
            <br>
            <div  style="margin-bottom: -10pt;">
                <p class="MsoNormal"> 
                        <span style="font-size:$11.0pt; font-family:Montserrat;">
                          ATENTAMENTE
                            <o:p></o:p>
                        </span>
                </p>
            </div>
            <div  style="margin-bottom: -10pt;">
                <p class="MsoNormal">
                        <span style="font-size:11.0pt; font-family:Montserrat;">
                        Excelencia en Educación Tecnológicas.®
                            <o:p></o:p>
                        </span>
                </p>
            </div>
            <div  style="margin-bottom: -10pt;">
                <p class="MsoNormal">
                        <span style="font-size:11.0pt; font-family:Montserrat;">
                        Educación, Ciencia y Tecnología, Progreso Dia con Dia.®
                            <o:p></o:p>
                        </span>
                </p>
            </div>
            <br>
            <br>
            <br>
            <br>`
            }else
           
            contenidoHtml += `
              <div style="margin-bottom: -10pt;">
              <p class="MsoNormal" style="text-align: ${field.alignment};">
                          <span style="font-family: ${fontPath.name}; font-size:${field.size}pt; font-weight: ${fontWeight};">
                              ${field.text}
                              <o:p></o:p>
                          </span>
                  </p>
              </div>
            `;
          };

   contenidoHtml +=`
   <br>
   <br>
   <br>
   <br>
   <br>
   <br>
   </div>

   <div style="position: absolute; left: ${letterheadPosition.x}pt; top: ${letterheadPosition.y}pt; width: ${letterheadPosition.width}pt; height: ${letterheadPosition.height}pt;">
           <img src="${imgLetterheadPath}" alt="Letterhead" style="width: 100%; height: 100%;">
   </div>
   </body>
   </html>
   `

            //redenriza el html antes de convertirlo en pdf
        //const html = await ejs.render(contenidoHtml, nuevoArchivo);
        

        // Esta parte establece el contenido HTML y texto plano en la página
        await page.setContent(contenidoHtml);

        await page.setContent(contenidoHtml, {
            waitUntil: 'domcontentloaded'
          });

        // Generar el PDF
        const pdfBuffer = await page.pdf({
            format: 'Letter',
            margin: {
                top: '1cm',
                right: '2.5cm',
                bottom: '0cm',
                left: '2cm',
            },
        });

        await browser.close();

        return { pdfBuffer, numeroOficio };
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        return { error: 'Error al generar el PDF' };
    }
};

module.exports = { generarPDF };




