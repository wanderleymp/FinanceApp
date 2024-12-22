export const mockSwaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Agile Finance API",
    version: "1.0.0",
    description: "API de serviços do sistema Agile Finance"
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de Desenvolvimento"
    }
  ],
  paths: {
    "/health": {
      get: {
        summary: "Verifica o status geral do sistema",
        tags: ["Health"],
        responses: {
          "200": {
            description: "Status do sistema retornado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      enum: ["healthy", "unhealthy"],
                      description: "Status geral do sistema"
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                      description: "Momento da verificação"
                    },
                    version: {
                      type: "string",
                      description: "Versão do sistema"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/health/databases": {
      get: {
        summary: "Verifica o status dos bancos de dados",
        tags: ["Health"],
        responses: {
          "200": {
            description: "Status dos bancos de dados retornado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        description: "Status da conexão"
                      },
                      database: {
                        type: "string",
                        description: "Nome do banco de dados"
                      },
                      responseTime: {
                        type: "string",
                        description: "Tempo de resposta"
                      },
                      version: {
                        type: "string",
                        description: "Versão do banco de dados"
                      },
                      activeConnections: {
                        type: "string",
                        description: "Número de conexões ativas"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
