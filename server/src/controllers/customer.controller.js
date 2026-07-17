'use strict';

const ContactPreference = require('../models/contactPreference.model');

// POST /customers/contact-preferences
// Upserts by phone so a returning customer editing their number updates
// the same record rather than creating a duplicate in the offers list.
exports.saveContactPreference = async (req, res, next) => {
  try {
    const { phone, countryCode, channel, guestId } = req.body;
    const userId = req.user?.id || req.user?._id || null;

    const update = {
      phone,
      countryCode: countryCode || '+91',
      channel: channel || 'whatsapp',
      consent: true,
      isSubscribed: true,
      source: 'cart_drawer',
    };

    if (userId) update.user = userId;
    if (!userId && guestId) update.guestId = guestId;

    const preference = await ContactPreference.findOneAndUpdate(
      { phone },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: {
        phone: preference.phone,
        channel: preference.channel,
        isSubscribed: preference.isSubscribed,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      err.status = 409;
      err.message = 'This number is already registered.';
    }
    next(err);
  }
};

// PATCH /customers/contact-preferences/unsubscribe
// Flips isSubscribed off rather than deleting — keeps consent history
// intact and lets them opt back in later without re-entering everything.
exports.unsubscribe = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const preference = await ContactPreference.findOneAndUpdate(
      { phone },
      { $set: { isSubscribed: false } },
      { new: true }
    );

    if (!preference) {
      return res.status(404).json({ success: false, message: 'No preference found for this number.' });
    }

    return res.status(200).json({ success: true, data: preference });
  } catch (err) {
    next(err);
  }
};

// GET /customers/contact-preferences/subscribers  (internal/admin use —
// pulls the list to actually send offers to; add an admin-auth guard
// on this route before exposing it).
exports.listSubscribers = async (req, res, next) => {
  try {
    const subscribers = await ContactPreference.find({ isSubscribed: true })
      .select('phone countryCode channel user lastNotifiedAt -_id')
      .lean();

    return res.status(200).json({ success: true, data: subscribers });
  } catch (err) {
    next(err);
  }
};