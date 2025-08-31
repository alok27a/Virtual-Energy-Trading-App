const API_BASE_URL = 'http://127.0.0.1:8000';

async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || `An error occurred: ${response.statusText}`;
    throw new Error(errorMessage);
  }
  
  return response.status === 204 ? null : response.json();
}

// --- AUTHENTICATION ---
export const loginUser = (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  return fetchApi('/api/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });
};

export const registerUser = (email, password) => {
  return fetchApi('/api/v1/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
};

// --- MARKET DATA & TRADING ---
export const getMarketData = (iso, date, token) => {
  return fetchApi(`/api/v1/market-data/${iso}?target_date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserBids = (iso, date, token) => {
    return fetchApi(`/api/v1/bids/${iso}/${date}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const submitBid = (bidData, token) => {
  return fetchApi('/api/v1/bids/', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(bidData),
  });
};

export const runSimulation = (iso, date, token) => {
    return fetchApi(`/api/v1/simulations/${iso}/${date}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });
};
