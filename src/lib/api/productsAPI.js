// lib/api/productsAPI.js
export const getProducts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    return response.json()
}
