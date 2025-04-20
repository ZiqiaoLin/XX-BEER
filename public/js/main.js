(function () {
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.body.classList.contains('cartPage') && !document.body.classList.contains('checkoutPage') && !document.body.classList.contains('confirmationPage')) {
      const navFloating = document.querySelector('#navFloating')
      const searchToggleList = document.querySelectorAll('#searchToggle')
      const searchContainer = document.querySelector('#searchContainer')
      const mainContent = document.querySelector('#mainContent')
      const navCategory = document.querySelector('#navCategory')
      const banners = document.querySelectorAll('#productBanner div')
      const link = document.querySelector('#quickLink')
      const searchInput = document.querySelector('#searchContainer input[type="search"]')
      const searchButton = document.querySelector('#searchContainer button')


      let lastScrollY = window.scrollY

      if (navFloating) {
        window.addEventListener('scroll', () => {
          const currentScrollY = window.scrollY;

          if (currentScrollY < lastScrollY && currentScrollY > 48) {
            navFloating.classList.remove('-translate-y-full');
          } else {
            navFloating.classList.add('-translate-y-full');
          }

          lastScrollY = currentScrollY;
        })
      }

      function openSearch(fromNav) {
        const navHeight = fromNav.offsetHeight
        searchContainer.style.top = navHeight + 'px'

        searchContainer.classList.remove('opacity-0', '-translate-y-5', 'max-h-0')
        searchContainer.classList.add('opacity-100', 'translate-y-0', 'max-h-[500px]')

        mainContent.classList.add('blur-sm')
      }

      if (searchToggleList.length > 0 && searchContainer) {
        searchToggleList.forEach(toggle => {
          toggle.addEventListener('click', () => {
            const parentNav = toggle.closest('nav')
            openSearch(parentNav)
          })
        })

        searchContainer.addEventListener('mouseleave', () => {
          searchContainer.classList.remove('opacity-100', 'translate-y-0', 'max-h-[500px]')
          searchContainer.classList.add('opacity-0', '-translate-y-5', 'max-h-0')
          mainContent.classList.remove('blur-sm');
          searchInput.value = ''
        })
      }

      // Search functionality
      if (searchInput) {
        // Handle search button click and Enter key
        function handleSearch() {
          const searchTerm = searchInput.value.trim()
          window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`
        }

        if (searchButton) {
          searchButton.addEventListener('click', handleSearch)
        }

        // Handle Enter key press
        searchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch()
          }
        })
      }

      if (navCategory && banners.length > 0) {
        navCategory.addEventListener('click', e => {
          if (e.target.tagName === 'LI') {
            const category = e.target.dataset.category

            if (window.location.pathname.includes('search.html')) {
              window.location.href = `index.html#${category}`
              return
            }

            banners.forEach(div => {
              div.classList.toggle('hidden', div.dataset.category !== category)
            })
            renderProducts(category)
          }
        })
      }

      if (link && banners.length > 0) {
        link.addEventListener('click', e => {
          if (e.target.closest('a')) {
            e.preventDefault()
            searchContainer.classList.remove('opacity-100', 'translate-y-0', 'max-h-[500px]')
            searchContainer.classList.add('opacity-0', '-translate-y-5', 'max-h-0')
            mainContent.classList.remove('blur-sm');
            searchInput.value = ''

            const category = e.target.closest('a').dataset.category

            if (window.location.pathname.includes('search.html')) {
              window.location.href = `index.html#${category}`
              return
            }

            banners.forEach(div => {
              div.classList.toggle('hidden', div.dataset.category !== category)
            })
            renderProducts(category)
          }
        })
      }

      // Check for category in URL hash
      const hashCategory = window.location.hash.slice(1)
      if (hashCategory && banners.length > 0) {
        banners.forEach(div => {
          div.classList.toggle('hidden', div.dataset.category !== hashCategory)
        })
        renderProducts(hashCategory)
      } else {
        const activeBanner = document.querySelector('#productBanner > div:not(.hidden)')
        if (activeBanner) {
          const activeCategory = activeBanner.dataset.category.toLowerCase()
          renderProducts(activeCategory)
        }
      }
    }
  })
})();

// render product
const renderProducts = (category, filteredProducts = null) => {
  if (filteredProducts) {
    renderProductList(filteredProducts)
    return
  }

  fetch('api/products')
    .then(res => res.json())
    .then(products => {
      if (category) {
        products = products.filter(product =>
          product.product_category.toLowerCase() === category.toLowerCase()
        )
      }
      renderProductList(products)
    });
};

// Render product list
function renderProductList(products) {
  const container = document.querySelector('#productList')
  container.innerHTML = ''

  if (products.length === 0) {
    container.innerHTML = `
      <div class="w-full text-center py-8">
        <h2 class="text-2xl text-gray-700">No products found</h2>
      </div>
    `
    return
  }

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

  quantityControls()
  addToCart(products)
}

// quantity control 
function quantityControls() {
  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', e => {
      const container = e.target.closest('div')
      const quantitySpan = container.querySelector('.quantity')
      let quantity = parseInt(quantitySpan.innerHTML)
      if (quantity > 1) {
        quantitySpan.innerHTML = quantity - 1
      }
    })
  })
  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', e => {
      const container = e.target.closest('div')
      const quantitySpan = container.querySelector('.quantity')
      const card = e.target.closest('div.flex-col')
      const stock = card.querySelector('.stock')
      const maxStock = stock ? parseInt(stock.dataset.stock) : 1
      let quantity = parseInt(quantitySpan.innerHTML)
      if (quantity < maxStock) {
        quantitySpan.innerHTML = quantity + 1
      }
    })
  })
};

// add to cart
function addToCart(productList) {
  document.querySelectorAll('.addToCart').forEach(button => {
    button.addEventListener('click', e => {
      const btn = e.currentTarget

      btn.innerHTML = 'ADDING...'
      btn.classList.add('opacity-50')
      btn.disabled = true

      const id = parseInt(e.target.dataset.id)
      const product = productList.find(p => p.product_id === id)
      const card = e.target.closest('.productCard')
      const quantity = parseInt(card.querySelector('.quantity').innerHTML)

      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.product_stock);
      } else {
        cart.push({
          id: product.product_id,
          name: product.product_name,
          price: product.product_price,
          stock: product.product_stock,
          src: product.product_src,
          quantity: quantity
        })
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      localStorage.setItem('cartTime', Date.now())
      updateCartBadge()

      setTimeout(() => {
        btn.innerText = 'ADD TO CART'
        btn.classList.remove('opacity-50', 'cursor-not-allowed')
        btn.disabled = false
      }, 500)
    })
  })
}

// update cart badge for all pages
function updateCartBadge() {
  const badge = document.querySelectorAll('.cartCount')
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let count = cart.reduce((sum, item) => sum + item.quantity, 0)
  badge.forEach(badge => {
    badge.innerHTML = count
    if (count > 0) {
      badge.classList.remove('scale-0', 'opacity-0')
    } else {
      badge.classList.add('scale-0', 'opacity-0')
    }
  })
}

// Initialize cart badge on all pages
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge()
});
