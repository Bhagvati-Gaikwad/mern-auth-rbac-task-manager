# How to Run This Project

Follow these steps slowly. You do not need prior MERN knowledge.

## 1. Install Required Software

Install these first:

- Node.js LTS from `https://nodejs.org`
- Docker Desktop from `https://www.docker.com/products/docker-desktop/`
- Git from `https://git-scm.com`
- VS Code from `https://code.visualstudio.com`

After installing Docker Desktop, open it once and wait until it says Docker is running.

## 2. Install Project Packages

Open a terminal in this project folder and run:

```bash
npm run install:all
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd run install:all
```

## 3. Create Environment File

Copy `server/.env.example` to `server/.env`.

On Windows PowerShell:

```bash
Copy-Item server/.env.example server/.env
```

## 4. Start MongoDB

Make sure Docker Desktop is open and fully running first. On Windows, this error means Docker Desktop is closed:

```bash
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified
```

Fix:

1. Open Docker Desktop from the Start Menu.
2. Wait until it says the engine is running.
3. Run:

```bash
docker compose up -d
```

If Docker still gives problems, use MongoDB Atlas instead:

1. Create a free cluster at `https://www.mongodb.com/atlas`
2. Copy your connection string.
3. Replace `MONGO_URI` in `server/.env` with the Atlas URI.
4. Run `npm run dev` again.

## 5. Start Backend and Frontend

Run:

```bash
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5000/health`
- Swagger API docs: `http://localhost:5000/api/docs`

## 6. Test the App

1. Open `http://localhost:5173`
2. Click Register
3. Use a password like `Password123`
4. Create a task
5. Change the task status
6. Delete the task

## 7. Push to GitHub

Run these commands:

```bash
git init
git add .
git commit -m "Build MERN auth RBAC task manager"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Submit the GitHub repository link in the Google Form.

## Common Problems

If `npm` is blocked in PowerShell, use `npm.cmd`.

If MongoDB does not start, open Docker Desktop first.

If port `5000` or `5173` is already used, stop the other app or change `PORT` in `server/.env`.
