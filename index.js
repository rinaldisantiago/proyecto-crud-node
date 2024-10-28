const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3000;
const authRouter = require("./routes/authRoutes");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Aplicacion corriendo en puerto ${PORT}`);
})