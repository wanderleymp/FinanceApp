import React, { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { apiService } from '../../services/ApiService';
import config from '../../config';
import { mockSwaggerSpec } from '../../mocks/swagger';

const ApiDocs: React.FC = () => {
  const [swaggerSpec, setSwaggerSpec] = useState<any>(config.api.useMock ? mockSwaggerSpec : null);
  const [loading, setLoading] = useState(!config.api.useMock);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSwaggerSpec = async () => {
      if (config.api.useMock) {
        return;
      }

      try {
        const response = await apiService.get('/api-docs/swagger.json');
        setSwaggerSpec(response);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar a documentação da API');
        console.error('Error fetching API docs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!config.api.useMock) {
      fetchSwaggerSpec();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && !config.api.useMock) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Documentação da API</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="swagger" className="space-y-4">
            <TabsList>
              <TabsTrigger value="swagger">Swagger UI</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints Principais</TabsTrigger>
            </TabsList>

            <TabsContent value="swagger">
              <div className="bg-white rounded-lg overflow-hidden">
                <SwaggerUI spec={swaggerSpec} />
                {config.api.useMock && (
                  <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                    <p className="text-yellow-700 text-sm">
                      ⚠️ Usando documentação mock. Para ver a documentação real, desative o modo mock no arquivo .env.development
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="endpoints">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Endpoints de Sistema</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">/health</code>
                      <span className="ml-2">Status geral do sistema</span>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">/health/databases</code>
                      <span className="ml-2">Status dos bancos de dados</span>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">/health/system</code>
                      <span className="ml-2">Métricas do sistema</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Autenticação</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">/auth/login</code>
                      <span className="ml-2">Login no sistema</span>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">/auth/refresh</code>
                      <span className="ml-2">Renovar token de acesso</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDocs;
