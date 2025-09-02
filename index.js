const express = require("express");
const axios = require("axios");
require("dotenv").config();
const app = express();
app.use(express.json());
const API_TOKEN = process.env.COC_API_TOKEN;
const CLAN_TAG = "%232PYCUY8RG"; // %23 = # //  2PPCCLUQV // 2PYCUY8RG احنا
const clanUrl = `https://api.clashofclans.com/v1/clans/${CLAN_TAG}`;
// ✅ كاش للكلاَن واللاعبين
const clanCache = { data: null, expires: 0 };
const playerCache = new Map();
// ✅ راوت الكلان مع كاش
// راوت بياخد التاج كـ باراميتر
app.get("/api/clan/:tag", async (req, res) => {
  const rawTag = req.params.tag;
  const clanTag = encodeURIComponent(rawTag);
  const clanUrl = `https://api.clashofclans.com/v1/clans/${clanTag}`;
  try {
    const { data } = await axios.get(clanUrl, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      return res.status(401).json({ error: "❌ API token expired or invalid" });
    }
    if (status === 404) {
      return res.status(404).json({ error: "❌ Clan not found" });
    }
    res.status(500).json({ error: "❌ Failed to fetch clan data", details: err.message });
  }
});
// ✅ راوت اللاعب مع كاش
app.get("/api/player/:tag", async (req, res) => {
  const playerTag = `%23${req.params.tag.replace("#", "")}`;
  if (playerCache.has(playerTag)) {
    return res.json(playerCache.get(playerTag));
  }
  try {
    const { data } = await axios.get(
      `https://api.clashofclans.com/v1/players/${playerTag}`,
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      }
    );
    playerCache.set(playerTag, data);
    setTimeout(() => playerCache.delete(playerTag), 5 * 60 * 1000); // امسح بعد 5 دقايق
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch player data" });
  }
});
// ✅ راوت CWL League Group
app.get("/api/clan/cwl", async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.clashofclans.com/v1/clans/${CLAN_TAG}/currentwar/leaguegroup`,
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      }
    );
    res.json(data);
  } catch (err) {
    console.error("❌ CWL Fetch Error status:", err.response?.status);
    console.error("❌ CWL Fetch Error headers:", err.response?.headers);
    console.error("❌ CWL Fetch Error data:", err.response?.data);
    console.error("❌ CWL Fetch Error message:", err.message);
    res.status(500).json({ error: "❌ Failed to fetch CWL League Group", details: err.response?.data || err.message });
  }
});
app.get("/api/cwl/war/:tag", async (req, res) => {
  const tag = `%23${req.params.tag}`;
  try {
    const { data } = await axios.get(
      `https://api.clashofclans.com/v1/clanwarleagues/wars/${tag}`,
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch CWL war data" });
  }
});
// ✅ السيرفر شغال
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
