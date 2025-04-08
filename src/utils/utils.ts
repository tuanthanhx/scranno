export function scrollToElement(elementId: string) {
  const targetElement = document.querySelector(`[data-id="${elementId}"]`) as HTMLElement | null;
  if (targetElement) {
    const header = document.querySelector('header') as HTMLElement | null;
    const headerHeight = header ? header.offsetHeight : 0;
    const targetRect = targetElement.getBoundingClientRect();
    let scrollPosition = window.scrollY + targetRect.top - headerHeight - 5;

    const elementType = targetElement.dataset.type;
    if (elementType === 'note') {
      scrollPosition -= 50;
    }

    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth',
    });
  }
}

export function selectNote(noteId: string) {
  const scrollContainer = document.querySelector('.sidebar-inner') as HTMLElement | null;
  const targetElement = document.querySelector(
    `[data-sidebar-item-id="${noteId}"]`,
  ) as HTMLElement | null;

  if (!targetElement || !scrollContainer) return;

  targetElement.classList.add('bg-yellow-100', 'transition-colors', 'duration-300');
  setTimeout(() => {
    targetElement.classList.remove('bg-yellow-100', 'transition-colors', 'duration-300');
  }, 1000);

  const containerRect = scrollContainer.getBoundingClientRect();
  const elementRect = targetElement.getBoundingClientRect();

  const elementTopRelative = elementRect.top - containerRect.top + scrollContainer.scrollTop;
  const elementBottomRelative = elementTopRelative + elementRect.height;

  const header = document.querySelector('header') as HTMLElement | null;
  const headerHeight = header ? header.offsetHeight : 0;

  const isInView =
    elementTopRelative >= scrollContainer.scrollTop &&
    elementBottomRelative <= scrollContainer.scrollTop + scrollContainer.clientHeight;

  if (!isInView) {
    scrollContainer.scrollTo({
      top: elementTopRelative - headerHeight - 10,
      behavior: 'smooth',
    });
  }
}
