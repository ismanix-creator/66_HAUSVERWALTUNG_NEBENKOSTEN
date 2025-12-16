import { Router } from 'express'
import { mobileService } from '../services/mobile.service'

export const mobileRoutes = Router()

mobileRoutes.get('/dashboard', async (_req, res, next) => {
  try {
    const snapshot = await mobileService.getSnapshot()
    res.json(snapshot)
  } catch (error) {
    next(error)
  }
})
