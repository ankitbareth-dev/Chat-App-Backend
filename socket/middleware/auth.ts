import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import env from "../../utils/envVariable";
import { Socket } from "socket.io";

declare module "socket.io" {
  interface Socket {
    userId?: string;
  }
}

export const socketAuthMiddleware = async (socket: Socket, next: any) => {
  try {
    const cookiesHeader = socket.handshake.headers.cookie;
    console.log("🍪 Raw cookie header:", cookiesHeader);

    if (!cookiesHeader) {
      return next(new Error("Unauthorized: No cookies"));
    }

    const parsedCookies = cookie.parse(cookiesHeader);
    console.log("🍪 Parsed cookies:", parsedCookies);

    const token = parsedCookies.token;
    if (!token) {
      return next(new Error("Unauthorized: No token"));
    }

    const decoded: any = jwt.verify(token, env.JWT_SECRET);
    socket.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("❌ Socket auth error:", error);
    next(new Error("Unauthorized: Invalid token"));
  }
};
