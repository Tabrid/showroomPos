import baseUrl from "../Components/services/baseUrl";

const API_BASE_URL = `${baseUrl}/api`;

export const fetchTypes = async () => {
    const response = await fetch(`${API_BASE_URL}/types`);
    return response.json();
};

export const createType = async (name, image) => {
    const response = await fetch(`${API_BASE_URL}/types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image }), // Include image in the request body
    });
    return response.json();
};

export const updateType = async (id, name, image) => {
    const response = await fetch(`${API_BASE_URL}/types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image }), // Include image in the request body
    });
    return response.json();
};

export const deleteType = async (id) => {
    const response = await fetch(`${API_BASE_URL}/types/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

export const fetchSku = async () => {
    const response = await fetch(`${baseUrl}/api/products/products/sku`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};
