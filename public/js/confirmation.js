(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const name = urlParams.get('name')
    const email = urlParams.get('email')
    const outOfStockProduct = urlParams.get('product')

    const message = document.querySelector('#message')
    const subMessage = document.querySelector('#subMessage')

    if (success === '1') {
      message.innerHTML = `Thank you, ${name}. Your order has been placed successfully.`
      subMessage.innerHTML = `A confirmation email has been sent to ${email}.`

      const cart = JSON.parse(localStorage.getItem('cartBackup')) || []
      const info = JSON.parse(localStorage.getItem('userInfo')) || {}

      const productList = document.querySelector('.productList')
      const totalEl = document.querySelector('#totalPrice')
      const contactEl = document.querySelector('ul')

      let total = 0
      productList.innerHTML = ''

      cart.forEach(item => {
        const subTotal = Number(item.price) * item.quantity
        total += subTotal

        productList.innerHTML += `
        <div class="grid grid-cols-3 items-center w-full h-30 mb-4">
          <div class="flex items-center">
            <img src="${item.src}" class="h-24">
            <div class="flex flex-col justify-center ml-2.5">
              <h2 class="font-semibold text-xs pb-3">${item.name}</h2>
              <p class="font-normal text-xs">$${Number(item.price).toFixed(2)}</p>
            </div>
          </div>
          <div class="flex justify-center items-center h-8">
            <span class="quantity font-light text-xs">${item.quantity}</span>
          </div>
          <div class="text-right font-light text-xs">
            $${Number(subTotal).toFixed(2)}
          </div>
        </div>
        `
      })

      totalEl.innerHTML = `TOTAL: $${total.toFixed(2)} AUD`

      contactEl.innerHTML = `
        <li>Name: ${info.name}</li>
        <li>Email: ${info.email}</li>
        <li>Phone: ${info.phone}</li>
        <li>Address: ${info.street}, ${info.city}  ${info.state} ${info.postcode}</li>
      `
      // Update database stock
      fetch('api/update-stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart)
      }).then(res => res.json())
        .then(data => console.log('Stock updated:', data))
        .catch(err => console.error('Error updating stock:', err))

      localStorage.removeItem('cartBackup')
      localStorage.removeItem('userInfo')

    } else {
      message.innerHTML = `Insufficient stock: ${outOfStockProduct}. Please reorder.`
      let countdown = 5;
      subMessage.innerHTML = `Redirecting to your cart in ${countdown} seconds...`

      const timer = setInterval(() => {
        countdown--
        subMessage.innerHTML = `Redirecting to your cart in ${countdown} seconds...`
        if (countdown === 0) {
          clearInterval(timer)
          window.location.href = 'cart.html'
        }
      }, 1000)
    }
  })
})();