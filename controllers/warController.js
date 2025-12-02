const { fetchData } = require("../utils/apiHelper");

const getWar = async (req, res) => {
    const warTag = encodeURIComponent(req.params.warTag);
    try {
        const data = await fetchData(
            `https://api.clashofclans.com/v1/clanwarleagues/wars/${warTag}`,
            `war_${req.params.warTag.replace("#", "")}`
        );
        res.json(data);
    } catch (err) {
        const status = err.response?.status || 500;
        if (status === 404) return res.status(404).json({ error: "War not found" });
        res.status(status).json({ error: "Failed to fetch war data", details: err.message });
    }
};

module.exports = { getWar };
