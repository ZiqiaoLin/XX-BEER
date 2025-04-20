let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartTime = 'cartTime';

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
    if (count > 0) {
      badge.classList.remove('scale-0', 'opacity-0')
    } else {
      badge.classList.add('scale-0', 'opacity-0')
    }
  })
}

// save cart
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart))
  localStorage.setItem(cartTime, Date.now())
  updateCartBadge()
}

// render cart page
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
}

// cart controls
function cartControls() {
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
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('cartPage')) {
    renderCartPage()
  }
}); 