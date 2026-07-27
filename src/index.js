document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.primary-navigation');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isVisible = nav.getAttribute('data-visible') === 'true';
      nav.setAttribute('data-visible', !isVisible);
      navToggle.setAttribute('aria-expanded', !isVisible);
    });
  }

  // Smooth page transitions
  const main = document.querySelector('main');
  if (!main) return;

  // Initial fade‑in
  main.classList.add('fade-out');
  requestAnimationFrame(() => {
    main.classList.remove('fade-out');
  });

  // Handle all internal navigation links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const target = link.getAttribute('href');
    if (!target || target.startsWith('#') || target.startsWith('javascript')) return;

    // Only process internal pages
    if (target.endsWith('.html') || target === '/' || target === '') {
      e.preventDefault();
      document.body.classList.add('page-transitioning');
      main.classList.add('fade-out');

      setTimeout(() => {
        window.location.href = target;
      }, 300);
    }
  });
});