const express = require("express");
const router = express.Router();
const followingController = require("../controllers/followingController");
const auth = require("../middlewares/authmiddleware");

/**
 * @swagger
 * /followings/:
 *   post:
 *     tags: [Follows]
 *     summary: Follow a new user
 *     security:
 *       - ApiTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario_seguido:
 *                 type: integer
 *     responses:
 *       201:
 *         description: You have started following the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                 id_usuario_seguido:
 *                   type: integer
 *       400:
 *         description: You can't follow yourself
 *       401:
 *         description: You already follow this user
 *       500:
 *         description: Internal server error
 */
router.post("/", auth, followingController.follow);


/**
 * @swagger
 * /followings/unfollow:
 *   delete:
 *     tags:
 *       - Follows
 *     summary: Delete following
 *     security:
 *       - ApiTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *          application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario_seguido:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Has dejado de seguir al usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Has dejado de seguir al usuario
 *       404:
 *         description: No se encontró la relación de seguimiento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró la relación de seguimiento
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error message
 *                 tipo:
 *                   type: string
 *                   example: SequelizeDatabaseError
 */
router.delete("/unfollow", auth, followingController.unfollow);


/**
 * @swagger
 * /followings/following/:
 *   get:
 *     tags: [Follows]
 *     summary: List all followings
 *     security:
 *       - ApiTokenAuth: []
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 itemsPerPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_usuario_seguido:
 *                         type: integer
 *       404:
 *         description: Users not found
 *       500:
 *         description: Internal server error
 */
router.get("/following", auth, followingController.getFollowing);


/**
 * @swagger
 * /followings/followers/:
 *   get:
 *     tags: [Follows]
 *     summary: List all followers
 *     security:
 *       - ApiTokenAuth: []
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 itemsPerPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_usuario_seguido:
 *                         type: integer
 *       404:
 *         description: Users not found
 *       500:
 *         description: Internal server error
 */
router.get("/followers", auth, followingController.getFollowers);


/**
 * @swagger
 * /followings/mutual:
 *   get:
 *     tags: [Follows]
 *     summary: Obtener lista de usuarios que se siguen mutuamente
 *     security:
 *       - ApiTokenAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios que se siguen mutuamente obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   nickname:
 *                     type: string
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor
 *                 tipo:
 *                   type: string
 *                   example: Error message
 */
router.get("/mutual", auth, followingController.getMutualFollows);

module.exports = router;