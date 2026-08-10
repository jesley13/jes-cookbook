import Fuse from 'fuse.js';
import { getAllRecipes, formatTime, getImageUrl } from './utils.js';

let allRecipes = [];
let fuse;
const recipeGrid = document.getElementById('recipe-grid');
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');

async function init() {
  allRecipes = await getAllRecipes();
  
  // Setup Fuse for fuzzy searching
  fuse = new Fuse(allRecipes, {
    keys: ['title', 'category', 'cuisine', 'protein', 'tags', 'body'],
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
  // Just sort newest/alphabetical by default now since sorting is removed from UI
  return [...recipes].reverse();
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
    card.className = 'recipe-card';
    
    // Image
    let imgHtml = '';
    if (recipe.image) {
      imgHtml = `<img src="${getImageUrl(recipe.image)}" alt="${recipe.title}" class="card-image" loading="lazy">`;
    } else {
      imgHtml = `<div class="card-image">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      </div>`;
    }

    // Badges/Meta
    const metaItems = [];
    if (recipe.cuisine) metaItems.push(`<span>${recipe.cuisine}</span>`);
    if (recipe.protein) metaItems.push(`<span>${recipe.protein}</span>`);
    if (recipe.category) metaItems.push(`<span>${recipe.category}</span>`);

    // Fav
    let favHtml = recipe.favourite ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="fav-icon"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>` : '';

    card.innerHTML = `
      ${imgHtml}
      <div class="card-content">
        <div class="card-header">
          <h2 class="card-title">${recipe.title}</h2>
          ${favHtml}
        </div>
        <div class="card-meta">
          ${metaItems.join('<span style="color:var(--surface-color-light)">•</span>')}
        </div>
        <div class="card-footer" style="justify-content: flex-end;">
          <div class="time-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${formatTime(recipe.total_time)}
          </div>
        </div>
      </div>
    `;
    
    recipeGrid.appendChild(card);
  });
}

// Initialize app
init();
