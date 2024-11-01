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
        res.status(201).send({ message: "Has comenzado a seguir al usuario" });
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

const listFollowing = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).send({
                message: "Page and limit must be positive"
            })
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Following.findAndCountAll({
            attributes: { exclude: ['id_usuario'] },
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

const listFollowers = async (req, res) => {
    const id_usuario = req.user.id;

    try {
        const followers = await Following.findAll({
            where: { id_usuario_seguido: id_usuario },
            include: [{ model: db.Usuarios, as: 'usuario_seguidor', attributes: ['nickname', 'nombre'] }]
        });

        res.status(200).send(followers);
    } catch (error) {
        res.status(500).send({ error: error.message, tipo: error.name });
    }
};

const listMutualFollowing = async (req, res) => {
    const id_usuario = req.user.id;

    try {
        const mutuals = await db.sequelize.query(`
            SELECT u.id, u.nombre
            FROM Usuarios u
            INNER JOIN Followings f1 ON u.id = f1.id_usuario_seguido
            INNER JOIN Followings f2 ON u.id = f2.id_usuario
            WHERE f1.id_usuario = :id_usuario AND f2.id_usuario_seguido = :id_usuario
        `, {
            replacements: { id_usuario: id_usuario },
            type: db.Sequelize.QueryTypes.SELECT
        });

        res.status(200).send(mutuals);
    } catch (error) {
        res.status(500).send({ error: error.message, tipo: error.name });
    }
};


module.exports = {
    follow,  
    unfollow,
    listFollowing,
    listFollowers, 
    listMutualFollowing
};