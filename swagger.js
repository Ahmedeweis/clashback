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
                url: "http://localhost:5000",
                description: "Local server",
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
