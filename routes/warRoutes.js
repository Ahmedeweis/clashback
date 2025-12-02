const express = require("express");
const router = express.Router();
const { getWar } = require("../controllers/warController");

/**
 * @swagger
 * tags:
 *   name: Wars
 *   description: War management and retrieval
 */

/**
 * @swagger
 * /api/cwl/war/{warTag}:
 *   get:
 *     summary: Get specific war information
 *     tags: [Wars]
 *     parameters:
 *       - in: path
 *         name: warTag
 *         schema:
 *           type: string
 *         required: true
 *         description: War Tag
 *     responses:
 *       200:
 *         description: War data
 *       404:
 *         description: War not found
 *       500:
 *         description: Failed to fetch war data
 */
router.get("/war/:warTag", getWar);

module.exports = router;
