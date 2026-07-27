// =============================================
// DOM Elements (picture is outside article)
// =============================================
const picture = document.querySelector('picture');
let img = picture?.querySelector('img');
let webpSource = picture?.querySelector('source[type="image/webp"]');

// Elements inside article – will be re-queried after height measurement
let planetName;
let planetDescription;
let planetDistance;
let planetTravel;

const article = document.querySelector('.destination-info');

const tabList = document.querySelector('[role="tablist"]');
const tabs = tabList.querySelectorAll('[role="tab"]');

// =============================================
// State
// =============================================
let destinations = [];
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
  planetName = document.querySelector('.destination-info h2');
  planetDescription = document.querySelector('.destination-info p');
  planetDistance = document.querySelector('.destination-meta div:first-child p');
  planetTravel = document.querySelector('.destination-meta div:last-child p');
}

// =============================================
// Set min-height of the article (prevents layout shift)
// =============================================
function setArticleMinHeight() {
  if (!article || !destinations.length) return;

  const currentHTML = article.innerHTML;
  let maxHeight = 0;

  destinations.forEach(planet => {
    article.innerHTML = `
      <h2 class="fs-800 uppercase ff-serif">${planet.name}</h2>
      <p>${planet.description}</p>
      <div class="destination-meta flex">
        <div>
          <h3 class="text-accent fs-200 uppercase">Avg. distance</h3>
          <p class="ff-serif uppercase">${planet.distance}</p>
        </div>
        <div>
          <h3 class="text-accent fs-200 uppercase">Est. travel time</h3>
          <p class="ff-serif uppercase">${planet.travel}</p>
        </div>
      </div>
    `;

    const height = article.offsetHeight;
    if (height > maxHeight) maxHeight = height;
  });

  article.innerHTML = currentHTML;
  article.style.minHeight = maxHeight + 'px';
  updateArticleElements();
}

// =============================================
// Display a destination
// =============================================
function showDestination(index) {
  const planet = destinations[index];
  if (!planet) return;

  const elementsToFade = [
    planetName,
    planetDescription,
    planetDistance,
    planetTravel,
    picture
  ];

  // First load – no animation, just fill content
  if (initialLoad) {
    planetName.textContent = planet.name;
    planetDescription.textContent = planet.description;
    planetDistance.textContent = planet.distance;
    planetTravel.textContent = planet.travel;

    if (webpSource) webpSource.srcset = planet.images.webp;
    if (img) {
      img.src = planet.images.png;
      img.alt = planet.name;
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

  // Normal crossfade (subsequent tab switches)
  elementsToFade.forEach(el => el?.classList.add('fade-out'));

  setTimeout(() => {
    planetName.textContent = planet.name;
    planetDescription.textContent = planet.description;
    planetDistance.textContent = planet.distance;
    planetTravel.textContent = planet.travel;

    if (webpSource) webpSource.srcset = planet.images.webp;
    if (img) {
      img.src = planet.images.png;
      img.alt = planet.name;
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
    showDestination(tabFocus);
  }
}

// =============================================
// Initialization
// =============================================
async function init() {
  const data = await loadData();
  if (!data || !data.destinations) return;

  destinations = data.destinations;

  updateArticleElements();
  setArticleMinHeight();

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => showDestination(i));
  });

  tabList.addEventListener('keydown', changeTabFocus);

  tabs.forEach((tab, i) => {
    tab.addEventListener('focus', () => {
      if (currentIndex !== i) showDestination(i);
    });
  });

  window.addEventListener('resize', () => {
    setArticleMinHeight();
  });

  // Show first planet (Moon)
  showDestination(0);
}

init();