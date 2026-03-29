/**
 * @module AuthMiddleware
 * Middleware for JWT verification and Role-Based Access Control (RBAC).
 */
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { type JwtPayload, type UserRole } from "@crm/shared/schemas/auth.schema.js";
import { UnauthorizedError, ForbiddenError } from "../utils/app-errors.js";

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
export const protect = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Validate the presence and format of the Authorization header
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Not authorized, no token provided");
  }

  // 2. Extract the token string
  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Not authorized, token is missing");
  }

  try {
    // 3. Verify JWT
    const decoded = jwt.verify(token!, ENV.JWT_SECRET) as unknown as JwtPayload;
    
    // 4. Attach decoded user data (id, role) to the request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Catching expired or malformed tokens
    throw new UnauthorizedError("Not authorized, invalid or expired token");
  }
};

/**
 * Grants access based on specific user roles.
 * Must be placed after the 'protect' middleware.
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Verify if the user was identified by the 'protect' middleware
    if (!req.user) {
      throw new UnauthorizedError("Authentication required to access this resource");
    }

    // Verify if the user's role is permitted for this route
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Access denied: role '${req.user.role}' is not authorized for this action`
      );
    }

    next();
  };
};