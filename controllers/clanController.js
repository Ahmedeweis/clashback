const { fetchData, encodeTag } = require("../utils/apiHelper");

const WARLOG_PARAMS = ["limit", "after", "before"];

const getClan = async (req, res) => {
    res.json(await fetchData(`/clans/${encodeTag(req.params.tag)}`));
};

const getClanCWL = async (req, res) => {
    try {
        res.json(await fetchData(`/clans/${encodeTag(req.params.tag)}/currentwar/leaguegroup`));
    } catch (err) {
        if (err.status === 404) return res.status(404).json({ error: "Clan is not in CWL right now" });
        throw err;
    }
};

const getClanWarLog = async (req, res) => {
    // Forward only the query params the API supports
    const query = new URLSearchParams();
    for (const key of WARLOG_PARAMS) {
        if (req.query[key] !== undefined) query.set(key, req.query[key]);
    }
    const qs = query.toString();

    try {
        res.json(await fetchData(`/clans/${encodeTag(req.params.tag)}/warlog${qs ? `?${qs}` : ""}`));
    } catch (err) {
        if (err.status === 403) {
            return res.status(403).json({ error: "AccessDenied", message: "Clan war log is private" });
        }
        throw err;
    }
};

module.exports = { getClan, getClanCWL, getClanWarLog };
