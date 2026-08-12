import Fuse from 'fuse.js';
import { getAllRecipes, formatTime, getImageUrl, initThemeToggle } from './utils.js';
import { getIconForRecipe } from './icons.js';

let allRecipes = [];
let fuse;
const recipeGrid = document.getElementById('recipe-grid');
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');

async function init() {
  initThemeToggle();
  allRecipes = await getAllRecipes();
  
  // Setup Fuse for fuzzy searching
  fuse = new Fuse(allRecipes, {
    keys: ['title', 'body'],
    threshold: 0.3,
    ignoreLocation: true
  });

  renderRecipes(sortRecipes(allRecipes));
  
  // Event Listeners
  searchInput.addEventListener('input', handleSearchAndFilter);

  // Keyboard friendly search (Ctrl+K or /)
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      searchInput.focus();
    }
  });

}

function handleSearchAndFilter() {
  let results = allRecipes;
  
  const query = searchInput.value.trim();
  if (query) {
    results = fuse.search(query).map(result => result.item);
  }

  // 2. Sort
  results = sortRecipes(results);

  // 4. Render
  renderRecipes(results);
}

function sortRecipes(recipes) {
  // Sort alphabetically by title
  return [...recipes].sort((a, b) => {
    const titleA = a.title || '';
    const titleB = b.title || '';
    return titleA.localeCompare(titleB);
  });
}

function renderRecipes(recipes) {
  recipeGrid.innerHTML = '';
  
  if (recipes.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');

  recipes.forEach(recipe => {
    const card = document.createElement('a');
    card.href = `${import.meta.env.BASE_URL}recipe.html?slug=${recipe.slug}`;
    card.className = `recipe-card`;
    
    card.innerHTML = `
      <div class="card-icon-container">
        ${getIconForRecipe(recipe.title)}
      </div>
      <div class="card-content">
        <h3 class="card-title">${recipe.title}</h3>
      </div>
    `;
    
    recipeGrid.appendChild(card);
  });
}

// Initialize app
init();
