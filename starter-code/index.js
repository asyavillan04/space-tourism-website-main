document.addEventListener('DOMContentLoaded', () => {
  // --- Мобильное меню ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.primary-navigation');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isVisible = nav.getAttribute('data-visible') === 'true';
      nav.setAttribute('data-visible', !isVisible);
      navToggle.setAttribute('aria-expanded', !isVisible);
    });
  }

  const main = document.querySelector('main');
  if (!main) return;

  document.addEventListener('click', (e) => {
    const link = e.target.closest('.primary-navigation a');
    if (!link) return;

    e.preventDefault();
    const target = link.getAttribute('href');
    if (!target) return;

    document.body.classList.add('page-transitioning');
    main.classList.add('fade-out');

    setTimeout(() => {
      window.location.href = target;
    }, 300); 
  });
});