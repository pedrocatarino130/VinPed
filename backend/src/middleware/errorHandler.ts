import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error)

  // Zod validation errors
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    })
    return
  }

  // Database errors
  if (error.code) {
    switch (error.code) {
      case '23505': // Unique violation
        res.status(409).json({ error: 'Registro já existe' })
        return
      case '23503': // Foreign key violation
        res.status(400).json({ error: 'Referência inválida' })
        return
      case '23514': // Check constraint violation
        res.status(400).json({ error: 'Dados inválidos' })
        return
    }
  }

  // Default error
  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal server error'

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  })
}
