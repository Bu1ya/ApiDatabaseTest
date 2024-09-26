const RATE_LIMIT_DURATION_MS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 50

module.exports = {
    REQUEST_LIMITS: {
        RATE_LIMIT_DURATION_MS,
        MAX_REQUESTS_PER_WINDOW,
        MESSAGE: "Too many requests, please try again later."
    }
}