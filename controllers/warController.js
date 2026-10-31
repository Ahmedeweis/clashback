const { fetchData, encodeTag } = require("../utils/apiHelper");

const getWar = async (req, res) => {
    try {
        res.json(await fetchData(`/clanwarleagues/wars/${encodeTag(req.params.warTag)}`));
    } catch (err) {
        if (err.status === 404) return res.status(404).json({ error: "War not found" });
        throw err;
    }
};

module.exports = { getWar };
