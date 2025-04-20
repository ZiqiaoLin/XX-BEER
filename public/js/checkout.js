// checkout page floatung label
(function () {
  const input = document.querySelectorAll('form input')

  input.forEach(input => {
    const label = document.querySelector(`label[for="${input.id}"]`)
    if (input.value.trim() !== '') {
      label.classList.add('top-1', 'text-xs')
      label.classList.remove('top-3.5', 'text-sm')
    }
    input.addEventListener('focus', () => {
      label.classList.add('top-1', 'text-xs')
      label.classList.remove('top-3.5', 'text-sm')
    })
    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        label.classList.remove('top-1', 'text-xs')
        label.classList.add('top-3.5', 'text-sm')
      }
    })
  })
})();

//check valid information
function checkVaild(info, re) {
  const input = document.querySelector(`#${info}`)
  input.addEventListener('blur', () => {
    if (!re.test(input.value) && input.value.trim() !== '') {
      document.querySelector(`.${info} .validP`).classList.remove('hidden')
      input.classList.add('border-red-600')
      input.classList.remove('border-gray-500')
    } else {
      document.querySelector(`.${info} .validP`).classList.add('hidden')
      input.classList.add('border-gray-500')
      input.classList.remove('border-red-600')
    }
  })
}
checkVaild('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
checkVaild('phone', /^(\+61|0)4\d{8}$/)
checkVaild('name', /^[a-zA-Z\s'-]{2,50}$/)
checkVaild('postcode', /^\d{4}$/);

// check submit valid
(function () {
  const form = document.querySelector('form')
  const inputs = document.querySelectorAll('input')
  const rules = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(\+61|0)4\d{8}$/,
    name: /^[a-zA-Z\s'-]{2,50}$/,
    postcode: /^\d{4}$/
  }


  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const div = input.closest('div')
      if (input.value.trim()) {
        div.querySelector('.empty').classList.add('hidden')
        input.classList.remove('border-red-600')
        input.classList.add('border-gray-500')
      }
    })
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    let isValid = true

    inputs.forEach(input => {
      const div = input.closest('div')
      const value = input.value.trim()
      const id = input.id
      const emptyP = div.querySelector('.empty')
      const validP = div.querySelector('.validP')

      emptyP?.classList.add('hidden')
      validP?.classList.add('hidden')
      input.classList.remove('border-red-600')
      input.classList.add('border-gray-500')

      // check empty value
      if (!value) {
        emptyP?.classList.remove('hidden')
        input.classList.add('border-red-600')
        input.classList.remove('border-gray-500')
        isValid = false
        return
      }
      // check valid input
      if (rules[id] && !rules[id].test(value)) {
        validP?.classList.remove('hidden')
        input.classList.add('border-red-600')
        input.classList.remove('border-gray-500')
        isValid = false
      }
    })
    if (isValid) {
      const userData = {
        name: document.querySelector('#name').value.trim(),
        email: document.querySelector('#email').value.trim()
      }
      checkStock(userData)
    }
  })
})();

// check inventory 
let cart = JSON.parse(localStorage.getItem('cart')) || []

function checkStock(userData) {
  fetch('api/products')
    .then(res => res.json())
    .then(products => {
      let allAvailable = true;
      const unavailableItems = [];

      for (let item of cart) {
        const product = products.find(p => p.product_id === item.id);
        if (!product || product.product_stock < item.quantity) {
          allAvailable = false;
          unavailableItems.push(item.name)
        }
      }

      if (allAvailable) {
        // Save cart backup and user info before clearing cart
        localStorage.setItem('cartBackup', localStorage.getItem('cart'))

        // Save complete user info
        const userInfo = {
          name: document.querySelector('#name').value.trim(),
          email: document.querySelector('#email').value.trim(),
          phone: document.querySelector('#phone').value.trim(),
          street: document.querySelector('#street').value.trim(),
          city: document.querySelector('#city').value.trim(),
          state: document.querySelector('#state').value.trim(),
          postcode: document.querySelector('#postcode').value.trim()
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo))

        // Clear original cart
        localStorage.removeItem('cart')
        localStorage.removeItem('cartTime')

        const name = userData.name
        const email = userData.email

        window.location.href = `confirmation.html?success=1&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
      } else {
        window.location.href = `confirmation.html?success=0`
      }
    });
}

