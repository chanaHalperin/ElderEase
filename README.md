# ElderEase 👴👵

**ElderEase** is a complete full-stack platform designed to help elderly users manage daily life with ease and support. It includes task tracking, reminders, apartment services, and manager dashboards—all in an accessible, clean, and modular web interface.

---

## 🧠 What’s Included?

- 🖥 **Frontend** – React + Vite app with accessible, responsive UI
- 🧩 **Backend API** – Node.js + Express with JWT authentication and MongoDB
- 🐍 **Python Microservice** – Health recommendation and activity analysis with Flask or FastAPI
- 💾 **Database** – MongoDB for user profiles, schedules, tasks, and roles
- 🔐 **Auth** – bcrypt-secured password system with JWT
- 🐳 **Docker Support** – Run everything via `docker-compose` in one command

---

## 🖼 UI Screenshots

> These screenshots represent a small part of the full system. There are many additional pages and features not shown below (including manager panels, scheduling logic, cleaner assignments, role-based flows, and more).

| Page | Screenshot |
|------|------------|
| Home | ![Home](docs/home-page.png) |
| Login | ![Login](docs/login-page.png) |
| Activity Tracking | ![Activity](docs/activity-page.png) |
| Apartments | ![Apartments](docs/appartments-page.png) |

### Cleaner Role Interface

![Cleaner Page](docs/cleaner-page.gif)

### Elderly Role Interface

![Cleaner Page](docs/elderly-page.gif)

### Manager Role Interface

![Cleaner Page](docs/manager-page.gif)


---

## 🧱 Architecture

```
ElderEase/
├── client/               # React + Vite frontend
├── server/               # Node.js + Express backend
│   ├── routes/           # REST endpoints
│   ├── models/           # Mongoose schemas
│   └── controllers/      # Logic for each resource
├── python/               # Python services for insights or automation
├── docs/                 # UI screenshots (for README and docs)
├── docker-compose.yml    # Dev stack orchestration
├── .env.example          # Template for environment variables
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js ≥ 16
- Python ≥ 3.8
- MongoDB (local or remote)

### Setup Instructions

```bash
git clone https://github.com/chanaHalperin/ElderEase.git
cd ElderEase
```

Install dependencies:

```bash
cd client && npm install
cd ../server && npm install
cd ../python && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

### Environment Configuration

Create a `.env` file for both the `server/` and any service needing credentials.

➡️ Use `.env.example` as a template:
```bash
cp .env.example .env
```

Fill in:
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `PORT=...`

---

## 🐳 Docker (Optional)

To run all services using Docker:

```bash
docker-compose up --build
```

Then:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)
- Python Service: [http://localhost:5000](http://localhost:5000)

---

## 🧪 Testing

```bash
# Node
cd server && npm test

# Python
cd python && pytest
```

---

## 🔭 Future Plans

- React Native mobile version
- Role-based permissions with Admin/Staff/Manager views
- Real-time dashboard and reporting
- Calendar and notification integration
- WhatsApp/SMS reminders

---

## 👤 Author

Developed by Chana Halperin  
GitHub: [github.com/chanaHalperin](https://github.com/chanaHalperin)

---

## 📄 License

MIT License
