/**
 * @module AuthMiddleware
 * Middleware for JWT verification and Role-Based Access Control (RBAC).
 */
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import type {JwtPayload, UserRole } from "@crm/shared/schemas/auth.schema.js";

/**
 * Extend Express Request interface to include the authenticated user payload.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Protects routes by verifying the JSON Web Token.
 */
export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Validate the presence and format of the Authorization header
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }

  // Extract the token string from the 'Bearer <token>' format
  const token = authHeader.split(" ")[1];

  // Explicit check to satisfy TypeScript narrowing
  if (!token) {
    return res.status(401).json({ error: "Not authorized, token is missing" });
  }

  try {
    const decoded = jwt.verify(token!, ENV.JWT_SECRET) as unknown as JwtPayload;
    
    // Attach decoded user data (id, role) to the request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized, invalid or expired token" });
  }
};

/**
 * Grants access based on specific user roles.
 * Must be placed after the 'protect' middleware.
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify if the user's role is permitted for this route
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied: role '${req.user.role}' is not authorized` 
      });
    }

    next();
  };
};