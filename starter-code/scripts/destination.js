// =============================================
// DOM Elements
// =============================================
const picture = document.querySelector('picture');             // контейнер <picture>
const img = picture?.querySelector('img');                     // <img> внутри
const webpSource = picture?.querySelector('source[type="image/webp"]'); // для webp

const planetName = document.querySelector('.destination-info h2');
const planetDescription = document.querySelector('.destination-info p');
const planetDistance = document.querySelector('.destination-meta p:first-of-type');
const planetTravel = document.querySelector('.destination-meta p:last-of-type');
const tabs = document.querySelectorAll('.tab-list button');


// =============================================
// State
// =============================================
let destinations = [];
let currentIndex = 0;

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

  // Text data
  planetName.textContent = planet.name;
  planetDescription.textContent = planet.description;
  planetDistance.textContent = planet.distance;
  planetTravel.textContent = planet.travel;

  // Picture
  if (webpSource) webpSource.srcset = planet.images.webp;
  if (img) {
    img.src = planet.images.png;
    img.alt = planet.name;
  }

  tabs.forEach((tab, i) => {
    const isActive = i === index;
    tab.setAttribute('aria-selected', isActive);
    tab.classList.toggle('active', isActive);
  });

  currentIndex = index;
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

  showDestination(0);
}

init();