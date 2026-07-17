'use strict';

const { z } = require('zod');

const phoneRegex = /^[6-9]\d{9}$/;

const saveContactPreferenceSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter a valid 10-digit mobile number.'),

  countryCode: z
    .string()
    .trim()
    .default('+91'),

  channel: z
    .enum(['whatsapp', 'sms', 'email'])
    .default('whatsapp'),

  consent: z.literal(true, {
    errorMap: () => ({
      message: 'Consent is required to save your number.',
    }),
  }),

  guestId: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => val === '' ? null : val),
});

const unsubscribeSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter a valid 10-digit mobile number.'),
});

module.exports = {
  saveContactPreferenceSchema,
  unsubscribeSchema,
};