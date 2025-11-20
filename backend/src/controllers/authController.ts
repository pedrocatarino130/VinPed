import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import pool from '../config/database.js'
import type { AuthRequest } from '../middleware/auth.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d'

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter ao menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter ao menos um caractere especial'),
})

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect()

  try {
    const { name, email, password } = req.body

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at, updated_at`,
      [name, email.toLowerCase(), passwordHash]
    )

    const user = userResult.rows[0]

    // Create default wallet for new user
    await client.query(
      `INSERT INTO wallets (user_id, name, initial_balance, current_balance)
       VALUES ($1, $2, $3, $4)`,
      [user.id, 'Carteira Principal', 0, 0]
    )

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    // Store session
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days
    await client.query(
      `INSERT INTO sessions (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    )

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
        token,
      },
    })
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Email já cadastrado' })
      return
    }
    throw error
  } finally {
    client.release()
  }
}

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect()

  try {
    const { email, password } = req.body

    // Find user
    const userResult = await client.query(
      `SELECT id, name, email, password_hash, created_at, updated_at
       FROM users
       WHERE email = $1`,
      [email.toLowerCase()]
    )

    if (userResult.rows.length === 0) {
      res.status(401).json({ error: 'Email ou senha inválidos' })
      return
    }

    const user = userResult.rows[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      res.status(401).json({ error: 'Email ou senha inválidos' })
      return
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    // Store session
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)
    await client.query(
      `INSERT INTO sessions (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    )

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
        token,
      },
    })
  } catch (error) {
    throw error
  } finally {
    client.release()
  }
}

// Get current user
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const client = await pool.connect()

  try {
    const result = await client.query(
      `SELECT id, name, email, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [req.userId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Usuário não encontrado' })
      return
    }

    const user = result.rows[0]

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    })
  } catch (error) {
    throw error
  } finally {
    client.release()
  }
}

// Logout
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect()

  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.substring(7)

    if (token) {
      await client.query(`DELETE FROM sessions WHERE token = $1`, [token])
    }

    res.json({
      success: true,
      message: 'Logout realizado com sucesso',
    })
  } catch (error) {
    throw error
  } finally {
    client.release()
  }
}
