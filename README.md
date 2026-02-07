# Crack-It - Aptitude Test Platform

A comprehensive platform for practicing aptitude questions, taking tests, and tracking performance. Built with React, Node.js, and Firebase.

## Features

- **Practice Arena**: Solve improved coding and aptitude questions.
- **Test Manager**: Create and manage tests (Admin).
- **Live Tests**: Take timed tests with real-time tracking.
- **Leaderboards**: View top performers.
- **User Profiles**: Track progress and test history.
- **Admin Dashboard**: Manage questions and users.

## Tech Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS** for styling
- **Firebase** (Auth, Firestore)
- **AlaSQL** for client-side SQL simulations
- **jsPDF** for report generation

### Backend
- **Node.js** & **Express**
- **Firebase Admin SDK** for privileged operations

## Prerequisites

- Node.js (v16 or higher)
- A Firebase project with Firestore and Authentication enabled.

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd aptitude // or crack-it
```

### 2. Frontend Setup
Navigate to the root directory and install dependencies:
```bash
npm install
```

Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
```

### 3. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

**Service Account Key:**
1. Go to your Firebase Console -> Project Settings -> Service Accounts.
2. Generate a new private key.
3. Save the file as `serviceAccountKey.json` inside the `backend/` folder.

**Environment Variables:**
Create a `.env` file in the `backend/` directory if required by current backend logic (check `backend/index.js`).

## Running the Application

### Start the Backend
```bash
cd backend
node index.js
```
The backend server should start (usually on port 3000 or 5000).

### Start the Frontend
Open a new terminal, navigate to the root directory, and run:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Folder Structure
- `/src`: Frontend React source code.
  - `/pages`: Application pages.
  - `/components`: Reusable UI components.
  - `/services`: API and Firebase service wrappers.
- `/backend`: Node.js Express server.
