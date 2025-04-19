
(function(){
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
    } else {
      message.innerHTML = `Insufficient stock: ${outOfStockProduct}. Please reorder.`
      let countdown = 5
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
