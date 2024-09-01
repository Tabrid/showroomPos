import axios from 'axios';
import baseUrl from '../Components/services/baseUrl';


const API_URL = `${baseUrl}/api/sizes`;

export const fetchSizes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching sizes:', error);
        throw error;
    }
};

export const createSize = async (sizeType, sizes) => {
    try {
        const response = await axios.post(API_URL, { sizeType, sizes });
        return response.data;
    } catch (error) {
        console.error('Error creating size:', error);
        throw error;
    }
};

export const updateSize = async (id, sizeType, sizes) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, { sizeType, sizes });
        return response.data;
    } catch (error) {
        console.error('Error updating size:', error);
        throw error;
    }
};

export const deleteSize = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting size:', error);
        throw error;
    }
};

export const fetchSizesBySizeTypeName = async (name) => {
    try {
        const response = await axios.get(`${API_URL}/by-size-type-name/${name}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sizes by size type name:', error);
        throw error;
    }
};