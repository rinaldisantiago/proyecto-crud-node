const multer = require("multer");
const path = require("path");

// Configuracio del almacenamiento con multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/avatars'); // Carpeta donde se guardan los archivos
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Obtener la extension original del archivo (si es JPEG, JPG o PNG)
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

// Filtrar archivos para asegurar de que solo se suban imagenes
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/; // Expresion regular donde se definen los tipos de archivos definidos
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase()); // Validacion de extension
    const mimetype = allowedTypes.test(file.mimetype); // Validacion de campo interno mimetype y tipo de archivo

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten imagenes en formato JPEG, JPG o PNG'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // Limite de 2MB por imagen
});

module.exports = upload;