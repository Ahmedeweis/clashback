const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
// Middlewares
app.use(cors());
app.use(express.json());

const API_TOKEN = process.env.COC_API_TOKEN;
const CACHE_DIR = path.join(__dirname, "cache");

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

// Helper function to fetch data with caching
async function fetchData(url, cacheKey) {
  const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);

  try {
    console.log(`🌐 Fetching from API: ${url}`);
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });

    // Save to cache
    fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
    console.log(`💾 Saved to cache: ${cacheKey}`);
    return data;
  } catch (err) {
    console.error(`❌ API Error: ${err.message}`);
    if (err.response && err.response.data) {
      console.error("Details:", JSON.stringify(err.response.data, null, 2));
    }

    // If API fails, try to serve from cache
    if (fs.existsSync(cacheFile)) {
      console.log(`📂 Serving from cache: ${cacheKey}`);
      const cachedData = fs.readFileSync(cacheFile, "utf-8");
      return JSON.parse(cachedData);
    }

    // If no cache, throw the error
    throw err;
  }
}

// راوت الكلان
app.get("/api/clan/:tag", async (req, res) => {
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
});

// راوت اللاعب
app.get("/api/player/:tag", async (req, res) => {
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
});

// راوت CWL لكلان معين
app.get("/api/clan/:tag/cwl", async (req, res) => {
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
});

// راوت CWL للحرب واحدة
app.get("/api/cwl/war/:warTag", async (req, res) => {
  const warTag = encodeURIComponent(req.params.warTag);
  try {
    const data = await fetchData(
      `https://api.clashofclans.com/v1/warleagues/wars/${warTag}`,
      `war_${req.params.warTag.replace("#", "")}`
    );
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    if (status === 404) return res.status(404).json({ error: "War not found" });
    res.status(status).json({ error: "Failed to fetch war data", details: err.message });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
  console.log(`📂 Cache directory: ${CACHE_DIR}`);
});
