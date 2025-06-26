import dotenv from 'dotenv';

import ms from 'ms';

dotenv.config();

const ENV = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!, // "!" to avoid type error in jwt.sign . We're telling typescript that JWT_ACESS_SECRET won't be null in any case, since it can't "see" into .env file
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMIN_MAILS: [
    'admin@aueb.gr',
    'mpampisb@gmail.com'
  ],
}

export default ENV;