# 🚀 APIs of Projects

A multi-service mono-repository containing backend REST APIs for various frontend applications, built with Node.js, Express, and MongoDB.

This repository is pre-configured for easy local orchestrations (using PM2) and instant production deployments (using Render Blueprints).

---

## 📂 Repository Structure

```
APIs-of-Projects/
├── admission-api/       # Admission & Student Registration API
├── auth-api/            # Custom User Authentication practice API
├── healHub-api/         # HealHub medicine and user management API
├── ecosystem.config.js  # PM2 Configuration for local orchestrations
├── render.yaml          # Render Blueprint for automated multi-service deploy
└── .gitignore           # Global git ignore configuration
```

---

## 🛠️ Microservices Included & Live Deployments

### 1. 🎓 Admission API (`/admission-api`)
Automates the student registration process.
* **Live Link**: [https://admission-api-auyi.onrender.com](https://admission-api-auyi.onrender.com)
* **Technology stack**: Express, Mongoose (v9), PDFKit, Twilio.
* **Key Features**:
  * Auto-generation of unique Admission numbers (`ADM2026xxxx`).
  * Generates PDF receipts on-the-fly using `pdfkit`.
  * Integrates with Twilio for sending WhatsApp confirmation alerts.
  * Robust session management using `connect-mongo`.
  * OTP verification for secure login.

### 2. 🔐 Auth API (`/auth-api`)
A core user authentication system.
* **Live Link**: [https://auth-api-dkx3.onrender.com](https://auth-api-dkx3.onrender.com)
* **Technology stack**: Express, Mongoose (v8), JSON Web Tokens (JWT), BcryptJS, Cookie-Parser.
* **Key Features**:
  * Secure password hashing with salt.
  * Dual Token authentication (Access Token + Refresh Token lifecycle).
  * Cookie-based secure refresh mechanism.

### 3. 🏥 HealHub API (`/healHub-api`)
A medical utility backend managing products and user roles.
* **Live Link**: [https://healhub-api.onrender.com](https://healhub-api.onrender.com)
* **Technology stack**: Express, Mongoose, JWT.
* **Key Features**:
  * Medicine inventory CRUD endpoints.
  * Role-based endpoints for healthcare users.
  * Utilizes cookie-based JWT authentication.

---

## 💻 Local Development Setup

To run these projects locally, you can choose to run them individually or orchestrate them together.

### Option A: Running all services together with PM2
If you have **PM2** installed globally (`npm install -g pm2`), you can boot up all three services simultaneously with:

```bash
# Install dependencies in all subdirectories first:
cd admission-api && npm install
cd ../auth-api && npm install
cd ../healHub-api && npm install
cd ..

# Start the cluster
pm2 start ecosystem.config.js
```

### Option B: Running a single API manually
Go into the respective API folder, install dependencies, and run:

```bash
cd admission-api # or auth-api, healHub-api
npm install
npm start
```

---

## ☁️ Deploying to Render (Blueprint Setup)

This project has built-in support for **Render Blueprints**, allowing you to deploy all 3 services at once.

1. Push your repository to your GitHub account.
2. Log in to the **Render Dashboard**.
3. Click **New** > **Blueprint**.
4. Connect your GitHub repository.
5. Render will detect the `render.yaml` file and automatically configure all services with their build scripts, start scripts, and prompt you to input the corresponding `MONGO_URL` connection strings.