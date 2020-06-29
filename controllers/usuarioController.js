const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
// Crear Usuario
exports.crearUsuario = async (req, res) => {
  // Validación de campos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Extraer email y password
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msg: "El email ingresado ya esta usado." });
    }

    // Creamos el usuario
    usuario = new Usuario(req.body);

    // Hashear password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    // Guardamos el usuario en la BD
    await usuario.save();

    //payload
    const payload = {
      usuario: {
        id: usuario.id,
        rol: usuario.rol,
      },
    };
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 7200,
      },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
        res.json({ msg: "Usuario creado correctamente", token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

//obtener un usuario
exports.ObtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("nombre email imagen");
    res.json({ usuario });
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};

//obtener listado usuarios
exports.ObtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({})
      .select("nombre email rol")
      .sort("rol");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error." });
  }
};
//cambiar rol de admin a usuario
exports.quitarPermisos = async (req, res) => {
  try {
    const admin = await Usuario.findOneAndUpdate(
      { _id: req.params.id },
      { rol: "usuario" },
      { new: true }
    );
    res.json({ admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error." });
  }
};
//cambiar rol de usuario a administrador
exports.cambiarRol = async (req, res) => {
  try {
    const usuario = await Usuario.findOneAndUpdate(
      { _id: req.params.id },
      { rol: "admin" },
      { new: true }
    );
    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error." });
  }
};
exports.updateUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    res.json(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error." });
  }
};
