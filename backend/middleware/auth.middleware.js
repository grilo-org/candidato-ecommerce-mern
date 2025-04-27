import Jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        message: "Acesso não autorizado - nenhum token de acesso fornecido",
      });
    }

    try {
      const decoded = Jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res
          .status(401)
          .json({ message: "Acesso não autorizado - usuário não encontrado" });
      }

      req.user = user; // Adiciona o usuário à requisição para uso posterior

      next(); // Chama o próximo middleware ou rota
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Acesso não autorizado - token de acesso expirado",
        });
      }
      throw error; // Lança o erro para ser tratado no bloco catch externo
    }
  } catch (error) {
    return res.status(401).json({
      message: "Acesso não autorizado - token de acesso inválido",
      error: error.message,
    });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Acesso negado - Somente administradores podem acessar",
    });
  }
};
