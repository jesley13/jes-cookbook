# My Personal Cookbook

A complete, mobile-first personal recipe database website designed for speed and ease of use on mobile devices.

## Architecture
- **Frontend**: Vite + Vanilla JS + CSS (Static Site)
- **Database**: Markdown files with YAML front matter
- **Content Management**: Decap CMS
- **Hosting**: GitHub Pages

## Initial Setup & GitHub Hosting

1. **Create the GitHub Repository:**
   - Go to GitHub and create a new public repository (e.g., `my-cookbook`).
   - Push this code to the `main` branch.

2. **Configure GitHub Pages:**
   - In your GitHub repo, go to **Settings** > **Pages**.
   - Under "Source", select **GitHub Actions**.
   - GitHub will automatically detect that you're using Vite and suggest the "Static HTML" or "Node.js" workflow.
   - Alternatively, you can add a file `.github/workflows/deploy.yml` with the standard Vite deployment script (provided below).

3. **Configure Decap CMS Authentication:**
   - Since there is no backend server, Decap CMS connects directly to GitHub using PKCE OAuth.
   - In GitHub, go to **Settings** (Account Settings) > **Developer settings** > **OAuth Apps** > **New OAuth App**.
   - **Application Name**: My Cookbook CMS
   - **Homepage URL**: The URL of your GitHub Pages site (e.g., `https://your-username.github.io/my-cookbook/`)
   - **Authorization callback URL**: The exact same URL as above.
   - Once created, copy the **Client ID** and update `public/admin/config.yml` (add `client_id: "your-client-id"` under the `github` backend settings if needed, or Decap CMS will prompt you if it relies on a proxy, wait: for pure PKCE, you need to ensure the App is configured). 
   - *Note:* In `public/admin/config.yml`, ensure you replace `your-username/your-repo-name` with your actual repository.

## How to Manage Recipes

### Add your first recipe
- Navigate to `https://<your-github-pages-url>/admin/` on your phone or desktop.
- Click "Login with GitHub".
- You will see the Decap CMS dashboard. Click **New Recipe**.
- Fill out the form fields. The "Ingredients" and "Method" should be written in the Markdown body.
- When you click "Publish", the CMS will commit a new Markdown file to your GitHub repository, triggering a site rebuild!

### Edit a recipe
- Open any recipe on your website.
- Scroll to the bottom and click **Edit Recipe in CMS**.
- Make your changes and click Publish.

### Upload a photograph
- Inside the CMS form for a recipe, click the **Image** field to upload a photo.
- The photo will be saved to `public/images/recipes/` and linked automatically.

### Add new filter values
- Filters (Protein, Cuisine, etc.) are **dynamic**.
- If you add a recipe in the CMS with a new Protein (e.g., "Tofu"), "Tofu" will automatically appear as a filter option on the home page.

### Back up the recipe collection
- Because all data is stored in the `recipes/` folder as `.md` files, your GitHub repository **is** your backup.
- You can clone the repository to your local computer at any time to have a complete offline backup of all recipes and photos.

## Local Development (For Code Changes)

If you want to modify the website's code or styling:

1. Install Node.js
2. Run `npm install`
3. Run `npm run dev` to start the local server.
4. Open `http://localhost:5173`

## GitHub Actions Deployment Script (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
