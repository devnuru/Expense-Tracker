import ratelimiter from "../config/upstash.js";

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    // here we just kept it simple.
    // In a real-world scenario, you might want to use a unique identifier for each user (like user ID or IP address) to apply rate limiting per user.
    const { success } = await ratelimiter.limit("my-rate-limit");

    if (!success) {
      return res
        .status(429)
        .json({ error: "Too many requests, please try again later" });
    }

    next();
  } catch (error) {
    console.error("Rate limiting error:", error);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
};

export default rateLimiterMiddleware;
