import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isServerConnected, setIsServerConnected] = useState(false);

  const API_URL = 'http://localhost:3001';

  const checkConnection = async () => {
    try {
      console.log('Checking server connection...');
      const response = await axios.get(`${API_URL}/api/health`);
      console.log('Server response:', response.data);
      setIsServerConnected(true);
      setError('');
    } catch (err) {
      console.error('Connection error:', err);
      setIsServerConnected(false);
      setError(`Error de conexión: ${err.message}`);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const validateInput = (text) => {
    if (!text.trim()) {
      throw new Error('El texto no puede estar vacío');
    }
    // Verifica que el formato sea correcto (documento|nombres|apellidos|tarjeta|tipo|telefono|coordenadas)
    const parts = text.split('|');
    if (parts.length !== 7) {
      throw new Error('El formato debe ser: documento|nombres|apellidos|tarjeta|tipo|telefono|(coordenadas)');
    }
  };

  const handleConversion = async () => {
    try {
      setError('');
      if (!isServerConnected) {
        throw new Error('El servidor no está disponible');
      }
      validateInput(inputText);

      const response = await axios.post(`${API_URL}/api/conversion/text-to-json`, {
        inputText,
        delimiter: '|',
        encryptionKey: 'clave-secreta-123'
      });
      
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Error:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Error de conexión: Verifica que el servidor esté corriendo en http://localhost:3001');
      } else {
        setError(error.response?.data?.message || error.message || 'Error en la conversión');
      }
      setResult('');
    }
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <header className="App-header">
        <h1>ARI Cifrado</h1>
        <div style={{ 
          color: isServerConnected ? 'green' : 'red',
          marginBottom: '10px'
        }}>
          Estado del servidor: {isServerConnected ? 'Conectado' : 'Desconectado'}
        </div>
      </header>
      <main style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <p>Formato esperado:</p>
          <code>documento|nombres|apellidos|tarjeta|tipo|telefono|(x,y,z)</code>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ejemplo: 1234567890|Juan|Perez|4111111111111111|VISA|123456789|(1.23, 4.56, 7.89, 1.23)"
          rows={10}
          cols={50}
          style={{ marginBottom: '10px' }}
        />
        <button 
          onClick={handleConversion}
          style={{ padding: '10px', maxWidth: '200px' }}
        >
          Convertir
        </button>
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            {error}
          </div>
        )}
        {result && (
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '5px',
            marginTop: '10px' 
          }}>
            {result}
          </pre>
        )}
      </main>
    </div>
  );
}

export default App;
