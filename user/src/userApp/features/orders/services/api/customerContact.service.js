import { apiFetch, unwrap } from './apiClient';

const STORAGE_KEY = 'babli_customer_phone';
const CONTACT_PREFERENCES_ENDPOINT = '/customers/contact-preferences'; // -> {API_BASE_URL}/customers/contact-preferences

// Indian mobile numbers: 10 digits, starting 6-9.
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export const CustomerContactService = {
  isValidIndianMobile(phone) {
    return INDIAN_MOBILE_REGEX.test(String(phone || '').trim());
  },

  getSavedPhone() {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  },

  // Persists the customer's number server-side and caches it locally.
  // Pass `token` when the customer is logged in so the backend can link
  // the preference to their account instead of treating it as a guest.
  async saveForOrderUpdates(phone, { channel = 'whatsapp', token } = {}) {
    const trimmed = String(phone || '').trim();

    if (!this.isValidIndianMobile(trimmed)) {
      throw new Error('Enter a valid 10-digit mobile number.');
    }

    const response = await apiFetch(CONTACT_PREFERENCES_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        phone: trimmed,
        countryCode: '+91',
        channel,
        consent: true,
      }),
      token,
    });

    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      // Non-fatal: local caching is a convenience, not a requirement.
    }

    return unwrap(response);
  },

  async unsubscribe(phone, token) {
    const response = await apiFetch(`${CONTACT_PREFERENCES_ENDPOINT}/unsubscribe`, {
      method: 'PATCH',
      body: JSON.stringify({ phone: String(phone || '').trim() }),
      token,
    });
    return unwrap(response);
  },
};