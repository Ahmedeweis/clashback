const { fetchData } = require("../utils/apiHelper");

const getClan = async (req, res) => {
    const tag = req.params.tag;
    const clanTag = encodeURIComponent(tag);
    try {
        const data = await fetchData(
            `https://api.clashofclans.com/v1/clans/${clanTag}`,
            `clan_${tag.replace("#", "")}`
        );
        res.json(data);
    } catch (err) {
        const status = err.response?.status || 500;
        res.status(status).json({ error: "Failed to fetch clan data", details: err.message });
    }
};

const getClanCWL = async (req, res) => {
    const tag = req.params.tag;
    const clanTag = encodeURIComponent(tag);
    try {
        const data = await fetchData(
            `https://api.clashofclans.com/v1/clans/${clanTag}/currentwar/leaguegroup`,
            `clan_cwl_${tag.replace("#", "")}`
        );
        res.json(data);
    } catch (err) {
        const status = err.response?.status || 500;
        if (status === 404) return res.status(404).json({ error: "Clan is not in CWL right now" });
        res.status(status).json({ error: "Failed to fetch CWL data", details: err.message });
    }
};

module.exports = { getClan, getClanCWL };
