const { encryptCreditCard, decryptCreditCard } = require('../utils/encrypt');

const conversionController = {
    convertTextToJson: (req, res) => {
        try {
            const { inputText, delimiter, encryptionKey } = req.body;

            const lines = inputText.split('\n');
            const jsonData = lines.map(line => {
                const [
                    documento,
                    nombres,
                    apellidos,
                    tarjeta,
                    tipo,
                    telefono,
                    coordinatesStr
                ] = line.split(delimiter);

                const coordinates = coordinatesStr
                    .replace(/[()]/g, '')
                    .split(', ')
                    .map(coord => parseFloat(coord));

                const encryptedCard = encryptCreditCard(tarjeta, encryptionKey);

                return {
                    documento,
                    nombres,
                    apellidos,
                    tarjeta: encryptedCard,
                    tipo,
                    telefono,
                    poligono: {
                        type: 'FeatureCollection',
                        crs: {
                            type: 'name',
                            properties: {
                                name: 'EPSG:4326'
                            }
                        },
                        features: [
                            {
                                type: 'Feature',
                                geometry: {
                                    type: 'Polygon',
                                    coordinates: [coordinates]
                                },
                                properties: {
                                    land_Use: 'T'
                                }
                            }
                        ]
                    }
                };
            });

            return res.status(200).json({ message: 'Conversion successful', data: jsonData });
        } catch (error) {
            return res.status(error.status || 400).json({ message: error.message || JSON.stringify(error) });
        }
    },

    convertJsonToText: (req, res) => {
        try {
            const { data, decryptionKey, delimiter } = req.body;

            const lines = data.map(item => {
                const coordinates = item.poligono.features[0].geometry.coordinates[0].join(', ');
                const decryptedCard = decryptCreditCard(item.tarjeta, decryptionKey);
                return `${item.documento}${delimiter}${item.nombres}${delimiter}${item.apellidos}${delimiter}${decryptedCard}${delimiter}${item.tipo}${delimiter}${item.telefono}${delimiter}(${coordinates})`;
            }).join('\n');

            return res.status(200).json({ message: 'Conversion successful', data: lines });
        } catch (error) {
            return res.status(400).json({ message: error.message || JSON.stringify(error) });
        }
    }
};

module.exports = conversionController;
