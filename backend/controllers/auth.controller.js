import { redis } from "../lib/redis.js";
import User from "../models/User.js";
import Jwt from "jsonwebtoken";

const generateTokens = (userId) => {
  const accessToken = Jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = Jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7 dias
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Previne ataque XSS - Cross-Site Scripting
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Previne ataque CSRF - Cross-Site Request Forgery
    maxAge: 15 * 60 * 1000, // 15 minutos
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Previne ataque XSS - Cross-Site Scripting
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Previne ataque CSRF - Cross-Site Request Forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const userExists = await User.findOne({ email });
  try {
    if (userExists) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message:
          "A senha deve ter pelo menos 8 caracteres e conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
      });
    }

    if (
      password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ) === null
    ) {
      return res.status(400).json({
        message:
          "A senha deve ter pelo menos 8 caracteres e conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
      });
    }

    const user = await User.create({ name, email, password });

    // Authenticate
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Usuário criado com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar usuário - email ou senha inválidos",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Email ou senha inválidos"});
    }
  } catch (error) {
    res.status(500).json({
      message: "Erro ao fazer login",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = Jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Deslogado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deslogar", error: error.message });
  }
};

// isso vai atualizar o token de acesso 
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token não encontrado" });
    }

    const decoded = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Atualização de token inválido" });
    }

    const accessToken = Jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token de acesso atualizado com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar o token", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao obter perfil", error: error.message });
  }
};
