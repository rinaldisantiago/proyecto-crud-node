const db = require('../models');
const Following = db.Following;

const follow = async (req, res) => {
    const id_usuario = req.user.id;
    const { id_usuario_seguido } = req.body;    

    if (id_usuario == id_usuario_seguido) {
        return res.status(400).send({ message: "No puedes seguirte a ti mismo" });
    }

    try {
        await Following.create({ id_usuario, id_usuario_seguido });
        const usuario_seguido = await db.Usuario.findByPk(id_usuario_seguido);
        res.status(201).send({ message: "Has comenzado a seguir a " + usuario_seguido.nickname });
    } catch (error) {
        if(error.name === "SequelizeUniqueConstraintError"){
            res.status(401).send({message: "Ya sigues a este usuario"});
        }
        else{
            res.status(500).send({ 
                error: error.message,
                tipo: error.name 
            });
        }
    }
        
};

const unfollow = async (req, res) => {
    const id_usuario = req.user.id;
    const { id_usuario_seguido } = req.body;

    try {
        const result = await Following.destroy({
            where: {
                id_usuario: id_usuario,
                id_usuario_seguido: id_usuario_seguido
            }
        });

        if (result > 0) {
            res.status(200).send({ message: "Has dejado de seguir al usuario" });
        } else {
            res.status(404).send({ message: "No se encontró la relación de seguimiento" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message, tipo: error.name });
    }
};

// Obtener la lista de usuarios que el usuario sigue
const getFollowing = async(req, res) => {
    const id_usuario = req.user.id;
    try {
        const usuario = await db.Usuario.findByPk(id_usuario, {
            include: [{
                model: db.Usuario,
                as: 'seguidos', // Usa la relación "seguidos"
                attributes: ['id', 'nombre', 'nickname'],
                through: { 
                    attributes:  [] 
                }
            }, ],
        });
        if (!usuario) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }
        res.status(200).send(usuario.seguidos); // Enviar solo los usuarios seguidos
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Obtener la lista de las personas que siguen al usuario
const getFollowers = async(req, res) => {
    const id_usuario_seguido = req.user.id;

    try {
        const usuario = await db.Usuario.findByPk(id_usuario_seguido, {
            include: [{
                model: db.Usuario,
                as: 'seguidores', // Usa la relación "seguidores"
                attributes: ['id', 'nombre', 'nickname'],
                through: { 
                    attributes:  [] 
                }
            }, ],
        });
        if (!usuario) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }
        res.status(200).send(usuario.seguidores); // Enviar solo los usuarios seguidores
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getMutualFollows = async (req, res) => {
    const id_usuario = req.user.id;
    try {
        const usuario = await db.Usuario.findByPk(id_usuario, {
            include: [{
                model: db.Usuario,
                as: 'seguidos', // Usa la relación "seguidos"
                attributes: ['id', 'nombre', 'nickname'],
                through: { 
                    attributes:  [] 
                }
            },
            {   model: db.Usuario,
                as: 'seguidores', // Usa la relación "seguidores"
                attributes: ['id', 'nombre', 'nickname'],
                through: { 
                    attributes:  [] 
                }
            }
            ]
        });

        res.status(200).send(mutuals);
    } catch (error) {
        res.status(500).send({ error: error.message, tipo: error.name });
    }
};


module.exports = {
    follow,  
    unfollow,
    getFollowing,
    getFollowers, 
    getMutualFollows
};