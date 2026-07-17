'use strict';

const { Schema, model, Types } = require('mongoose');

const CONTACT_CHANNELS = ['whatsapp', 'sms', 'email'];

const contactPreferenceSchema = new Schema(
  {
    // Set when the customer was logged in at the time of opt-in.
    // Left null for guest opt-ins.
    user: {
      type: Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Stable per-device id for guests (mirrors getOrCreateGuestId() on
    // the frontend), so a guest's opt-in can still be traced to a device.
    guestId: {
      type: String,
      default: null,
    },

    countryCode: {
      type: String,
      default: '+91',
      trim: true,
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number.'],
    },

    channel: {
      type: String,
      enum: CONTACT_CHANNELS,
      default: 'whatsapp',
    },

    // Explicit opt-in captured at submission time — required for consent
    // records, kept separate from isSubscribed so history isn't lost.
    consent: {
      type: Boolean,
      required: true,
    },

    // Master switch for whether this number should currently receive
    // offers/updates. Toggled off on unsubscribe instead of deleting
    // the document, so consent history is preserved.
    isSubscribed: {
      type: Boolean,
      default: true,
    },

    source: {
      type: String,
      default: 'cart_drawer',
      trim: true,
    },

    lastNotifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// One record per phone number — repeat submissions update it instead of
// creating duplicates in the offers list.
contactPreferenceSchema.index({ phone: 1 }, { unique: true });
contactPreferenceSchema.index({ isSubscribed: 1 });
contactPreferenceSchema.index({ user: 1 });

module.exports = model('ContactPreference', contactPreferenceSchema);