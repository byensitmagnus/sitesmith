const status = document.querySelector('#copy-status');

for (const button of document.querySelectorAll('.copy-button')) {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy ?? '';
    const previous = button.textContent;

    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied';
      status.textContent = `${button.closest('article').querySelector('h3').textContent} command copied.`;
    } catch {
      status.textContent = 'Copy was blocked. Select the command and copy it manually.';
    }

    window.setTimeout(() => {
      button.textContent = previous;
    }, 1800);
  });
}
