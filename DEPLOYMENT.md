# Deployment Guide for Tracify

This guide provides step-by-step instructions to deploy the Tracify application for a recruiter demo or portfolio showcase. We recommend using **Render** for application hosting and **Aiven** for the MySQL database. 

This setup relies on **free tiers** and implements best practices to handle ephemeral storage gracefully. No real SMTP emails will be sent—the system falls back to mock email logging, and uses in-app notifications to ensure recruiter demos work flawlessly.

## Phase 1: GitHub Push
1. Open terminal at the root of the project.
2. Initialize and push your repository:
   ```bash
   git init
   git add .
   git commit -m "Deploy-ready setup"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```

## Phase 2: Database Setup (Aiven Free MySQL)
1. Go to [Aiven.io](https://aiven.io/) and create a free MySQL database.
2. Under Connection Details, copy the Service URI, Host, Port, User, and Password.
3. Keep these handy for the Render configuration. No schema initialization is required—Spring Boot's `hibernate.ddl-auto=update` will auto-generate the schema on first boot.

## Phase 3: Deploy Backend on Render
1. Go to [Render](https://render.com/) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Build Command**: (Leave empty, Render will use the Dockerfile)
   - **Start Command**: (Leave empty, Render will use the Dockerfile)
4. Add Environment Variables:
   - `PORT` = `10000`
   - `DB_URL` = `jdbc:mysql://<Aiven_Host>:<Aiven_Port>/defaultdb?createDatabaseIfNotExist=true&useSSL=true&serverTimezone=UTC`
   - `DB_USERNAME` = `<Aiven_User>`
   - `DB_PASSWORD` = `<Aiven_Password>`
   - `JWT_SECRET` = `YourSecureRandom256BitKeyForJWTAuthHere`
   - `FRONTEND_URL` = `<Your_frontend_url>` (you can update this later once the frontend is deployed).
5. Deploy the backend and copy its URL (e.g., `https://tracify-backend.onrender.com`).

## Phase 4: Deploy Frontend on Render
1. Create a new **Static Site** on Render.
2. Connect the same GitHub repository.
3. Configure the service:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_BASE_URL` = `<Your_Backend_URL>/api` (e.g. `https://tracify-backend.onrender.com/api`)
   - `VITE_FILE_BASE_URL` = `<Your_Backend_URL>` (e.g. `https://tracify-backend.onrender.com`)
5. Deploy the Static Site. 
6. (Optional) Go back to the backend service to set the `FRONTEND_URL` env variable to your live frontend URL and redeploy.

## Notes & Free Tier Limitations
- **Sleeping Backend**: On the free tier, the backend goes to sleep after 15 minutes of inactivity. The first request from a recruiter might take 30-50 seconds.
- **Ephemeral Uploads**: Free instances clear local file storage when they restart or go to sleep. Due to this, uploaded images may become unavailable. The frontend codebase is pre-configured to handle broken image links gracefully by replacing them if they fail to load.
- **Mock Emails**: No real SMTP configuration is needed. The `EmailService` simply logs the email payload safely so that the main business flow executes smoothly.
