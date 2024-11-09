const db = require('../models');
const Post = db.Post;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const newPost = async(req, res) => {
    const id_usuario = req.user.id; 
    const { titulo, contenido } = req.body;
    if (!titulo || !contenido) {
        return res.status(400).send({ message: "Faltan datos de completar" });
    }
    try {
        const post = await Post.create(req.body);
        res.status(201).send(post);
    } catch (error) {
            res.status(500).send({
                message: error.message,
                nombre: error.name
            });
        }
};

module.exports = {
    newPost,
};