# 🍬 Sweet Shop - Management System

A modern, full-stack e-commerce web application for managing and purchasing authentic Indian sweets. Built with **React**, **TypeScript**, **FastAPI**, and powered by **PostgreSQL** and **Prisma**.

![Sweet Shop Banner](public/hero/banner.png)

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Running the Application](#-running-the-application)
- [License](#-license)

## ✨ Features

- **🛍️ Catalog & Cart**: Browse authentic sweets, filter by category, and manage your shopping cart.
- **💳 Secure Checkout**: JWT-based authentication flow.
- **🎨 Glassmorphism UI**: Stunning interface with TailwindCSS and Framer Motion animations.
- **� Admin Dashboard**: Manage products, stock levels, and view analytics.
- **⚡ High Performance**: Fast backend responses with FastAPI and optimized database queries via Prisma.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State**: Zustand
- **Animations**: Framer Motion
- **HTTP**: Axios

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Database**: PostgreSQL
- **ORM**: Prisma (Prisma Client Python)
- **Auth**: JWT (Python-Jose)
- **Validation**: Pydantic

## 📁 Project Structure

```
gravity/
├── backend/
│   ├── main.py                 # Application entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema and models
│   ├── routers/                # API route handlers
│   │   ├── auth.py
│   │   ├── products.py
│   │   └── orders.py
│   └── requirements.txt        # Backend dependencies
│
└── frontend/
    ├── src/
    │   ├── components/         # React components
    │   ├── pages/             # Route pages
    │   └── store/             # Global state
    └── package.json            # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **PostgreSQL** (running locally or cloud)
- **Git**

### Backend Setup

1. **Navigate to backend**:
   ```bash
   cd gravity/backend
   ```

2. **Setup Virtual Environment**:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   pip install prisma
   ```

4. **Configure Environment**:
   Create a `.env` file in `gravity/backend`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/sweetshop?schema=public"
   SECRET_KEY="your_secret_key"
   ```

5. **Initialize Database**:
   Generate the Prisma client and push the schema to your Postgres database:
   ```bash
   prisma generate
   prisma db push
   ```

### Frontend Setup

1. **Navigate to frontend**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

## ▶️ Running the Application

1. **Backend** (from `gravity/backend`):
   ```bash
   uvicorn main:app --reload
   ```
   API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

2. **Frontend** (from `gravity/frontend`):
   ```bash
   npm run dev
   ```
   App: [http://localhost:5173](http://localhost:5173)

## 📝 License
This project was created as part of the Incubyte hiring process.
