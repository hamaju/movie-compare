const createAutoComplete = ({
  root,
  renderResult,
  onResultSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
  <input class="input" placeholder="Search" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
  `

  const input = root.querySelector('input')
  const dropdown = root.querySelector('.dropdown')
  const resultsWrapper = root.querySelector('.results')

  const onInput = async (event) => {
    const items = await fetchData(event.target.value)

    if (!items.length) {
      dropdown.classList.remove('is-active')
      return
    }

    resultsWrapper.innerHTML = ''
    dropdown.classList.add('is-active')

    for (let item of items) {
      const result = document.createElement('a')

      result.classList.add('dropdown-item')
      result.innerHTML = renderResult(item)
      result.addEventListener('click', () => {
        dropdown.classList.remove('is-active')
        input.value = inputValue(item)
        onResultSelect(item)
      })

      resultsWrapper.appendChild(result)
    }
  }

  input.addEventListener('input', debounce(onInput, 500))
  document.addEventListener('click', (event) => {
    // if click doesn't occur inside autocomplete class
    if (!root.contains(event.target)) {
      dropdown.classList.remove('is-active')
    }
  })
}

const debounce = (func, delay = 1000) => {
  let timeoutId
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args)
    }, delay)
  }
}
