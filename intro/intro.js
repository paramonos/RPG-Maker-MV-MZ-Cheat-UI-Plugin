(function () {
  const root = document.documentElement
  root.classList.remove('no-script')
  root.classList.add('script')

  const prefersStillness = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function setUpStage () {
    const stage = document.querySelector('[data-stage]')
    const setOpen = isOpen => {
      stage.classList.toggle('is-open', isOpen)
      stage.setAttribute('aria-pressed', String(isOpen))
    }
    const toggle = () => setOpen(!stage.classList.contains('is-open'))

    stage.addEventListener('click', toggle)
    document.addEventListener('keydown', event => {
      const isPlainC = event.key.toLowerCase() === 'c' && !event.ctrlKey && !event.metaKey && !event.altKey
      if (isPlainC && !event.repeat) {
        toggle()
      }
    })
    if (!prefersStillness) {
      setOpen(false)
      window.setTimeout(() => setOpen(true), 900)
    }
  }

  function setUpFeatureBrowser () {
    const tabs = Array.from(document.querySelectorAll('[role="tab"]'))
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')))

    function select (index, shouldFocus) {
      tabs.forEach((tab, tabIndex) => {
        const isSelected = tabIndex === index
        tab.setAttribute('aria-selected', String(isSelected))
        tab.tabIndex = isSelected ? 0 : -1
        panels[tabIndex].hidden = !isSelected
      })
      if (shouldFocus) {
        tabs[index].focus()
      }
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index, false))
      tab.addEventListener('keydown', event => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
        if (step) {
          event.preventDefault()
          select((index + step + tabs.length) % tabs.length, true)
        }
      })
    })
    select(0, false)
  }

  function setUpShotSwitches () {
    document.querySelectorAll('.shots').forEach(group => {
      const main = group.parentElement.querySelector('.shot')
      const buttons = Array.from(group.querySelectorAll('button'))
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          main.src = button.dataset.shot
          buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)))
        })
      })
    })
  }

  setUpStage()
  setUpFeatureBrowser()
  setUpShotSwitches()
})()
