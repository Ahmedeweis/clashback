const { fetchData, encodeTag } = require("../utils/apiHelper");

const getPlayer = async (req, res) => {
    res.json(await fetchData(`/players/${encodeTag(req.params.tag)}`));
};

module.exports = { getPlayer };
