;(() => {
  const scoreButton = document.getElementById('score')
  if (!scoreButton) {
    return
  }
  const scoreDialog = document.getElementById('score-dialog')
  const scorearrow = document.getElementById('score-arrow')
  const scorecross = document.getElementById('score-cross')
  let isOpen = false
  scoreButton.addEventListener('click', () => {
    if (typeof scoreDialog.showModal !== 'function') {
      console.error(
        "L'API <dialog> n'est pas prise en charge par ce navigateur."
      )
      return
    }
    if (!isOpen) {
      scoreDialog.show()
      isOpen = true
      scorearrow.classList.add('hidden')
      scorecross.classList.remove('hidden')
      return
    }
    scoreDialog.close()
    isOpen = false
    scorecross.classList.add('hidden')
    scorearrow.classList.remove('hidden')
  })
})()
