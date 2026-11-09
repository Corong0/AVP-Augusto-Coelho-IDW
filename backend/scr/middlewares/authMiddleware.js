export const autenticar = (req, res, next) => {
  const authToken = process.env.AUTH_TOKEN;
  const cabecalho = req.headers.authorization;
  const token = cabecalho?.startsWith("Bearer ") ? cabecalho.slice(7) : null;

  if (token !== authToken) {
    return res.status(401).json({
      message: "Token Bearer inválido ou não informado"
    });
  }

  next();
};
