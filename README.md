## 🚀 Live Demo
**https://expense-tracker-lae-88d206f63fac.herokuapp.com/**

## 📁 Project Structure (Heroku Deployment Branch)

This branch is the version deployed on **Heroku**.  
Unlike `main`, it places both backend and frontend components in the project root.

### 🔹 Backend (Flask)
All backend files are in the root folder.  
`app.py` is adjusted in this branch to serve the React build from the `dist` directory.

### 🔹 Frontend (React)
- React source code is in `frontend/src/`.
- The production build lives in `dist/`, which Flask serves directly.