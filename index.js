const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registrarUsuario, obtenerUsuario } = require("./consultas");
const {
  reportar,
  verificarCredenciales,
  verificarToken,
  SECRET,
} = require("./middlewares");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(reportar);

// Requerimiento 1: POST /usuarios - registrar usuario
app.post("/usuarios", verificarCredenciales, async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    await registrarUsuario(email, password, rol, lenguage);
    res.json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

// Requerimiento 3: POST /login - iniciar sesión y devolver token
app.post("/login", verificarCredenciales, async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await obtenerUsuario(email);

    if (!usuario) {
      return res.status(401).json({ message: "Email no registrado" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ message: "Password incorrecta" });
    }

    const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

// Requerimiento 1 y 3: GET /usuarios - devolver datos del usuario autenticado
app.get("/usuarios", verificarToken, async (req, res) => {
  try {
    const usuario = await obtenerUsuario(req.email);
    res.json([usuario]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
});

app.listen(PORT, console.log(`Servidor corriendo en puerto ${PORT}`));
