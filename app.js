const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const productContainer = document.getElementById("productContainer");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

let allProducts = [];

// Load products from API
async function loadProducts() {
    loading.style.display = "block";
    error.textContent = "";

    try {
        allProducts = await fetchProducts();

        // Save products in localStorage
        localStorage.setItem(
            "products",
            JSON.stringify(allProducts)
        );

        displayCategories();
        displayProducts();

    } catch (err) {
        // Try loading saved products
        const savedProducts = localStorage.getItem("products");

        if (savedProducts) {
            allProducts = JSON.parse(savedProducts);
            displayCategories();
            displayProducts();

            error.textContent =
                "API unavailable. Showing saved products.";
        } else {
            error.textContent =
                "Unable to load products. Please try again.";
        }

    } finally {
        loading.style.display = "none";
    }
}

// Display categories
function displayCategories() {
    const categories = [
        ...new Set(allProducts.map(product => product.category))
    ];

    categoryFilter.innerHTML =
        '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });
}

// Search, filter and sort products
function displayProducts() {
    let products = [...allProducts];

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortValue = sortSelect.value;

    // Search products
    products = products.filter(product =>
        product.title.toLowerCase().includes(searchText)
    );

    // Filter by category
    if (selectedCategory !== "all") {
        products = products.filter(product =>
            product.category === selectedCategory
        );
    }

    // Sort products
    if (sortValue === "low-high") {
        products.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high-low") {
        products.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name") {
        products.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    renderProducts(products);
}

// Display product cards
function renderProducts(products) {
    productContainer.innerHTML = "";

    if (products.length === 0) {
        productContainer.textContent = "No products found.";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.title;

        const title = document.createElement("h3");
        title.textContent = product.title;

        const category = document.createElement("p");
        category.textContent = product.category;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = "$" + product.price;

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(category);
        card.appendChild(price);

        productContainer.appendChild(card);
    });
}

// Event listeners
searchInput.addEventListener("input", displayProducts);
categoryFilter.addEventListener("change", displayProducts);
sortSelect.addEventListener("change", displayProducts);

// Start application
loadProducts();
