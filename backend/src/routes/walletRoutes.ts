import { Router } from 'express'
import {
  getWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
  createWalletSchema,
  updateWalletSchema,
} from '../controllers/walletController.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

router.get('/', getWallets)
router.get('/:id', getWallet)
router.post('/', validate(createWalletSchema), createWallet)
router.patch('/:id', validate(updateWalletSchema), updateWallet)
router.delete('/:id', deleteWallet)

export default router
