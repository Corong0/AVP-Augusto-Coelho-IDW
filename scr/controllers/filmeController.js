import {
  atualizarFilme,
  buscarPorId,
  criarFilme,
  listarTodos,
  removerFilme,
  substituirFilme
} from "../models/filmeModel.js";

export const homeController = (req, res) => {
  res.json({
    mensagem: "Servidor Express funcionando!",
    disciplina: "Desenvolvimento de Websites",
    tema: "Catálogo de filmes",
    bimestre: "3º bimestre"
  });
};

export const listarFilmesController = async (req, res) => {
  const filmes = await listarTodos();
  res.json(filmes);
};

export const buscarFilmePorIdController = async (req, res) => {
  const id = Number(req.params.id);
  const filme = await buscarPorId(id);

  if (!filme) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  res.json(filme);
};

export const criarFilmeController = async (req, res) => {
  const { titulo, genero, ano } = req.body;

  if (!titulo || !genero || !ano) {
    return res.status(400).json({
      message: "titulo, genero e ano são obrigatórios"
    });
  }

  const filmeCriado = await criarFilme({ titulo, genero, ano });

  res.status(201).json({
    mensagem: "Filme cadastrado com sucesso",
    filme: filmeCriado
  });
};

export const atualizarFilmeController = async (req, res) => {
  const id = Number(req.params.id);
  const filme = await buscarPorId(id);

  if (!filme) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  const filmeAtualizado = await atualizarFilme(id, req.body);

  res.json({
    mensagem: "Filme atualizado com sucesso",
    filme: filmeAtualizado
  });
};

export const substituirFilmeController = async (req, res) => {
  const id = Number(req.params.id);
  const filme = await buscarPorId(id);

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

  const filmeSubstituido = await substituirFilme(id, { titulo, genero, ano });

  res.json({
    mensagem: "Filme substituído com sucesso",
    filme: filmeSubstituido
  });
};

export const removerFilmeController = async (req, res) => {
  const id = Number(req.params.id);
  const filme = await buscarPorId(id);

  if (!filme) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  const filmeRemovido = await removerFilme(id);

  res.json({
    mensagem: "Filme excluído com sucesso",
    filme: filmeRemovido
  });
};
