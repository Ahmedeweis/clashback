const axios = require("axios");
require("dotenv").config();

const API_TOKEN = process.env.COC_API_TOKEN;
const warTag = "#8QYRPJJRL";
const encodedTag = encodeURIComponent(warTag);
const url = `https://api.clashofclans.com/v1/clanwarleagues/wars/${encodedTag}`;

console.log(`Testing URL: ${url}`);

async function test() {
    try {
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        console.log("Success!");
        console.log("Status:", response.status);
        console.log("Data preview:", JSON.stringify(response.data).substring(0, 100));
    } catch (err) {
        console.error("Error!");
        console.error("Status:", err.response?.status);
        console.error("Message:", err.message);
        if (err.response?.data) {
            console.error("Data:", JSON.stringify(err.response.data, null, 2));
        }
    }
}

test();
