module.exports = {
    PORT: 4000,
    DATABASE_URL: "mongodb://localhost:27017/setko",
    CORS: {
        ORIGIN_URLS: [
            "http://localhost:3000",
            "http://localhost:4000"
        ],
        METHODS: ["GET", "POST", "PUT", "DELETE"],
        ALLOWED_HEADERS: ["Content-Type", "Authorization", "Set-Cookie"],
        CREDENTIALS: true
    }
};