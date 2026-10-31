const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Clash of Clans API Proxy",
            version: "1.0.0",
            description: "API documentation for the Clash of Clans proxy server",
        },
        servers: [
            {
                url: "/",
                description: "Current server",
            },
        ],
    },
    apis: [path.join(__dirname, "routes/*.js").replace(/\\/g, "/")], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
