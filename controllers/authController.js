const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models'); // Importar los modelos
const Usuario = db.Usuario; // Acceder al modelo Usuario


const login = async(req, res) => {
    const { mail, password } = req.body;    

    try {
        const { mail, password } = req.body;
        // Se verifica si el mail existe en la base de datos
        const usuario = await Usuario.findOne({
            where: mail
        });
        if (!usuario){
            res.status(404).send({ message: "Mail no existente" });
        }
        // Se verifica el password
        const isMatch = await bcrypt.compare(password, Usuario.password);
        if (!isMatch){
            res.status(400).send({ message: "Password incorrecto" });
        }
        //3 - Crear token
        const token = jwt.sign({
            id: usuario.id,
            nombre: usuario.nombre,
            mail: usuario.mail
        }, "1234", { expiresIn: 180 });
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send({
            message: "Error en el servidor",
            tipo: error.name,
            detalles: error.message
        });
    }
}

module.exports = {
    login
}