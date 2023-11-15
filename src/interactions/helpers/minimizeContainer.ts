export const minimizeContainer = (container: HTMLElement, position = 'corner') => {
  container.classList.toggle(`${position}--minimized`);
};

export default minimizeContainer;
