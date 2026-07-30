const copyStatus = document.querySelector('#copy-status');

for (const button of document.querySelectorAll('.copy-button')) {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy ?? '';
    const previous = button.textContent;

    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied';
      copyStatus.textContent = 'Command copied to the clipboard.';
    } catch {
      copyStatus.textContent = 'Copy was blocked. Select the command and copy it manually.';
    }

    window.setTimeout(() => {
      button.textContent = previous;
    }, 1800);
  });
}

const tabs = [...document.querySelectorAll('[role="tab"]')];

function selectTab(selected) {
  for (const tab of tabs) {
    const active = tab === selected;
    const panel = document.querySelector(`#${tab.getAttribute('aria-controls')}`);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    panel.hidden = !active;
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (event) => {
    const previous = (index - 1 + tabs.length) % tabs.length;
    const next = (index + 1) % tabs.length;
    let target;

    if (event.key === 'ArrowLeft') target = tabs[previous];
    if (event.key === 'ArrowRight') target = tabs[next];
    if (event.key === 'Home') target = tabs[0];
    if (event.key === 'End') target = tabs[tabs.length - 1];
    if (!target) return;

    event.preventDefault();
    selectTab(target);
    target.focus();
  });
});

const screen = document.querySelector('[data-screen]');
const stage = document.querySelector('[data-stage]');
const specimen = document.querySelector('[data-specimen]');
const viewportButtons = [...document.querySelectorAll('[data-viewport]')];
let previewWidth = 1440;

const specimens = {
  375: {
    src: 'benchmarks/results/06-redesign-before/375.png',
    width: 749,
    alt: 'Phone render of the deliberately generic ShiftFlow control page, cropped where its layout overflows the viewport',
  },
  768: {
    src: 'benchmarks/results/06-redesign-before/768.png',
    width: 768,
    alt: 'Tablet render of the deliberately generic ShiftFlow control page',
  },
  1440: {
    src: 'benchmarks/results/06-redesign-before/1440.png',
    width: 1440,
    alt: 'Desktop render of the deliberately generic ShiftFlow control page',
  },
};

function fitPreview() {
  if (!screen || !stage) return;
  const available = screen.clientWidth;
  const scale = Math.min(1, available / previewWidth);
  const renderedWidth = previewWidth * scale;

  stage.style.width = `${previewWidth}px`;
  stage.style.left = `${Math.max(0, (available - renderedWidth) / 2)}px`;
  stage.style.transform = `scale(${scale})`;
}

function selectViewport(width) {
  previewWidth = width;
  const nextSpecimen = specimens[previewWidth];
  specimen.src = nextSpecimen.src;
  specimen.alt = nextSpecimen.alt;
  specimen.style.width = `${nextSpecimen.width}px`;
  for (const candidate of viewportButtons) {
    candidate.setAttribute('aria-pressed', String(Number(candidate.dataset.viewport) === width));
  }
  fitPreview();
}

for (const button of viewportButtons) {
  button.addEventListener('click', () => {
    selectViewport(Number(button.dataset.viewport));
  });
}

if ('ResizeObserver' in window && screen) {
  new ResizeObserver(fitPreview).observe(screen);
} else {
  window.addEventListener('resize', fitPreview);
}

selectViewport(window.innerWidth < 520 ? 375 : window.innerWidth < 1120 ? 768 : 1440);
