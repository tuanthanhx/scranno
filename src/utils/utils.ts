export function scrollToElement(elementId: string) {
  const targetElement = document.querySelector(`[data-id="${elementId}"]`)
  if (targetElement) {
    const header = document.querySelector('header')
    const headerHeight = header ? header.offsetHeight : 0
    const targetRect = targetElement.getBoundingClientRect()
    let scrollPosition = window.scrollY + targetRect.top - headerHeight - 12

    const elementType = targetElement.dataset.type
    if (elementType === 'note') {
      scrollPosition -= 50
    }

    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth',
    })
  }
}
