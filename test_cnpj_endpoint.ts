import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

async function testCNPJEndpoint() {
  try {
    const token = localStorage.getItem('token') || process.env.VITE_TEST_TOKEN;
    
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

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
  } catch (error: any) {
    console.error('Erro ao testar endpoint:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

testCNPJEndpoint();
