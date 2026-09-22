# Best TV Show Ever

React/Vite starter for the **Best TV Show Ever** homepage.

## Open and run in VS Code

1. Extract the downloaded ZIP.
2. Open VS Code.
3. Select **File → Open Folder** and choose `best-tv-show-ever`.
4. Open the VS Code terminal with **Terminal → New Terminal**.
5. Run:

```bash
npm install
npm run dev
```

6. Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Included

- Responsive React homepage
- Vintage three-position channel dial
- Classic, Channel Mode, and Daily Challenge previews
- Mouse, keyboard, and touch-friendly mode controls
- Placeholder Start action ready to connect to the future game screens

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

The workflow runs again whenever new code is pushed to the `main` branch.
