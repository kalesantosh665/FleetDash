import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("================================");
  console.log(req.method, req.originalUrl);

  const authHeader = req.headers.authorization;
  console.log(authHeader);

  console.log("================================");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not Authorized",
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    console.log("Decoded:", decoded);

    req.userId = decoded.id;

    next();
  } catch (err) {
    console.error("JWT Error:", err);

    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};