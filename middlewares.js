const jwt = require("jsonwebtoken");
const SECRET = "secreto123";

// Middleware 1: reportar consultas en la terminal
const reportar = (req, res, next) => {
  console.log(`Consulta recibida: ${req.method} ${req.url}`);
  next();
};

// Middleware 2: verificar que lleguen email y password en el body
const verificarCredenciales = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y password son obligatorios" });
  }
  next();
};

// Middleware 3: verificar y decodificar el token JWT del header
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }
  const token = authHeader.split(" ")[1]; // extrae el token de "Bearer <token>"
  try {
    const decoded = jwt.verify(token, SECRET);
    req.email = decoded.email; // guarda el email para usarlo en la ruta
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = { reportar, verificarCredenciales, verificarToken, SECRET };
