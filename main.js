
// search bar
(function(){
  const searchToggle = document.querySelector('#searchToggle')
  const searchContainer = document.querySelector('#searchContainer')
  const mainContent = document.querySelector('#mainContent')
  searchToggle.addEventListener('click', () => {
    searchContainer.classList.remove('opacity-0', '-translate-y-5', 'max-h-0')
    searchContainer.classList.add('opacity-100', 'translate-y-0', 'max-h-[500px]')
    mainContent.classList.add('blur-sm');
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
    }
  })
})();