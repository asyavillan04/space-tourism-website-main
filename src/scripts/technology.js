// =============================================
// DOM Elements
// =============================================
const img = document.querySelector('.grid-container--technology img'); // <img> inside main

// Technology info elements
let techTerm;
let techName;
let techDescription;

const article = document.querySelector('.technology-info');

const tabList = document.querySelector('[role="tablist"]');
const tabs = tabList.querySelectorAll('[role="tab"]');

// =============================================
// State
// =============================================
let technology = [];
let currentIndex = 0;
let tabFocus = 0;
let initialLoad = true;

// =============================================
// Fetch JSON data
// =============================================
async function loadData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Could not load data.json:', error);
    return null;
  }
}

// =============================================
// Re‑query elements inside the article
// =============================================
function updateArticleElements() {
  techTerm = document.querySelector('.technology-info h2');
  techName = document.querySelector('.technology-info .fs-700');
  techDescription = document.querySelector('.technology-info > p:last-of-type');
}

// =============================================
// Update image source based on screen width
// =============================================
function updateImage(tech) {
  if (!img || !tech) return;
  const isMobile = window.innerWidth < 768;
  img.src = isMobile ? tech.images.landscape : tech.images.portrait;
  img.alt = tech.name;
}

// =============================================
// Display a technology by index
// =============================================
function showTechnology(index) {
  const tech = technology[index];
  if (!tech) return;

  const elementsToFade = [techTerm, techName, techDescription, img];

  // First load – no animation
  if (initialLoad) {
    techTerm.textContent = 'The terminology...';
    techName.textContent = tech.name;
    techDescription.textContent = tech.description;
    updateImage(tech);

    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.setAttribute('aria-selected', isActive);
      tab.classList.toggle('active', isActive);
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    currentIndex = index;
    tabFocus = index;
    initialLoad = false;
    return;
  }

  // Normal crossfade
  elementsToFade.forEach(el => el?.classList.add('fade-out'));

  setTimeout(() => {
    techTerm.textContent = 'The terminology...';
    techName.textContent = tech.name;
    techDescription.textContent = tech.description;
    updateImage(tech);

    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.setAttribute('aria-selected', isActive);
      tab.classList.toggle('active', isActive);
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    elementsToFade.forEach(el => el?.classList.remove('fade-out'));

    currentIndex = index;
    tabFocus = index;
  }, 300);
}

// =============================================
// Keyboard navigation (left / right arrows)
// =============================================
function changeTabFocus(e) {
  const keyLeft = 37;
  const keyRight = 39;

  if (e.keyCode === keyLeft || e.keyCode === keyRight) {
    tabs[tabFocus].setAttribute('tabindex', '-1');

    if (e.keyCode === keyRight) {
      tabFocus++;
      if (tabFocus >= tabs.length) tabFocus = 0;
    } else if (e.keyCode === keyLeft) {
      tabFocus--;
      if (tabFocus < 0) tabFocus = tabs.length - 1;
    }

    tabs[tabFocus].setAttribute('tabindex', '0');
    tabs[tabFocus].focus();
    showTechnology(tabFocus);
  }
}

// =============================================
// Initialization
// =============================================
async function init() {
  const data = await loadData();
  if (!data || !data.technology) return;

  technology = data.technology;

  updateArticleElements();

  // mouse click handlers
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => showTechnology(i));
  });

  // keyboard handler
  tabList.addEventListener('keydown', changeTabFocus);

  // auto‑switch when tab receives focus (e.g. via Tab key)
  tabs.forEach((tab, i) => {
    tab.addEventListener('focus', () => {
      if (currentIndex !== i) showTechnology(i);
    });
  });

  // update image on window resize
  window.addEventListener('resize', () => {
    const currentTech = technology[currentIndex];
    if (currentTech) updateImage(currentTech);
  });

  // show first technology
  showTechnology(0);
}

init();