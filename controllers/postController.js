const db = require("../models");
const Post = db.Post;

const createPost = async (req, res) => {
    const id_usuario = req.user.id;
    const { titulo, contenido } = req.body;
    if (!titulo || !contenido) {
        return res.status(400).send({ message: "Faltan datos de completar" });
    }
    try {
        const post = await Post.create({
            id_usuario: id_usuario,
            titulo: titulo,
            contenido: contenido
        });
        res.status(201).send(post);
    } catch (error) {
        res.status(500).send({
            message: error.message,
            nombre: error.name
        });   
    }
};

const getPostList = async(req, res) => {
    try {
        const postList = await Post.findAll();

        if (postList.length > 0) {
            res.status(200).send(postList);
        } else {
            res.status(404).send({ message: "Aun no hay posteos" });
        }

    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deletePost = async (req, res) => {
    try {
        const id_usuario = req.user.id;
        const postID = req.body.id;

        const post = await Post.destroy({
            where: { 
                id_usuario: id_usuario,
                id: postID, 
            }
        });

        if (post) {
            res.status(200).send({ message: "¡Post eliminado correctamente!" });
        } else {
            res.status(404).send({ message: "No se encontró el post. Verifica el ID proporcionado." });
        }
    } catch (error) {
        res.status(500).send({ 
            message: "Error interno del servidor", 
            tipo: error.name, 
            detalles: error.message });
    }
};

const update = async (req, res) => {
    try {
        const id_usuario = req.user.id;
        const postID = req.query.id;
        const { titulo, contenido } = req.body;

        // Encontrar el post por ID
        const post = await Post.findOne({
            where: { 
                id: postID, 
                id_usuario: id_usuario 
            }
        });

        if (!post) {
            return res.status(404).send({ message: "No se encontró el post o no tienes permiso para editarlo." });
        }

        // Actualizar los campos del post
        if (titulo) {
            post.titulo = titulo;
        }
        if (contenido) {
            post.contenido = contenido;
        }

        await post.save();

        res.status(200).send({ message: "¡Post actualizado correctamente!", post });
    } catch (error) {
        res.status(500).send({ 
            message: "Error interno del servidor", 
            tipo: error.name, 
            detalles: error.message });
    }
};

const getOnePost = async(req, res) => {
    const id_usuario_login = req.user.id;
    const postID = req.query.id;

    const siguiendo = await db.Usuario.findByPk(id_usuario_login, {
        include: [{
            model: db.Usuario,
            as: 'seguidos', // Usa la relación "seguidos"
            attributes: ['id'],
            through: { 
                attributes:  [] 
            }
        }, ],
    });

    if (!siguiendo) {
        return res.status(404).send({ message: "Usuario no encontrado" });
    }

    try {
        const post = await Post.findByPk(postID);
        
        if (!post) {
            return res.status(404).send({ message: "Post no encontrado" });
        };
        
        let encontrado = false;
        
        for (let i = 0; i < siguiendo.seguidos.length; i++){
            if(post.id_usuario == siguiendo.seguidos[i].id){
                encontrado = true;
            }
        };
        
        if (id_usuario_login == post.id_usuario||encontrado==true) {
            res.status(200).send(post);
        } else {
            res.status(403).send({ message: "Este post no se puede mostrar porque no sigues al usuario" });
        };

    } catch (error) {
        res.status(500).send({ message: "Error interno del server" });
    }
};


const getUserPost = async(req, res) => {
    const id_usuario_login = req.user.id;
    const id_usuario_seguido = req.query.id;

    const siguiendo = await db.Usuario.findByPk(id_usuario_login, {
        include: [{
            model: db.Usuario,
            as: 'seguidos', // Usa la relación "seguidos"
            attributes: ['id'],
            through: { 
                attributes:  [] 
            }
        }, ],
    });

    try {
        const post = await Post.findAll({ 
            where: {
                id_usuario: id_usuario_seguido
        }});

        let encontrado= false;
        for (let i = 0; i < siguiendo.seguidos.length; i++){
            if(id_usuario_seguido == siguiendo.seguidos[i].id){
                encontrado = true;
            }
        }
        
        if (encontrado) {
            res.status(200).send(post);
        
        } else {
            res.status(404).send({ message: "No se pueden mostrar estos posts" });
        }
    } catch (error) {
        res.status(500).send({ message: "Error interno del server" });
    }
}


module.exports ={
    createPost,
    getPostList,
    deletePost,
    update,
    getOnePost,
    getUserPost
}