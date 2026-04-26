# AI Note Assistant

AI Note Assistant is a powerful full-stack application designed to transform handwritten notes and images into structured digital insights. Leveraging advanced AI models like Llama-3.3 via Groq and Cloudinary for media management, it provides a seamless bridge between physical brainstorming and digital organization.

## 🚀 Features

- **Precision OCR**: High-fidelity text extraction from handwritten notes using Llama-3.3 Vision.
- **AI Refinement**: Automatic grammar correction and semantic structuring.
- **Digital Archiving**: Searchable cloud storage for all your digitized notes.
- **Batch Processing**: Organize notes into projects and batches.
- **PDF Export**: Generate professional PDF summaries of your digitized notes.
- **Secure Authentication**: Email/Password and Google OAuth2 integration.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10+**
- **Node.js 18+** or **Bun**
- **PostgreSQL 17**
- **Git**

---

## 📂 Project Structure

```
note-taking-app/
├── backend/            # FastAPI Backend
├── seamless-sign-up/   # React (Vite) Frontend
└── .gitignore          # Root git ignore
```

---

## ⚙️ Backend Setup (Python/FastAPI)

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Create a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables**:
    - Copy `.env.example` to a new file named `.env`.
    - Fill in your credentials (PostgreSQL, Groq API, Cloudinary, etc.).
    ```bash
    cp .env.example .env
    ```

5.  **Initialize Database**:
    Make sure your PostgreSQL server is running and the database specified in `DATABASE_URL` exists.
    ```bash
    alembic upgrade head
    ```

6.  **Run the Backend**:
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

---

## 💻 Frontend Setup (React/Vite)

1.  **Navigate to the frontend directory**:
    ```bash
    cd ../seamless-sign-up
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # OR if using Bun
    bun install
    ```

3.  **Configure Environment Variables**:
    - Create a `.env` file in the `seamless-sign-up` directory.
    - Add the backend API URL:
    ```env
    VITE_API_BASE_URL=http://localhost:8000
    ```

4.  **Run the Frontend**:
    ```bash
    npm run dev
    # OR if using Bun
    bun dev
    ```
    The application will be available at `http://localhost:8080`.

---

## 🔑 Key API Configurations

To fully utilize all features, you will need keys from:
- **Groq Cloud**: For AI Vision and LLM refinement.
- **Cloudinary**: For image hosting.
- **Google Cloud Console**: For Google OAuth2 login.
- **Brevo**: For sending transactional emails (optional).

---

## 📄 License

© 2024 HamidTech Ventures. All rights reserved.
