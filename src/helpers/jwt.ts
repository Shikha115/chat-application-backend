
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "30d";


export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}


export function verifyToken(token: string): object | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as object;
  } catch (err) {
    return null;
  }
}


export function getTokenFromHeader(headers: any): string | null {
  if (!headers?.authorization) return null;
  const [type, token] = headers.authorization.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}
