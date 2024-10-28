const db = require("../models");
const Usuario = db.usuario;

const register = async(req, res) => {
    const { nombre, mail, nickname, password } = req.body;
    if (!nombre || !mail || !nickname || !password) {
        return res.status(400).send({ message: "Faltan datos de completar" });
    }
    try {
        const usuario = await Usuario.create(req.body);
        res.status(201).send(usuario);
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            res.status(400).send({ message: "Mail y nickname ya existente" });
        } else {
            res.status(500).send({
                message: error.message,
                nombre: error.name
            });
        }
    }
};

const update = async(req, res) => {
    try {
        const { id } = req.params;
        const { nombre, nickname, mail, password } = req.body;
        let avatarPath = null;
        if (req.file) {
            avatarPath = `uploads/avatars/${req.file.filename}`;
        }
        console.log(avatarPath);

        // Buscar usuario por ID
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).send({error: "Usuario no encontrado"});
        }

        // Actualizar los campos
        usuario.nombre = nombre;
        usuario.nickname = nickname;
        usuario.mail = mail;
        if (avatarPath) {
            usuario.avatar = avatarPath; // Guarda la ruta del avatar
        }
 
        // Solo actualizar la contraseña si fue proporcionada
        if (password) {
            usuario.password = password;
        }

        await usuario.save(); // Sequelize activara el hook 'beforeUpdate' si es necesario

        res.status(200).send(usuario);

    } catch(error) {
        res.status(400).send({ error: error.message });
    }
};

module.exports = {
    register,
    update
};