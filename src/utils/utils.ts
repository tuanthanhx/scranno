export function scrollToElement(elementId: string) {
  const targetElement = document.querySelector(`[data-id="${elementId}"]`) as HTMLElement | null
  if (targetElement) {
    const header = document.querySelector('header') as HTMLElement | null
    const headerHeight = header ? header.offsetHeight : 0
    const targetRect = targetElement.getBoundingClientRect()
    let scrollPosition = window.scrollY + targetRect.top - headerHeight - 5

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
