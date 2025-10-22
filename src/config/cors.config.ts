import { CorsOptions } from "cors";

const whitelist = [
  process.env.Web_URL,
  "http://localhost:8080",
  "http://localhost:3000",
  "http://192.168.10.106:3000",
  "http://127.0.0.1:3000",
];

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin like Postman or curl
    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.log(origin, "blocked by CORS");
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // if you want cookies/auth headers
};
