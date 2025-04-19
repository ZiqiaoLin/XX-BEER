
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartTime = 'cartTime';

(function(){
  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge()

    if (document.body.classList.contains('cartPage')) {
      renderCartPage()
    } else {
      const banners = document.querySelectorAll('#productBanner > div')
      let activeCategory = 'beer'

      banners.forEach(b => {
        if (!b.classList.contains('hidden')) {
          activeCategory = b.dataset.category.toLowerCase()
        }
      })

      renderProducts(activeCategory)
    }
  })
})();

// search bar
(function(){
  const navFloating = document.querySelector('#navFloating')
  const searchToggleList = document.querySelectorAll('#searchToggle')
  const searchContainer = document.querySelector('#searchContainer')
  const mainContent = document.querySelector('#mainContent')

  let lastScrollY = window.scrollY

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < lastScrollY && currentScrollY > 48) {
      navFloating.classList.remove('-translate-y-full');
    } else {
      navFloating.classList.add('-translate-y-full');
    }

    lastScrollY = currentScrollY;
  })

  function openSearch(fromNav) {
    const navHeight = fromNav.offsetHeight
    searchContainer.style.top = navHeight + 'px'

    searchContainer.classList.remove('opacity-0', '-translate-y-5', 'max-h-0')
    searchContainer.classList.add('opacity-100', 'translate-y-0', 'max-h-[500px]')

    mainContent.classList.add('blur-sm')
  }

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
  })
  
})();

// category nav
(function () {
  const navCategory = document.querySelector('#navCategory')
  const banners = document.querySelectorAll('#productBanner div')

  navCategory.addEventListener('click', e => {
    if (e.target.tagName === 'LI') {
      const category = e.target.dataset.category

      banners.forEach(div => {
        div.classList.toggle('hidden', div.dataset.category !== category)
      })
      renderProducts(category)
    }
  })
})();

// search link 

(function(){
  const link = document.querySelector('#quickLink')
  const banners = document.querySelectorAll('#productBanner div')
  const searchContainer = document.querySelector('#searchContainer')
  link.addEventListener('click', e => {
    if (e.target.closest('a')) {
      e.preventDefault()
      searchContainer.classList.remove('opacity-100', 'translate-y-0', 'max-h-[500px]')
      searchContainer.classList.add('opacity-0', '-translate-y-5', 'max-h-0')
      mainContent.classList.remove('blur-sm');

      const category = e.target.closest('a').dataset.category
      
      banners.forEach(div => {
        div.classList.toggle('hidden', div.dataset.category !== category)
      })
      renderProducts(category)
    }
  })
})();

// render product
const renderProducts = (category) => {
  fetch('/api/products')
    .then(res => res.json())
    .then(products => {
      const container = document.querySelector('#productList')
      container.innerHTML = ''
      products.forEach(product => {
        if (product.product_category.toLowerCase() === category.toLowerCase()) {
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
        }
      })

      quantityControls()
      addToCart(products)
    });
};

// render product by banner category
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const banners = document.querySelectorAll('#productBanner > div')
    let activeCategory = 'beer'

    banners.forEach(banner => {
      if (!banner.classList.contains('hidden')) {
        activeCategory = banner.dataset.category.toLowerCase()
      }
    })

    renderProducts(activeCategory);
  })

})();

// quantity control 
function quantityControls() {
  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', e => {
      const container = e.target.closest('div')
      const quantitySpan = container.querySelector('.quantity')
      let quantity = parseInt(quantitySpan.innerHTML)
      if (quantity > 1){
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

//save cart

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart))
  localStorage.setItem(cartTime, Date.now())
  updateCartBadge()
};

// check expire
(function checkCartExpire() {
  const savedAt = parseInt(localStorage.getItem(cartTime))
  if (savedAt && Date.now() - savedAt > 3 * 60 * 60 * 1000) {
    cart = [];
    localStorage.removeItem('cart')
    localStorage.removeItem(cartTime)
  }
})();

// update cart badge 
function updateCartBadge() {
  const badge = document.querySelectorAll('.cartCount')
  let count = cart.reduce((sum, item) => sum + item.quantity, 0)
  badge.forEach(badge => {
    badge.innerHTML = count
    if(count > 0) {
      badge.classList.remove('scale-0', 'opacity-0')
    } else {
      badge.classList.add('scale-0', 'opacity-0')
    }
  }
  )
};

// add to card
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

      saveCart()

      setTimeout(() => {
        btn.innerText = 'ADD TO CART'
        btn.classList.remove('opacity-50', 'cursor-not-allowed')
        btn.disabled = false
      },500)
    })
  })
};

// render cart product

function renderCartPage() {
  const cartList = document.querySelector('#cartList')
  const totalPrice = document.querySelector('#totalPrice')
  const emptyCart = document.querySelector('#emptyCart')
  const itemsCart = document.querySelector('#itemsCart')

  if (cart.length === 0) {
    emptyCart.classList.remove('hidden')
    itemsCart.classList.add('hidden')
    return
  }

  emptyCart.classList.add('hidden')
  itemsCart.classList.remove('hidden')
  cartList.innerHTML = ''
  let total = 0
  cart.forEach(item => {
    const subTotal = Number(item.price) * item.quantity
    total += subTotal
    cartList.innerHTML += `
      <div class="grid grid-cols-3 items-center w-full h-36 mb-4">
      <div class="flex items-center">
        <img src="${item.src}" class="h-24">
        <div class="flex flex-col justify-center ml-2.5">
          <h2 class="font-bold">${item.name}</h2>
          <p>$${Number(item.price).toFixed(2)}</p>
        </div>
      </div>

      <div class="flex items-center pl-16">
        <div class="flex justify-between items-center border border-black w-32 h-8 px-4">
          <button data-id="${item.id}" class="decrease font-extralight text-2xl cursor-pointer pt-0.5">-</button>
          <span class="quantity font-light">${item.quantity}</span>
          <button data-id="${item.id}" class="increase font-extralight text-2xl cursor-pointer pt-0.5">+</button>
        </div>
        <div data-id="${item.id}" class="remove font-[icomoon] text-[#98252d] ml-2 hover:text-gray-500 cursor-pointer">
          
        </div>
      </div>
      <div class="text-right font-bold">
        $${subTotal.toFixed(2)}
      </div>
    </div>
    `
  })
  totalPrice.innerHTML = `TOTAL: $${total.toFixed(2)} AUD`

  cartControls()

};

function cartControls(){
  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id)
      const item = cart.find(p => p.id === id)
      if (item && item.quantity > 1) {
        item.quantity -= 1
        saveCart()
        renderCartPage()
      }
    })
  })

  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id)
      const item = cart.find(p => p.id === id)
      if (item && item.quantity < item.stock) {
        item.quantity += 1
        saveCart()
        renderCartPage()
      }
    })
  })

  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id)
      cart = cart.filter(p => p.id !== id)
      saveCart()
      renderCartPage()
    })
  })

  const clearBtn = document.querySelector('#clearCart')
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart = []
      saveCart()
      renderCartPage()
    })
  }
};
