const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const API_TOKEN = process.env.COC_API_TOKEN;


// Helper function to fetch data without caching
async function fetchData(url, cacheKey) {
    try {
        console.log(`🌐 Fetching from API: ${url}`);
        const { data } = await axios.get(url, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        return data;
    } catch (err) {
        console.error(`❌ API Error: ${err.message}`);
        if (err.response && err.response.data) {
            console.error("Details:", JSON.stringify(err.response.data, null, 2));
        }
        throw err;
    }
}

module.exports = { fetchData };
