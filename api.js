const API_URL = "https://fakestoreapi.com/products";

// Fetch all products from the API
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const products = await response.json();

        return products;

    } catch (error) {
        throw error;
    }
}
