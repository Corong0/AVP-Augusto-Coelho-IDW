import { filmes } from "../data/filmeData.js";

const listarFilmes = () => filmes;
const buscarFilmePorId = (id) => filmes.find((filme) => filme.id === id);
const buscarIndiceFilme = (id) => filmes.findIndex((filme) => filme.id === id);

const criarFilme = ({ titulo, genero, ano }) => {
  const novoFilme = {
    id: filmes.length ? Math.max(...filmes.map((filme) => filme.id)) + 1 : 1,
    titulo,
    genero,
    ano: Number(ano)
  };

  filmes.push(novoFilme);

  return novoFilme;
};

const atualizarFilme = (filme, dados) => {
  const camposPermitidos = ["titulo", "genero", "ano"];

  camposPermitidos.forEach((campo) => {
    if (dados[campo] !== undefined) {
      filme[campo] = campo === "ano" ? Number(dados[campo]) : dados[campo];
    }
  });

  return filme;
};

const substituirFilme = (filme, { titulo, genero, ano }) => {
  filme.titulo = titulo;
  filme.genero = genero;
  filme.ano = Number(ano);

  return filme;
};

const removerFilme = (indice) => filmes.splice(indice, 1)[0];

export const homeController = (req, res) => {
  res.json({
    mensagem: "Servidor Express funcionando!",
    disciplina: "Desenvolvimento de Websites",
    tema: "Catálogo de filmes",
    bimestre: "3º bimestre"
  });
};

export const listarFilmesController = (req, res) => {
  res.json(listarFilmes());
};

export const buscarFilmePorIdController = (req, res) => {
  const id = Number(req.params.id);
  const filme = buscarFilmePorId(id);

  if (!filme) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  res.json(filme);
};

export const criarFilmeController = (req, res) => {
  const { titulo, genero, ano } = req.body;

  if (!titulo || !genero || !ano) {
    return res.status(400).json({
      message: "titulo, genero e ano são obrigatórios"
    });
  }

  const filmeCriado = criarFilme({ titulo, genero, ano });

  res.status(201).json({
    mensagem: "Filme cadastrado com sucesso",
    filme: filmeCriado
  });
};

export const atualizarFilmeController = (req, res) => {
  const id = Number(req.params.id);
  const filme = buscarFilmePorId(id);

  if (!filme) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  const filmeAtualizado = atualizarFilme(filme, req.body);

  res.json({
    mensagem: "Filme atualizado com sucesso",
    filme: filmeAtualizado
  });
};

export const substituirFilmeController = (req, res) => {
  const id = Number(req.params.id);
  const filme = buscarFilmePorId(id);

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

  const filmeSubstituido = substituirFilme(filme, { titulo, genero, ano });

  res.json({
    mensagem: "Filme substituído com sucesso",
    filme: filmeSubstituido
  });
};

export const removerFilmeController = (req, res) => {
  const id = Number(req.params.id);
  const indiceFilme = buscarIndiceFilme(id);

  if (indiceFilme === -1) {
    return res.status(404).json({
      message: "Filme não encontrado"
    });
  }

  const filmeRemovido = removerFilme(indiceFilme);

  res.json({
    mensagem: "Filme excluído com sucesso",
    filme: filmeRemovido
  });
};
