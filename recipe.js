import { getAllRecipes, formatTime, getImageUrl } from './utils.js';

let currentRecipe = null;
let baseServings = 4;
let currentServings = 4;

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

  baseServings = currentRecipe.servings || 4;
  currentServings = baseServings;
  
  renderRecipe();
  setupScaler();
}

function renderRecipe() {
  // Title & Meta
  document.title = `${currentRecipe.title} - Jes' cookbook`;
  document.getElementById('recipe-title').textContent = currentRecipe.title;
  
  const meta = [];
  if (currentRecipe.difficulty) meta.push(currentRecipe.difficulty);
  if (currentRecipe.cuisine) meta.push(currentRecipe.cuisine);
  if (currentRecipe.category) meta.push(currentRecipe.category);
  
  let favHtml = currentRecipe.favourite ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="color:var(--accent-color); vertical-align:middle; margin-left: 4px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>` : '';
  
  document.getElementById('recipe-meta').innerHTML = meta.join('<span style="color:var(--surface-color-light)"> • </span>') + favHtml;
  
  // Times
  document.getElementById('info-prep').textContent = formatTime(currentRecipe.prep_time);
  document.getElementById('info-cook').textContent = formatTime(currentRecipe.cook_time);
  document.getElementById('info-total').textContent = formatTime(currentRecipe.total_time);

  // Image
  if (currentRecipe.image) {
    document.getElementById('recipe-img-container').innerHTML = `<img src="${getImageUrl(currentRecipe.image)}" alt="${currentRecipe.title}" class="recipe-header-img">`;
  } else {
    // Default placeholder gradient
    document.getElementById('recipe-img-container').innerHTML = `<div class="recipe-header-img" style="background: linear-gradient(135deg, var(--surface-color-light), var(--surface-color));"></div>`;
  }

  // Edit Button URL
  // Decap CMS uses the collection name (recipes) and the slug
  document.getElementById('edit-btn').href = `/admin/#/collections/recipes/entries/${currentRecipe.slug}`;

  // Content (Markdown)
  renderContent();
}

function setupScaler() {
  document.getElementById('servings-value').textContent = currentServings;
  
  document.getElementById('scale-down').addEventListener('click', () => {
    if (currentServings > 1) {
      currentServings--;
      document.getElementById('servings-value').textContent = currentServings;
      renderContent();
    }
  });

  document.getElementById('scale-up').addEventListener('click', () => {
    currentServings++;
    document.getElementById('servings-value').textContent = currentServings;
    renderContent();
  });
}

function renderContent() {
  // We need to parse the original HTML, find quantities in list items under "Ingredients", and scale them.
  // A robust way on the client side:
  // 1. Put the htmlBody in a temporary div
  // 2. Find the Ingredients section
  // 3. Find all <li> elements
  // 4. Regex match numbers at the start of the string, scale them, wrap them in <span class="qty scaled">
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = currentRecipe.htmlBody;
  
  const scaleRatio = currentServings / baseServings;
  
  // Try to find the Ingredients heading (h2)
  let foundIngredients = false;
  
  Array.from(tempDiv.children).forEach(el => {
    if (el.tagName === 'H2' && el.textContent.trim().toLowerCase().includes('ingredient')) {
      foundIngredients = true;
    } else if (el.tagName === 'H2' && foundIngredients) {
      // Stopped being in ingredients section
      foundIngredients = false;
    }
    
    // If we are within the ingredients section and it's a list
    if (foundIngredients && (el.tagName === 'UL' || el.tagName === 'OL')) {
      el.querySelectorAll('li').forEach(li => {
        // Regex to match a starting number (integer or decimal)
        // e.g., "500 g chicken", "1.5 cups water", "0.5 tsp salt"
        let text = li.innerHTML;
        const numMatch = text.match(/^([\d\.]+)\s*(.*)/);
        
        if (numMatch && !isNaN(parseFloat(numMatch[1]))) {
          const originalNum = parseFloat(numMatch[1]);
          const scaledNum = +(originalNum * scaleRatio).toFixed(2); // Fix float precision issues
          
          let scaledClass = scaleRatio !== 1 ? 'scaled' : '';
          li.innerHTML = `<span class="qty ${scaledClass}">${scaledNum}</span> ${numMatch[2]}`;
        }
      });
    }
  });

  document.getElementById('recipe-body').innerHTML = tempDiv.innerHTML;
}

init();
