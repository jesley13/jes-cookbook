import { marked } from 'marked';
import { load } from 'js-yaml';

// Fetch and parse all markdown recipes using Vite's import.meta.glob
export async function getAllRecipes() {
  const modules = import.meta.glob('/recipes/*.md', { query: '?raw', import: 'default' });
  const recipes = [];
  
  for (const path in modules) {
    const rawContent = await modules[path]();
    // Split frontmatter from markdown body
    const match = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (match) {
      const frontmatter = load(match[1]);
      const body = match[2];
      const filenameSlug = path.split('/').pop().replace('.md', '');
      const finalSlug = frontmatter.slug || filenameSlug;
      
      recipes.push({
        ...frontmatter,
        slug: finalSlug,
        body,
        path,
        htmlBody: marked.parse(body),
        // Additional calculated fields for search/filtering
        searchString: `${frontmatter.title} ${frontmatter.category || ''} ${frontmatter.cuisine || ''} ${frontmatter.protein || ''} ${frontmatter.tags ? frontmatter.tags.join(' ') : ''}`.toLowerCase()
      });
    }
  }
  return recipes;
}

// Function to format time
export function formatTime(minutes) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
