const express = require("express");
const router = express.Router();
const { getClan, getClanCWL, getClanWarLog } = require("../controllers/clanController");

/**
 * @swagger
 * tags:
 *   name: Clans
 *   description: Clan management and retrieval
 */

/**
 * @swagger
 * /api/clan/{tag}:
 *   get:
 *     summary: Get clan information
 *     tags: [Clans]
 *     parameters:
 *       - in: path
 *         name: tag
 *         schema:
 *           type: string
 *         required: true
 *         description: Clan tag (e.g., #2Q8Y9999)
 *     responses:
 *       200:
 *         description: Clan data
 *       500:
 *         description: Failed to fetch clan data
 */
router.get("/:tag", getClan);

/**
 * @swagger
 * /api/clan/{tag}/cwl:
 *   get:
 *     summary: Get CWL (Clan War League) group for a clan
 *     tags: [Wars]
 *     parameters:
 *       - in: path
 *         name: tag
 *         schema:
 *           type: string
 *         required: true
 *         description: Clan tag
 *     responses:
 *       200:
 *         description: CWL group data
 *       404:
 *         description: Clan is not in CWL right now
 *       500:
 *         description: Failed to fetch CWL data
 */
router.get("/:tag/cwl", getClanCWL);

/**
 * @swagger
 * /api/clan/{tag}/warlog:
 *   get:
 *     summary: Get clan war log
 *     tags: [Clans]
 *     parameters:
 *       - in: path
 *         name: tag
 *         schema:
 *           type: string
 *         required: true
 *         description: Clan tag
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit the number of items returned
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *         description: Return only items after this marker
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *         description: Return only items before this marker
 *     responses:
 *       200:
 *         description: Clan war log data
 *       500:
 *         description: Failed to fetch war log
 */
router.get("/:tag/warlog", getClanWarLog);

module.exports = router;
