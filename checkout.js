// checkout page floatung label
(function () {
  const input = document.querySelectorAll('form input')
  
  input.forEach(input => {
    const label = document.querySelector(`label[for="${input.id}"]`)
    if (input.value.trim() !== ''){
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

// check empty field
(function(){
  const form = document.querySelector('form')
  const inputs = document.querySelectorAll('input')

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
    const input = document.querySelectorAll('form input')
    input.forEach(input => {
      const div = input.closest('div')
      if(!input.value.trim()) {
        div.querySelector('.empty').classList.remove('hidden')
        input.classList.add('border-red-600')
        input.classList.remove('border-gray-500')
      } else {
        div.querySelector('.empty').classList.add('hidden')
        input.classList.remove('border-red-600')
        input.classList.add('border-gray-500')
      }
    })

  })
})();

