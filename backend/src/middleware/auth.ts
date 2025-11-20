import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { UUID } from '@shared/types/index.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthRequest extends Request {
  userId?: UUID
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' })
      return
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: UUID }
      req.userId = decoded.userId
      next()
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' })
      return
    }
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
