import { Response } from 'express'
import { z } from 'zod'
import pool from '../config/database.js'
import type { AuthRequest } from '../middleware/auth.js'

// Validation schemas
export const createWalletSchema = z.object({
  name: z.string().min(1).max(50),
  initialBalance: z.number().optional().default(0),
  creditLimit: z.number().optional(),
})

export const updateWalletSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  creditLimit: z.number().optional(),
  isActive: z.boolean().optional(),
})

// Get all wallets for user
export const getWallets = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const client = await pool.connect()

  try {
    const result = await client.query(
      `SELECT
        id,
        user_id,
        name,
        initial_balance,
        current_balance,
        credit_limit,
        current_invoice,
        is_active,
        created_at,
        updated_at
       FROM wallets
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.userId]
    )

    res.json({
      success: true,
      data: result.rows.map((wallet) => ({
        id: wallet.id,
        userId: wallet.user_id,
        name: wallet.name,
        initialBalance: parseFloat(wallet.initial_balance),
        currentBalance: parseFloat(wallet.current_balance),
        creditLimit: wallet.credit_limit ? parseFloat(wallet.credit_limit) : null,
        currentInvoice: wallet.current_invoice ? parseFloat(wallet.current_invoice) : 0,
        isActive: wallet.is_active,
        createdAt: wallet.created_at,
        updatedAt: wallet.updated_at,
      })),
    })
  } catch (error) {
    throw error
  } finally {
    client.release()
  }
}

// Get single wallet
export const getWallet = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const client = await pool.connect()

  try {
    const { id } = req.params

    const result = await client.query(
      `SELECT
        id,
        user_id,
        name,
        initial_balance,
        current_balance,
        credit_limit,
        current_invoice,
        is_active,
        created_at,
        updated_at
       FROM wallets
       WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Carteira não encontrada' })
      return
    }

    const wallet = result.rows[0]

    res.json({
      success: true,
      data: {
        id: wallet.id,
        userId: wallet.user_id,
        name: wallet.name,
        initialBalance: parseFloat(wallet.initial_balance),
        currentBalance: parseFloat(wallet.current_balance),
        creditLimit: wallet.credit_limit ? parseFloat(wallet.credit_limit) : null,
        currentInvoice: wallet.current_invoice ? parseFloat(wallet.current_invoice) : 0,
        isActive: wallet.is_active,
        createdAt: wallet.created_at,
        updatedAt: wallet.updated_at,
      },
    })
  } catch (error) {
    throw error
  } finally {
    client.release()
  }
}

// Create wallet
export const createWallet = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const client = await pool.connect()

  try {
    const { name, initialBalance, creditLimit } = req.body

    const result = await client.query(
      `INSERT INTO wallets (user_id, name, initial_balance, current_balance, credit_limit)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, name, initial_balance, current_balance, credit_limit, current_invoice, is_active, created_at, updated_at`,
      [req.userId, name, initialBalance, initialBalance, creditLimit || null]
    )

    const wallet = result.rows[0]

    res.status(201).json({
      success: true,
      data: {
        id: wallet.id,
        userId: wallet.user_id,
        name: wallet.name,
        initialBalance: parseFloat(wallet.initial_balance),
        currentBalance: parseFloat(wallet.current_balance),
        creditLimit: wallet.credit_limit ? parseFloat(wallet.credit_limit) : null,
        currentInvoice: wallet.current_invoice ? parseFloat(wallet.current_invoice) : 0,
        isActive: wallet.is_active,
        createdAt: wallet.created_at,
        updatedAt: wallet.updated_at,
      },
    })
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Já existe uma carteira com esse nome' })
      return
    }
    throw error
  } finally {
    client.release()
  }
}

// Update wallet
export const updateWallet = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const client = await pool.connect()

  try {
    const { id } = req.params
    const { name, creditLimit, isActive } = req.body

    // Build dynamic update query
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`)
      values.push(name)
      paramCount++
    }

    if (creditLimit !== undefined) {
      updates.push(`credit_limit = $${paramCount}`)
      values.push(creditLimit)
      paramCount++
    }

    if (isActive !== undefined) {
      updates.push(`is_active = $${paramCount}`)
      values.push(isActive)
      paramCount++
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'Nenhum campo para atualizar' })
      return
    }

    values.push(id, req.userId)

    const result = await client.query(
      `UPDATE wallets
       SET ${updates.join(', ')}
       WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
       RETURNING id, user_id, name, initial_balance, current_balance, credit_limit, current_invoice, is_active, created_at, updated_at`,
      values
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Carteira não encontrada' })
      return
    }

    const wallet = result.rows[0]

    res.json({
      success: true,
      data: {
        id: wallet.id,
        userId: wallet.user_id,
        name: wallet.name,
        initialBalance: parseFloat(wallet.initial_balance),
        currentBalance: parseFloat(wallet.current_balance),
        creditLimit: wallet.credit_limit ? parseFloat(wallet.credit_limit) : null,
        currentInvoice: wallet.current_invoice ? parseFloat(wallet.current_invoice) : 0,
        isActive: wallet.is_active,
        createdAt: wallet.created_at,
        updatedAt: wallet.updated_at,
      },
    })
  } catch (error) {
    throw error
  } finally {
    client.release()
  }
}

// Delete wallet
export const deleteWallet = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const client = await pool.connect()

  try {
    const { id } = req.params

    // Check if user has other wallets
    const walletCountResult = await client.query(
      `SELECT COUNT(*) FROM wallets WHERE user_id = $1 AND is_active = TRUE`,
      [req.userId]
    )

    const walletCount = parseInt(walletCountResult.rows[0].count)

    if (walletCount <= 1) {
      res.status(400).json({ error: 'Não é possível excluir a última carteira' })
      return
    }

    const result = await client.query(
      `DELETE FROM wallets
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.userId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Carteira não encontrada' })
      return
    }

    res.json({
      success: true,
      message: 'Carteira excluída com sucesso',
    })
  } catch (error) {
    throw error
  } finally {
    client.release()
  }
}
