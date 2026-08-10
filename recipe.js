import { getAllRecipes, getImageUrl } from './utils.js';

let currentRecipe = null;

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  
  if (!slug) {
    window.location.href = '/';
    return;
  }

  const recipes = await getAllRecipes();
  currentRecipe = recipes.find(r => r.slug === slug);
  
  if (!currentRecipe) {
    document.getElementById('recipe-title').textContent = 'Recipe not found';
    return;
  }

  renderRecipe();
}

function renderRecipe() {
  // Title
  document.title = `${currentRecipe.title} - Jes' cookbook`;
  document.getElementById('recipe-title').textContent = currentRecipe.title;
  
  // Apply vibrant gradient header based on deterministic hash
  const charSum = currentRecipe.title.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const gradIndex = (charSum % 6) + 1;
  document.getElementById('recipe-header').className = `recipe-header-content grad-${gradIndex}`;

  // Content (Markdown)
  renderContent();
}

function renderContent() {
  document.getElementById('recipe-body').innerHTML = currentRecipe.htmlBody || '';
}

init();
