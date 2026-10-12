# Campus Allocate

A Next.js campus room booking and allocation application for managing room availability, filters, and booking workflows.

## Prerequisites

Before running the app, make sure you have:

- Node.js 18 or later
- npm 9 or later
- A modern browser

## Install dependencies

From the project root:

```bash
cd "D:\CodeHub\HelloWord\campus-allocate"
npm install
```

## Run the app in development mode

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Production build

To build the app for production:

```bash
npm run build
```

To start the production build locally:

```bash
npm start
```

## Available scripts

```bash
npm run dev    # start local development server
npm run build  # create an optimized production build
npm run start  # run the built app
npm run lint   # check for lint issues
```

## Project structure

```text
campus-allocate/
├── src/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── lib/
│   └── ...
├── public/
├── package.json
├── next.config.ts
├── tsconfig.json
├── README.md
└── eslint.config.mjs
```

## Notes

- The app uses Next.js and React.
- Changes in the source files are reflected automatically during development.
- If you face a dependency or runtime issue, delete the node_modules folder and reinstall dependencies:

```bash
rm -rf node_modules
npm install
```

If you are using PowerShell on Windows, use:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

## Troubleshooting

If the app does not start:

1. Confirm Node.js is installed:
   ```bash
   node -v
   npm -v
   ```
2. Install dependencies again:
   ```bash
   npm install
   ```
3. Run the dev server again:
   ```bash
   npm run dev
   ```

