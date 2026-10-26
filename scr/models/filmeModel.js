import { prisma } from "../config/prisma.js";

export function criarFilme({ titulo, genero, ano }) {
  return prisma.filme.create({
    data: {
      titulo,
      genero,
      ano,
    },
  });
}

export function listarTodos() {
  return prisma.filme.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export function buscarPorId(id) {
  return prisma.filme.findUnique({
    where: {
      id,
    },
  });
}

export function atualizarFilme(id, dados) {
  const data = {};

  if (dados.titulo !== undefined) data.titulo = dados.titulo;
  if (dados.genero !== undefined) data.genero = dados.genero;
  if (dados.ano !== undefined) data.ano = Number(dados.ano);

  return prisma.filme.update({
    where: {
      id,
    },
    data,
  });
}

export function substituirFilme(id, { titulo, genero, ano }) {
  return prisma.filme.update({
    where: {
      id,
    },
    data: {
      titulo,
      genero,
      ano,
    },
  });
}

export function removerFilme(id) {
  return prisma.filme.delete({
    where: {
      id,
    },
  });
}

export function buscarPorGenero(genero) {
  return prisma.filme.findMany({
    where: {
      genero,
    },
  });
}

export function buscarPorAno(ano) {
  return prisma.filme.findMany({
    where: {
      ano,
    },
  });
}

export function buscarPorNome(titulo) {
  return prisma.filme.findMany({
    where: {
      titulo: {
        contains: titulo,
      },
    },
  });
}
