const express = require("express");
const router = express.Router();
const { getPlayer } = require("../controllers/playerController");

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: Player management and retrieval
 */

/**
 * @swagger
 * /api/player/{tag}:
 *   get:
 *     summary: Get player information
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: tag
 *         schema:
 *           type: string
 *         required: true
 *         description: Player tag
 *     responses:
 *       200:
 *         description: Player data
 *       500:
 *         description: Failed to fetch player data
 */
router.get("/:tag", getPlayer);

module.exports = router;
