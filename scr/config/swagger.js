import swaggerJSDoc from "swagger-jsdoc";

export const swaggerConfig = (port) => swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Filmes",
      version: "1.0.0",
      description: "API escolar para cadastro e consulta de filmes"
    },
    servers: [{ url: `http://localhost:${port}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "Token"
        }
      },
      schemas: {
        Filme: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            titulo: { type: "string", example: "Interestelar" },
            genero: { type: "string", example: "Ficção científica" },
            ano: { type: "integer", example: 2014 }
          }
        }
      }
    },
    tags: [{ name: "Filmes", description: "Operações com filmes" }]
  },
  apis: ["./**/*.js"]
});
