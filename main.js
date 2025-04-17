

// search bar
(function(){
  const navFloating = document.querySelector('#navFloating')
  const navStatic = document.querySelector('#navStatic')
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
          const inStock = product.product_stock > 0;
          const stock = product.product_stock;

          container.innerHTML += `
            <div class="flex flex-col w-1/2 sm:w-1/3 border-r-[0.5px] border-r-gray-400 border-b-[0.5px] border-b-gray-400">
              <div class="group overflow-hidden">
                <img src="${product.product_src}" alt="${product.product_name}" class="w-full h-auto transform transition-transform duration-[500ms] group-hover:scale-120 group-hover:duration-[1000ms]">
              </div>
              <h3 class="font-extrabold text-2xl text-center">${product.product_name}</h3>
              <div class="flex justify-around py-1.5 px-1.5">
                <span class="flex items-center justify-center w-16 h-6 bg-[#98252d] text-stone-50 text-sm font-bold select-none">$${product.product_price}</span>
                <span class="stock flex items-center justify-center h-6 text-sm font-medium select-none" data-stock="${product.product_stock}">${inStock ? 'IN STOCK' : 'OUT OF STOCK'}</span>
              </div>

              ${inStock ? `
                <div class="flex justify-between border border-black w-32 h-8 px-4 leading-[36px] my-3 mx-auto select-none">
                  <button class="decrease font-extralight text-2xl cursor-pointer">-</button>
                  <span class="quantity font-light">1</span>
                  <button class="increase font-extralight text-2xl cursor-pointer">+</button>
                </div>
                <button class="addToCart border border-[#98252d] w-44 h-8 mb-8 mx-auto font-bold text-[#98252d] hover:bg-[#98252d] hover:text-stone-50  cursor-pointer select-none">
                  ADD TO CART
                </button>
              ` : `
                <button class="border border-gray-400 w-44 h-8 mx-auto mb-8 font-bold text-gray-400 cursor-not-allowed line-through select-none">
                  OUT OF ORDER
                </button>
              `}
            </div>
          `;
        }
      });

      quantityControls();
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
}