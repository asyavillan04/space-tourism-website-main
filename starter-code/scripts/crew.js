// =============================================
// DOM Elements
// =============================================
const picture = document.querySelector('picture');
let img = picture?.querySelector('img');
let webpSource = picture?.querySelector('source[type="image/webp"]');

let roleElement;
let nameElement;
let bioElement;

const article = document.querySelector('.crew-info');

const tabList = document.querySelector('[role="tablist"]');
const tabs = tabList.querySelectorAll('[role="tab"]');

// =============================================
// State
// =============================================
let crew = [];
let currentIndex = 0;
let tabFocus = 0;
let initialLoad = true;   // ← new flag

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
// Re-query elements inside the article
// =============================================
function updateArticleElements() {
  roleElement = document.querySelector('.crew-info h2');
  nameElement = document.querySelector('.crew-info .fs-700');
  bioElement = document.querySelector('.crew-info > p:last-of-type');
}

// =============================================
// Display a crew member
// =============================================
function showCrewMember(index) {
  const member = crew[index];
  if (!member) return;

  const elementsToFade = [roleElement, nameElement, bioElement, picture];

  // First load – no animation
  if (initialLoad) {
    roleElement.textContent = member.role;
    nameElement.textContent = member.name;
    bioElement.textContent = member.bio;

    if (webpSource) webpSource.srcset = member.images.webp;
    if (img) {
      img.src = member.images.png;
      img.alt = member.name;
    }

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
    roleElement.textContent = member.role;
    nameElement.textContent = member.name;
    bioElement.textContent = member.bio;

    if (webpSource) webpSource.srcset = member.images.webp;
    if (img) {
      img.src = member.images.png;
      img.alt = member.name;
    }

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
// Keyboard navigation (left/right arrows)
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
    showCrewMember(tabFocus);
  }
}

// =============================================
// Initialization
// =============================================
async function init() {
  const data = await loadData();
  if (!data || !data.crew) return;

  crew = data.crew;

  updateArticleElements();

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => showCrewMember(i));
  });

  tabList.addEventListener('keydown', changeTabFocus);

  tabs.forEach((tab, i) => {
    tab.addEventListener('focus', () => {
      if (currentIndex !== i) showCrewMember(i);
    });
  });

  // Show first crew member
  showCrewMember(0);
}

init();