
// search bar
(function(){
  const searchToggle = document.querySelector('#searchToggle')
  const searchContainer = document.querySelector('#searchContainer')
  searchToggle.addEventListener('click', () => {
    searchContainer.classList.remove('opacity-0', '-translate-y-5')
    searchContainer.classList.add('opacity-100', 'translate-y-0')
  })

  searchContainer.addEventListener('mouseleave', () => {
    searchContainer.classList.remove('opacity-100', 'translate-y-0')
    searchContainer.classList.add('opacity-0', '-translate-y-5')
  })
  
})();