import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const authToken = process.env.AUTH_TOKEN;

if (!authToken) {
  throw new Error("A variável AUTH_TOKEN não foi configurada no arquivo .env");
}

app.use(express.json());

const autenticar = (req, res, next) => {
  const cabecalho = req.headers.authorization;
  const token = cabecalho?.startsWith("Bearer ")
    ? cabecalho.slice(7)
    : null;

  if (token !== authToken) {
    return res.status(401).json({
      message: "Token Bearer inválido ou não informado"
    });
  }

  next();
};

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API de Filmes",
    version: "1.0.0",
    description: "API para cadastro e gerenciamento de filmes"
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
        required: ["titulo", "genero", "ano"],
        properties: {
          id: { type: "integer", example: 1 },
          titulo: { type: "string", example: "Interestelar" },
          genero: { type: "string", example: "Ficção científica" },
          ano: { type: "integer", example: 2014 }
        }
      }
    },
    responses: {
      NaoAutorizado: {
        description: "Token Bearer inválido ou não informado",
        content: {
          "application/json": {
            example: { message: "Token Bearer inválido ou não informado" }
          }
        }
      },
      NaoEncontrado: {
        description: "Filme não encontrado",
        content: {
          "application/json": {
            example: { message: "Filme não encontrado" }
          }
        }
      },
      DadosObrigatorios: {
        description: "Campos obrigatórios não informados",
        content: {
          "application/json": {
            example: { message: "titulo, genero e ano são obrigatórios" }
          }
        }
      }
    }
  },
  paths: {
    "/filmes": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de filmes",
            content: {
              "application/json": {
                example: [{ id: 1, titulo: "Interestelar", genero: "Ficção científica", ano: 2014 }]
              }
            }
          },
          401: { $ref: "#/components/responses/NaoAutorizado" }
        }
      },
      post: {
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Filme" } } }
        },
        responses: {
          201: {
            description: "Filme cadastrado",
            content: {
              "application/json": {
                example: {
                  mensagem: "Filme cadastrado com sucesso",
                  filme: { id: 11, titulo: "Vingadores: Ultimato", genero: "Ação", ano: 2019 }
                }
              }
            }
          },
          400: { $ref: "#/components/responses/DadosObrigatorios" },
          401: { $ref: "#/components/responses/NaoAutorizado" }
        }
      }
    },
    "/filmes/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Filme encontrado",
            content: {
              "application/json": {
                example: { id: 1, titulo: "Interestelar", genero: "Ficção científica", ano: 2014 }
              }
            }
          },
          401: { $ref: "#/components/responses/NaoAutorizado" },
          404: { $ref: "#/components/responses/NaoEncontrado" }
        }
      },
      patch: {
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              example: { genero: "Aventura" }
            }
          }
        },
        responses: {
          200: {
            description: "Filme atualizado parcialmente",
            content: {
              "application/json": {
                example: {
                  mensagem: "Filme atualizado com sucesso",
                  filme: { id: 1, titulo: "Interestelar", genero: "Aventura", ano: 2014 }
                }
              }
            }
          },
          401: { $ref: "#/components/responses/NaoAutorizado" },
          404: { $ref: "#/components/responses/NaoEncontrado" }
        }
      },
      put: {
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: { titulo: "Vingadores: Ultimato", genero: "Ação", ano: 2019 }
            }
          }
        },
        responses: {
          200: {
            description: "Filme substituído",
            content: {
              "application/json": {
                example: {
                  mensagem: "Filme substituído com sucesso",
                  filme: { id: 1, titulo: "Vingadores: Ultimato", genero: "Ação", ano: 2019 }
                }
              }
            }
          },
          400: { $ref: "#/components/responses/DadosObrigatorios" },
          401: { $ref: "#/components/responses/NaoAutorizado" },
          404: { $ref: "#/components/responses/NaoEncontrado" }
        }
      },
      delete: {
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Filme excluído",
            content: {
              "application/json": {
                example: {
                  mensagem: "Filme excluído com sucesso",
                  filme: { id: 1, titulo: "Interestelar", genero: "Ficção científica", ano: 2014 }
                }
              }
            }
          },
          401: { $ref: "#/components/responses/NaoAutorizado" },
          404: { $ref: "#/components/responses/NaoEncontrado" }
        }
      }
    }
  }
};

const swaggerSpec = swaggerJSDoc({
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
  apis: ["./server.js"]
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const filmes = [
  { id: 1, titulo: "O Poderoso Chefão", genero: "Crime", ano: 1972 },
  { id: 2, titulo: "Interestelar", genero: "Ficção científica", ano: 2014 },
  { id: 3, titulo: "O Senhor dos Anéis: O Retorno do Rei", genero: "Fantasia", ano: 2003 },
  { id: 4, titulo: "A Origem", genero: "Ficção científica", ano: 2010 },
  { id: 5, titulo: "Parasita", genero: "Drama", ano: 2019 },
  { id: 6, titulo: "Pulp Fiction", genero: "Crime", ano: 1994 },
  { id: 7, titulo: "Cidade de Deus", genero: "Drama", ano: 2002 },
  { id: 8, titulo: "Toy Story", genero: "Animação", ano: 1995 },
  { id: 9, titulo: "Matrix", genero: "Ação", ano: 1999 },
  { id: 10, titulo: "O Castelo Animado", genero: "Animação", ano: 2004 }
];

app.get("/", (req, res) => {
  res.json({
    mensagem: "Servidor Express funcionando!",
    disciplina: "Desenvolvimento de Websites",
    tema: "Catálogo de filmes",
    bimestre: "3º bimestre"
  });
});

/**
 * @swagger
 * /filmes:
 *   get:
 *     tags: [Filmes]
 *     summary: Lista todos os filmes
 *     description: Retorna todos os filmes cadastrados. Esta rota é pública.
 *     responses:
 *       200:
 *         description: Lista de filmes retornada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 titulo: Interestelar
 *                 genero: Ficção científica
 *                 ano: 2014
 */
app.get("/filmes", (req, res) => {
  res.json(filmes);
});

/**
 * @swagger
 * /filmes/{id}:
 *   get:
 *     tags: [Filmes]
 *     summary: Busca um filme por ID
 *     description: Retorna um filme específico. Esta rota é pública.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Filme encontrado
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               titulo: Interestelar
 *               genero: Ficção científica
 *               ano: 2014
 *       404:
 *         description: Filme não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: Filme não encontrado
 */
app.get("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);

  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  res.json(filme);
});

/**
 * @swagger
 * /filmes:
 *   post:
 *     tags: [Filmes]
 *     summary: Cadastra um filme
 *     description: Adiciona um novo filme. Esta rota exige Bearer Token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             titulo: "Vingadores: Ultimato"
 *             genero: Ação
 *             ano: 2019
 *     responses:
 *       201:
 *         description: Filme cadastrado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme cadastrado com sucesso
 *               filme:
 *                 id: 11
 *                 titulo: "Vingadores: Ultimato"
 *                 genero: Ação
 *                 ano: 2019
 *       400:
 *         description: Campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             example:
 *               message: titulo, genero e ano são obrigatórios
 *       401:
 *         description: Token inválido ou não informado
 *         content:
 *           application/json:
 *             example:
 *               message: Token Bearer inválido ou não informado
 */
app.post("/filmes", autenticar, (req, res) => {
  const { titulo, genero, ano } = req.body;

  if (!titulo || !genero || !ano) {
    return res.status(400).json({
      message: "titulo, genero e ano são obrigatórios"
    });
  }

  const novoFilme = {
    id: filmes.length ? Math.max(...filmes.map((filme) => filme.id)) + 1 : 1,
    titulo,
    genero,
    ano: Number(ano)
  };

  filmes.push(novoFilme);

  res.status(201).json({
    mensagem: "Filme cadastrado com sucesso",
    filme: novoFilme
  });
});

/**
 * @swagger
 * /filmes/{id}:
 *   patch:
 *     tags: [Filmes]
 *     summary: Atualiza parcialmente um filme
 *     description: Altera um ou mais campos do filme. Exige Bearer Token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             genero: Aventura
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme atualizado com sucesso
 *               filme:
 *                 id: 1
 *                 titulo: Interestelar
 *                 genero: Aventura
 *                 ano: 2014
 *       401:
 *         description: Token inválido ou não informado
 *         content:
 *           application/json:
 *             example:
 *               message: Token Bearer inválido ou não informado
 *       404:
 *         description: Filme não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: Filme não encontrado
 */
app.patch("/filmes/:id", autenticar, (req, res) => {
  const id = Number(req.params.id);
  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  const camposPermitidos = ["titulo", "genero", "ano"];

  camposPermitidos.forEach((campo) => {
    if (req.body[campo] !== undefined) {
      filme[campo] = campo === "ano" ? Number(req.body[campo]) : req.body[campo];
    }
  });

  res.json({
    mensagem: "Filme atualizado com sucesso",
    filme
  });
});

app.put("/filmes/:id", autenticar, (req, res) => {
  const id = Number(req.params.id);
  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  const { titulo, genero, ano } = req.body;

  if (!titulo || !genero || !ano) {
    return res.status(400).json({
      message: "titulo, genero e ano são obrigatórios"
    });
  }

  filme.titulo = titulo;
  filme.genero = genero;
  filme.ano = Number(ano);

  res.json({
    mensagem: "Filme substituído com sucesso",
    filme
  });
});

/**
 * @swagger
 * /filmes/{id}:
 *   delete:
 *     tags: [Filmes]
 *     summary: Exclui um filme
 *     description: Exclui um filme pelo ID. Esta rota exige Bearer Token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Filme excluído com sucesso
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme excluído com sucesso
 *               filme:
 *                 id: 1
 *                 titulo: Interestelar
 *                 genero: Ficção científica
 *                 ano: 2014
 *       401:
 *         description: Token inválido ou não informado
 *         content:
 *           application/json:
 *             example:
 *               message: Token Bearer inválido ou não informado
 *       404:
 *         description: Filme não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: Filme não encontrado
 */
app.delete("/filmes/:id", autenticar, (req, res) => {
  const id = Number(req.params.id);
  const indiceFilme = filmes.findIndex((filme) => filme.id === id);

  if (indiceFilme === -1) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  const [filmeRemovido] = filmes.splice(indiceFilme, 1);

  res.json({
    mensagem: "Filme excluído com sucesso",
    filme: filmeRemovido
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
