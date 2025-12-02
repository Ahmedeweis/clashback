const { fetchData } = require("../utils/apiHelper");

const getPlayer = async (req, res) => {
    const tag = req.params.tag;
    const playerTag = `%23${tag.replace("#", "")}`;
    try {
        const data = await fetchData(
            `https://api.clashofclans.com/v1/players/${playerTag}`,
            `player_${tag.replace("#", "")}`
        );
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch player data", details: err.message });
    }
};

module.exports = { getPlayer };
