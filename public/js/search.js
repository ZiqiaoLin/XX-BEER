// Search functionality
function initSearch() {
  const searchInput = document.querySelector('#searchContainer input[type="search"]')
  const productList = document.querySelector('#productList')
  const searchButton = document.querySelector('#searchContainer button')
  const quickLink = document.querySelector('#quickLink')

  // check URL parameters when page loads
  const urlParams = new URLSearchParams(window.location.search)
  const searchTerm = urlParams.get('q') || ''
  searchInput.value = searchTerm
  performSearch(searchTerm)

  // handle search button click and Enter key
  function handleSearch() {
    const searchTerm = searchInput.value.trim()
    performSearch(searchTerm)
  }

  searchButton.addEventListener('click', handleSearch)

  // Handle Enter key press
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  })

  // Handle quick links
  if (quickLink) {
    quickLink.addEventListener('click', e => {
      if (e.target.closest('a')) {
        e.preventDefault()
        const category = e.target.closest('a').dataset.category
        window.location.href = `index.html#${category}`
      }
    })
  }
}

// Perform search and handle results
function performSearch(searchTerm) {
  fetch('api/products')
    .then(res => res.json())
    .then(products => {
      const filteredProducts = searchTerm === '' ? [] : products.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_category.toLowerCase().includes(searchTerm.toLowerCase())
      )

      const productList = document.querySelector('#productList')
      if (filteredProducts.length === 0) {
        productList.classList.remove('border-t-[0.5px]')
        productList.innerHTML = `
          <div class="w-full text-center py-8">
            <h2 class="text-2xl text-gray-700 mt-32">No results found for: "${searchTerm}"</h2>
          </div>
          <div class="flex items-center justify-center w-full h-44">
            <a href="index.html"
          class="flex border-2 border-[#98252d] rounded-md w-64 h-9 mb-8 mx-auto font-bold text-[#98252d] hover:bg-[#98252d] hover:text-stone-50  cursor-pointer justify-center items-center">CONTINUE
          SHOPPING</a>
          </div>
        `
      } else {
        renderSearchResults(filteredProducts)
      }
    })
}

// Render search results
function renderSearchResults(products) {
  const container = document.querySelector('#productList')
  container.innerHTML = ''
  container.classList.add('border-t-[0.5px]')

  products.forEach(product => {
    const inStock = product.product_stock > 0
    container.innerHTML += `
      <div class="productCard flex flex-col w-1/2 sm:w-1/3 border-r-[0.5px] border-r-gray-400 border-b-[0.5px] border-b-gray-400">
        <div class="group overflow-hidden">
          <img src="${product.product_src}" alt="${product.product_name}" class="w-full h-auto transform transition-transform duration-[500ms] group-hover:scale-120 group-hover:duration-[1000ms]">
        </div>
        <h3 class="font-extrabold text-2xl text-center">${product.product_name}</h3>
        <div class="flex justify-around py-1.5 px-1.5">
          <span class="flex items-center justify-center w-16 h-6 bg-[#98252d] text-stone-50 text-sm font-bold select-none">$${product.product_price}</span>
          <span class="stock flex items-center justify-center h-6 text-sm font-medium select-none" data-stock="${product.product_stock}">${inStock ? 'IN STOCK' : 'OUT OF STOCK'}</span>
        </div>

        ${inStock ? `
          <div class="flex justify-between items-center border border-black w-32 h-8 px-4 my-3 mx-auto select-none">
            <button class="decrease font-extralight text-2xl cursor-pointer pt-0.5">-</button>
            <span class="quantity font-light">1</span>
            <button class="increase font-extralight text-2xl cursor-pointer pt-0.5">+</button>
          </div>
          <button class="addToCart border border-[#98252d] w-44 h-8 mb-8 mx-auto font-bold text-[#98252d] hover:bg-[#98252d] hover:text-stone-50  cursor-pointer select-none" data-id="${product.product_id}">
            ADD TO CART
          </button>
        ` : `
          <button class="border border-gray-400 w-44 h-8 mx-auto mb-8 font-bold text-gray-400 cursor-not-allowed line-through select-none">
            OUT OF ORDER
          </button>
        `}
      </div>
    `
  })

  // Initialize quantity controls and add to cart functionality
  quantityControls()
  addToCart(products)
}

// Handle category navigation
function initCategoryNav() {
  const navCategory = document.querySelector('#navCategory')

  navCategory.addEventListener('click', e => {
    if (e.target.tagName === 'LI') {
      const category = e.target.dataset.category
      window.location.href = `index.html#${category}`
    }
  })
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', () => {
  initSearch()
  initCategoryNav()
  updateCartBadge()
}); 