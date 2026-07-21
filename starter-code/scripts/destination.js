// =============================================
// DOM Elements
// =============================================
const planetImage = document.querySelector('.grid-container--destination picture');
const planetImg = planetImage?.querySelector('img');
const planetName = document.querySelector('.destination-info h2');
const planetDescription = document.querySelector('.destination-info p');
const planetDistance = document.querySelector('.destination-meta p:first-child');
const planetTravel = document.querySelector('.destination-meta p:last-child');
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
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Could not load data:', error);
    return null;
  }
}

// =============================================
// Render a destination by index
// =============================================
function showDestination(index) {
  const planet = destinations[index];
  if (!planet) return;

  // Update text content
  planetName.textContent = planet.name;
  planetDescription.textContent = planet.description;
  planetDistance.textContent = planet.distance;
  planetTravel.textContent = planet.travel;

  // Update image (webp + png)
  if (planetImage) {
    const webpSource = planetImage.querySelector('source[type="image/webp"]');
    if (webpSource) {
      webpSource.srcset = planet.images.webp;
    }
    if (planetImg) {
      planetImg.src = planet.images.png;
      planetImg.alt = planet.name;
    }
  }

  // Update active tab
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

// =============================================
// Start
// =============================================
init();