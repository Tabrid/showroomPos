import axios from 'axios';
import baseUrl from '../Components/services/baseUrl';


const API_URL = `${baseUrl}/api/sizeTypes`;

export const fetchSizeTypes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching size types:', error);
        throw error;
    }
};

export const createSizeType = async (name) => {
    try {
        const response = await axios.post(API_URL, { name });
        return response.data;
    } catch (error) {
        console.error('Error creating size type:', error);
        throw error;
    }
};

export const updateSizeType = async (id, name) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, { name });
        return response.data;
    } catch (error) {
        console.error('Error updating size type:', error);
        throw error;
    }
};

export const deleteSizeType = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting size type:', error);
        throw error;
    }
};
