import bycript from 'bcrypt'
import * as usuariosModel from '../models/usuariosModel.js'

export async function cadasrarUsuario(req, res) {
    const { nome, email, senha } = req.body

    const senhaHash = await bycript.hash(senha, 10)

    const novoUsuario = await usuariosModel.cadastrarUsuario({
        nome,
        email,
        senhaHash
    });

    res.status(201).json({
        message: "Usuário cadastrado com sucesso",
        novoUsuario
    });
}

export async function login(req, res) {
    const { email, senha } = req.body

    const usuario = await usuariosModel.buscarUsuarioPorEmail(email)

    if (!usuario) {
        return res.status(401).json({
             message: "Email ou senha inválidos" })
    }

     const senhaCorreta = await bycript.compare(senha, usuario.senhaHash)

     if (!senhaCorreta) {
        return res.status(401).json({
             message: "Email ou senha inválidos" })
    }

    res.json({
        message: "Login efetuado com sucesso.",
        usuario:{
            id: usuario,
            nome: usuario.nome,
            email: usuario.email,
            senhaHash: usuario.senhaHash
        }
    })
}
