const db = require('../models');
const Usuario = db.Usuario;


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
            res.status(400).send({ message: "Mail o nickname ya existente" });
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
        const id = req.user.id;
        const { nombre, nickname, mail, password } = req.body;
        let avatarPath = null;
        if (req.file) {
            avatarPath = `uploads/avatars/${req.file.filename}`
        }
        //console.log(avatarPath)

        // Buscar el usuario por id
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        // Actualizar los campos
        usuario.nombre = nombre;
        usuario.nickname = nickname;
        usuario.mail = mail;
        if (avatarPath) {
            usuario.avatar = avatarPath; // Guardar la ruta del avatar
        }

        // Solo actualizar la contraseña si fue proporcionada
        if (password) {
            usuario.password = password;
        }

        await usuario.save(); // Sequelize activará el hook `beforeUpdate` si es necesario

        res.status(200).send(usuario);
    } catch (error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    }
};

const list = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).send({
                message: "Page and limit must be positive"
            })
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Usuario.findAndCountAll({
            attributes: { exclude: ['password'] },
            limit: limit,
            offset: offset
        });

        res.status(200).send({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            itemsPerPage: limit,
            data: rows
        })

    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    register,
    update,
    list
};