const express = require("express");
const axios = require("axios");
require("dotenv").config();
const app = express();
// Middlewares
app.use(express.json());
const API_TOKEN = process.env.COC_API_TOKEN;
// راوت الكلان
app.get("/api/clan/:tag", async (req, res) => {
  const clanTag = encodeURIComponent(req.params.tag);
  try {
    const { data } = await axios.get(`https://api.clashofclans.com/v1/clans/${clanTag}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status;
    if (status === 401 || status === 403) return res.status(401).json({ error: "API token expired" });
    if (status === 404) return res.status(404).json({ error: "Clan not found" });
    res.status(500).json({ error: "Failed to fetch clan data", details: err.message });
  }
});
// راوت اللاعب
app.get("/api/player/:tag", async (req, res) => {
  const playerTag = `%23${req.params.tag.replace("#", "")}`;
  try {
    const { data } = await axios.get(`https://api.clashofclans.com/v1/players/${playerTag}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch player data", details: err.message });
  }
});
// راوت CWL لكلان معين
app.get("/api/clan/:tag/cwl", async (req, res) => {
  console.log("💡 CWL request received for clan:", req.params.tag); // هنا تأكد من وصول الطلب
  const clanTag = encodeURIComponent(req.params.tag);
  try {
    const { data } = await axios.get(
      `https://api.clashofclans.com/v1/clans/${clanTag}/currentwar/leaguegroup`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );
    console.log("💡 Data received from COC API:", data); // هنا تأكد من وصول البيانات
    res.json(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    const status = err.response?.status;
    if (status === 401 || status === 403) return res.status(401).json({ error: "API token expired or invalid" });
    if (status === 404) return res.status(404).json({ error: "Clan is not in CWL right now" });
    res.status(500).json({ error: "Failed to fetch CWL data", details: err.message });
  }
});
// راوت CWL للحرب واحدة
app.get("/api/cwl/war/:warTag", async (req, res) => {
  const warTag = encodeURIComponent(req.params.warTag); // تأكد من الترميز
  try {
    const { data } = await axios.get(
      `https://api.clashofclans.com/v1/warleagues/wars/${warTag}`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );
    res.json(data);
  } catch (err) {
    const status = err.response?.status;
    if (status === 404) return res.status(404).json({ error: "War not found" });
    res.status(500).json({ error: "Failed to fetch war data", details: err.message });
  }
});
// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
});
