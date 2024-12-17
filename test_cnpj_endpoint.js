const axios = require('axios');
require('dotenv').config({ path: '.env.development' });

async function testCNPJEndpoint() {
  try {
    // Substitua pelo seu token real de autenticação
    const token = 'SEU_TOKEN_AQUI'; 
    
    const response = await axios.post(
      `${process.env.VITE_API_BASE_URL}/persons/create-by-cnpj`, 
      { 
        cnpj: '12345678000195', 
        license_id: 1 
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Resposta do endpoint:', response.data);
  } catch (error) {
    console.error('Erro ao testar endpoint:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

testCNPJEndpoint();
