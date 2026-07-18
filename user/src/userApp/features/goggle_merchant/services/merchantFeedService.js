import { apiFetch, unwrap } from "../../orders/services/api/apiClient";


export const MerchantFeedService = {
  getFeedSettings: async (token) => {
    const response = await apiFetch("/merchant-feed/settings", {
      method: "GET",
      token,
    });
    return unwrap(response);
  },

  updateFeedSettings: async (payload, token) => {
    const response = await apiFetch("/merchant-feed/settings", {
      method: "PUT",
      body: JSON.stringify(payload),
      token,
    });
    return unwrap(response);
  },

  getProducts: async (params = {}, token) => {
    const query = new URLSearchParams(params).toString();

    const response = await apiFetch(
      `/merchant-feed/products${query ? `?${query}` : ""}`,
      {
        method: "GET",
        token,
      }
    );

    return unwrap(response);
  },

  createProduct: async (payload, token) => {
    const response = await apiFetch("/merchant-feed/products", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    });

    return unwrap(response);
  },

  updateProduct: async (id, payload, token) => {
    const response = await apiFetch(`/merchant-feed/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      token,
    });

    return unwrap(response);
  },

  deleteProduct: async (id, token) => {
    const response = await apiFetch(`/merchant-feed/products/${id}`, {
      method: "DELETE",
      token,
    });

    return unwrap(response);
  },

  regenerateFeed: async (token) => {
    const response = await apiFetch("/merchant-feed/regenerate", {
      method: "POST",
      token,
    });

    return unwrap(response);
  },

  getFeedStatus: async (token) => {
    const response = await apiFetch("/merchant-feed/status", {
      method: "GET",
      token,
    });

    return unwrap(response);
  },
};