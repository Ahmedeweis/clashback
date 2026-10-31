const API_BASE = "https://api.clashofclans.com/v1";
const API_TOKEN = process.env.COC_API_TOKEN;
const REQUEST_TIMEOUT_MS = 10_000;
const DEFAULT_TTL_MS = 60_000;
const MAX_CACHE_ENTRIES = 1000;

if (!API_TOKEN) {
    console.error("❌ COC_API_TOKEN is missing. Set it in .env");
    process.exit(1);
}

// In-memory cache: url -> { data, expires }
const cache = new Map();
// Requests in flight, so concurrent calls for the same url share one upstream request
const pending = new Map();

class ApiError extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

// Normalize a tag ("#ABC", "abc", "%23abc") into its URL-encoded form "%23ABC"
function encodeTag(tag) {
    const clean = decodeURIComponent(String(tag)).trim().replace(/^#/, "").toUpperCase();
    return `%23${clean}`;
}

// Use the API's Cache-Control max-age when present, otherwise the default TTL
function ttlFrom(res) {
    const match = /max-age=(\d+)/.exec(res.headers.get("cache-control") || "");
    return match ? Number(match[1]) * 1000 : DEFAULT_TTL_MS;
}

async function request(url) {
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}`, Accept: "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const body = await res.json().catch(() => null);

    if (!res.ok) {
        console.error(`❌ API ${res.status}: ${url}`, body?.reason || "");
        throw new ApiError(res.status, body?.reason || `Upstream error ${res.status}`, body);
    }

    if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value);
    cache.set(url, { data: body, expires: Date.now() + ttlFrom(res) });
    return body;
}

async function fetchData(path) {
    const url = `${API_BASE}${path}`;

    const hit = cache.get(url);
    if (hit && hit.expires > Date.now()) return hit.data;

    if (!pending.has(url)) {
        pending.set(url, request(url).finally(() => pending.delete(url)));
    }
    return pending.get(url);
}

module.exports = { fetchData, encodeTag, ApiError };
