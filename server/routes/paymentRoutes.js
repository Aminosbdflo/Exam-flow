import express from 'express';
import {
    createCheckoutSession,
    handleWebhook,
    getAdminPayments,
    getAdminStats,
    getMyTokens,
    getMyPayments,
    verifySession
} from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Stripe Webhook (handled differently because it needs raw body)
// In server.js we mapped /api/payments/webhook to express.raw()
// so here we just handle POST
router.post('/webhook', handleWebhook);

// Protected routes
router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/verify-session/:sessionId', protect, verifySession);
router.get('/my-tokens', protect, getMyTokens);
router.get('/my-payments', protect, getMyPayments);

// Admin routes
router.get('/admin', protect, admin, getAdminPayments);
router.get('/admin/stats', protect, admin, getAdminStats);

export default router;
