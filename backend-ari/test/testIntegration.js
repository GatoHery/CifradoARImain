const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Datos de prueba
const testData = {
    inputText: "1234567890|Juan|Perez|4111111111111111|VISA|123456789|(1.23, 4.56, 7.89, 1.23)",
    delimiter: "|",
    encryptionKey: "clave-secreta-123"
};

async function runTests() {
    try {
        console.log('Iniciando pruebas de integración...\n');

        // Prueba 1: Convertir texto a JSON
        console.log('1. Prueba de conversión texto a JSON');
        const textToJsonResponse = await axios.post(
            `${API_URL}/conversion/text-to-json`,
            testData
        );
        console.log('✅ Texto a JSON exitoso');
        console.log('Resultado:', JSON.stringify(textToJsonResponse.data, null, 2));

        // Guardar el JSON resultante para la siguiente prueba
        const jsonResult = textToJsonResponse.data.data;

        // Prueba 2: Convertir JSON de vuelta a texto
        console.log('\n2. Prueba de conversión JSON a texto');
        const jsonToTextResponse = await axios.post(
            `${API_URL}/conversion/json-to-text`,
            {
                data: jsonResult,
                decryptionKey: testData.encryptionKey,
                delimiter: testData.delimiter
            }
        );
        console.log('✅ JSON a texto exitoso');
        console.log('Resultado:', jsonToTextResponse.data.data);

        // Verificar si el texto original coincide con el resultado final
        const originalWithoutSpaces = testData.inputText.replace(/\s/g, '');
        const resultWithoutSpaces = jsonToTextResponse.data.data.replace(/\s/g, '');
        
        console.log('\n3. Verificación de integridad');
        console.log('Texto original coincide con resultado:', 
            originalWithoutSpaces === resultWithoutSpaces ? '✅ Sí' : '❌ No');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.response?.data || error.message);
    }
}

// Ejecutar las pruebas
console.log('Asegúrate de que el servidor esté corriendo en http://localhost:3000\n');
runTests();
