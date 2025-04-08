/*
 * This function scrolls the page to a specific element identified by its data-id.
 * It adjusts the scroll position based on the height of the header and the type of element.
 * If the element is a note, it adds an additional offset to the scroll position.
 *
 * @param {string} elementId - The data id of the element to scroll to.
 * @returns {void}
 */
export function scrollToElement(elementId: string): void {
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

/*
 * This function scrolls the sidebar to a specific note identified by its data-sidebar-item-id.
 * It highlights the note briefly and ensures it is in view.
 * If the note is not in view, it scrolls the sidebar to bring the note into view.
 *
 * @param {string} noteId - The data id of the note to scroll to.
 * @returns {void}
 */
export function selectNote(noteId: string): void {
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

/*
 * This function creates a delay for a specified interval (in milliseconds) before resolving the promise.
 * It can be configured to only execute in development mode.
 * If the interval is less than or equal to 0, it resolves immediately.
 *
 * @param {number} interval - The delay interval in milliseconds.
 * @param {boolean} isDevMode - If true, the delay will only execute in development mode.
 * @returns {Promise<boolean>} - A promise that resolves to true after the delay.
 *
 * If isDevMode is true and not in development mode, it resolves immediately.
 * If interval is less than or equal to 0, it resolves immediately.
 */
export function delay(interval: number, isDevMode = false): Promise<boolean> {
  if (isDevMode && process.env.NODE_ENV !== 'development') {
    return Promise.resolve(true);
  }
  if (interval <= 0) {
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, interval);
  });
}
