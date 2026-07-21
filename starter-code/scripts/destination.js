// =============================================
// DOM Elements
// =============================================
const picture = document.querySelector('picture');             // контейнер <picture>
const img = picture?.querySelector('img');                     // <img> внутри
const webpSource = picture?.querySelector('source[type="image/webp"]'); // для webp

const planetName = document.querySelector('.destination-info h2');
const planetDescription = document.querySelector('.destination-info p');
const planetDistance = document.querySelector('.destination-meta div:first-child p');
const planetTravel = document.querySelector('.destination-meta div:last-child p');
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

  // Элементы, которые будут анимироваться
  const elementsToFade = [
    planetName,
    planetDescription,
    planetDistance,
    planetTravel,
    picture
  ];

  // 1. Добавляем fade-out всем элементам
  elementsToFade.forEach(el => el?.classList.add('fade-out'));

  // 2. Ждём окончания анимации (0.3s)
  setTimeout(() => {
    // 3. Обновляем контент
    planetName.textContent = planet.name;
    planetDescription.textContent = planet.description;
    planetDistance.textContent = planet.distance;
    planetTravel.textContent = planet.travel;

    // Обновляем изображение
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
    });

    // 4. Убираем fade-out (контент плавно появляется)
    elementsToFade.forEach(el => el?.classList.remove('fade-out'));

    currentIndex = index;
  }, 300);
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