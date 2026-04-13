const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "softjobs",
  allowExitOnIdle: true,
});

const registrarUsuario = async (email, password, rol, lenguage) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const consulta = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)";
  const values = [email, hashPassword, rol, lenguage];
  await pool.query(consulta, values);
};

const obtenerUsuario = async (email) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const { rows } = await pool.query(consulta, [email]);
  return rows[0];
};

module.exports = { registrarUsuario, obtenerUsuario };
