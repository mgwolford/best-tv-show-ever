# Best TV Show Ever

React/Vite project for building a six-show lineup with live TMDB results.

## Open and run in VS Code

1. Extract the downloaded ZIP.
2. Open VS Code.
3. Select **File → Open Folder** and choose `best-tv-show-ever`.
4. Open the VS Code terminal with **Terminal → New Terminal**.
5. Run:

```bash
npm install
npm run setup-env
npm run dev
```

6. Open the local URL shown in the terminal, usually `http://localhost:5173`.

Before starting the site, copy `.env.example` to `.env` and replace the placeholder with your TMDB API key. On Windows you can simply duplicate the file in VS Code and rename the copy `.env`.

## Included

- Responsive homepage, Channel Mode picker, and show-selection screen
- Vintage three-position channel dial
- Classic, Channel Mode, and Daily Challenge previews
- Mouse, keyboard, and touch-friendly mode controls
- Live TMDB discovery across TV genres and decades
- Six rounds with eight choices, two rerolls, and confirm-before-pick behavior
- Broadcast, Premium, and Streaming network filters
- Repeatable date-based Daily Challenge

## Production check

```bash
npm run build
```

## Put it on GitHub

1. Go to GitHub and create a new empty repository. A name such as `best-tv-show-ever` works well.
2. Do **not** add a README, `.gitignore`, or license on GitHub because those files are already included here.
3. In the VS Code terminal, run the following commands, replacing the example URL with the URL GitHub gives you:

```bash
git init
git add .
git commit -m "Create Best TV Show Ever homepage"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/best-tv-show-ever.git
git push -u origin main
```

## Turn on GitHub Pages

1. Open the repository on GitHub.
2. Select **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the **Actions** tab to watch the `Deploy to GitHub Pages` workflow finish.

Before the first deployment, open **Settings → Secrets and variables → Actions**, create a repository secret named `VITE_TMDB_API_KEY`, and paste the same TMDB key as its value.

The workflow runs again whenever new code is pushed to the `main` branch.
