// =============================================
// DOM Elements
// =============================================
const picture = document.querySelector('picture');
const img = picture?.querySelector('img');
const webpSource = picture?.querySelector('source[type="image/webp"]');

const planetName = document.querySelector('.destination-info h2');
const planetDescription = document.querySelector('.destination-info p');
const planetDistance = document.querySelector('.destination-meta div:first-child p');
const planetTravel = document.querySelector('.destination-meta div:last-child p');

const tabList = document.querySelector('[role="tablist"]');
const tabs = tabList.querySelectorAll('[role="tab"]');

// =============================================
// State
// =============================================
let destinations = [];
let currentIndex = 0; 
let tabFocus = 0;   

// =============================================
// Fetch JSON data
// =============================================
async function loadData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Не удалось загрузить data.json:', error);
    return null;
  }
}

// =============================================
// Render a destination by index
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

    // Обновляем активный таб
    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.setAttribute('aria-selected', isActive);
      tab.classList.toggle('active', isActive);
      // Управляем tabindex для клавиатурной навигации
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    elementsToFade.forEach(el => el?.classList.remove('fade-out'));

    currentIndex = index;
    tabFocus = index;   // синхронизируем фокус с текущей вкладкой
  }, 300);
}

// =============================================
// Keyboard navigation
// =============================================
function changeTabFocus(e) {
  const keyLeft = 37;
  const keyRight = 39;

  if (e.keyCode === keyLeft || e.keyCode === keyRight) {
    tabs[tabFocus].setAttribute('tabindex', '-1');

    if (e.keyCode === keyRight) {
      tabFocus++;
      if (tabFocus >= tabs.length) {
        tabFocus = 0;
      }
    } else if (e.keyCode === keyLeft) {
      tabFocus--;
      if (tabFocus < 0) {
        tabFocus = tabs.length - 1;
      }
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


  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => showDestination(i));
  });

  tabList.addEventListener('keydown', changeTabFocus);

  showDestination(0);
}

init();