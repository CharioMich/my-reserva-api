import {rateLimit} from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60000, // 1 min time window 
  limit: 40,       // 40 requests per window per IP
  standardHeaders: 'draft-8',
  legacyHeaders: false, // disables deprecated headers
  message: {
    error: 'Too many requests in a given amount of time. Please try again later.'
  },
});

export default limiter;