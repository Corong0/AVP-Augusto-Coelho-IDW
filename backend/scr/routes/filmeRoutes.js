import { Router } from "express";
import { autenticar } from "../middlewares/authMiddleware.js";
import {
  homeController,
  listarFilmesController,
  buscarFilmePorIdController,
  criarFilmeController,
  atualizarFilmeController,
  substituirFilmeController,
  removerFilmeController
} from "../controllers/filmeController.js";

/**
 * @swagger
 * /filmes:
 *   get:
 *     tags: [Filmes]
 *     summary: Lista todos os filmes
 *     description: Retorna todos os filmes cadastrados.
 *     responses:
 *       200:
 *         description: Lista de filmes retornada com sucesso
 */
const router = Router();

router.get("/", homeController);
router.get("/filmes", listarFilmesController);

/**
 * @swagger
 * /filmes/{id}:
 *   get:
 *     tags: [Filmes]
 *     summary: Busca um filme por ID
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
 *       404:
 *         description: Filme não encontrado
 */
router.get("/filmes/:id", buscarFilmePorIdController);

/**
 * @swagger
 * /filmes:
 *   post:
 *     tags: [Filmes]
 *     summary: Cadastra um filme
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Filme cadastrado com sucesso
 *       400:
 *         description: Campos obrigatórios ausentes
 *       401:
 *         description: Token inválido ou não informado
 */
router.post("/filmes", autenticar, criarFilmeController);

/**
 * @swagger
 * /filmes/{id}:
 *   patch:
 *     tags: [Filmes]
 *     summary: Atualiza parcialmente um filme
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *       404:
 *         description: Filme não encontrado
 */
router.patch("/filmes/:id", autenticar, atualizarFilmeController);

/**
 * @swagger
 * /filmes/{id}:
 *   put:
 *     tags: [Filmes]
 *     summary: Substitui um filme
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Filme substituído com sucesso
 *       404:
 *         description: Filme não encontrado
 */
router.put("/filmes/:id", autenticar, substituirFilmeController);

/**
 * @swagger
 * /filmes/{id}:
 *   delete:
 *     tags: [Filmes]
 *     summary: Exclui um filme
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Filme excluído com sucesso
 *       404:
 *         description: Filme não encontrado
 */
router.delete("/filmes/:id", autenticar, removerFilmeController);

export default router;
