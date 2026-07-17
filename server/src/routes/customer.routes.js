'use strict';

const { Router } = require('express');
const { optionalAuth } = require('../middleware/auth.middleware');
const { paymentLimiter } = require('../middleware/rateLimiter.middleware'); // reuse, or add a dedicated one alongside it
const { validate } = require('../middleware/validate.middleware');
const { saveContactPreferenceSchema, unsubscribeSchema } = require('../validators/customer.validator');
const customerController = require('../controllers/customer.controller');

const router = Router();

router.post(
  '/contact-preferences',
  paymentLimiter,
  optionalAuth,
  validate(saveContactPreferenceSchema),
  customerController.saveContactPreference
);

router.patch(
  '/contact-preferences/unsubscribe',
  paymentLimiter,
  optionalAuth,
  validate(unsubscribeSchema),
  customerController.unsubscribe
);

// TODO: gate with an admin-only auth middleware before going live —
// this lists every subscribed phone number.
router.get('/contact-preferences/subscribers', customerController.listSubscribers);

module.exports = router;