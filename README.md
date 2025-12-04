# OD-Claimer 🚀
A streamlined platform to manage, submit, and track On-Duty (OD) applications efficiently.

---

## 📌 Overview
OD-Claimer is a web-based system built to simplify the workflow of applying for and reviewing On-Duty (OD) requests.  
It provides a clean user interface, admin review tools, and a structured backend for handling OD submissions.

---

## ✨ User Features
- Apply for OD with required details.
- View the status of past and current applications.
- Clean, user-friendly interface for quick submissions.
- Additional features as implemented.

---

## 🛡️ Admin Features
- Review incoming OD claims.
- Approve or reject requests via admin dashboard.
- Manage users and their OD logs.

---

## 🛠️ Tech Stack

### **Frontend (Client)**
- HTML  
- CSS  
- JavaScript  

### **Backend**
- Node.js  
- Express.js  

### **Tools**
- Git & GitHub  
- npm  

---

## 📁 Project Structure
OD-Claimer/
│
├── backend/
│ ├── routes/ # API routes
│ ├── controllers/ # Request handlers
│ ├── models/ # Database models (if using DB)
│ ├── config/ # Configurations (DB, server, env)
│ └── server.js # Entry point for backend
│
└── client/
├── index.html # Main UI page
├── assets/ # Images, icons, etc.
├── css/ # Stylesheets
├── js/ # Client-side scripts
└── components/ # Optional UI components (if used)


---

## 🚀 Getting Started

### ✔️ Prerequisites
Before running this project, ensure you have installed:

- **Node.js**  
- **npm**  

---

## 🔧 Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Yuvarajm-19/OD-Claimer.git
cd OD-Claimer

2️⃣ Install Backend Dependencies
cd backend
npm install

3️⃣ Install Client Dependencies

If your client folder contains package.json:

cd ../client
npm install


If not, the client is static and can run directly via browser.

▶️ Running the Application
🔹 Start Backend Server
cd backend
npm start

🔹 Start Frontend
If static (HTML/CSS/JS):

Simply open:

client/index.html

If frontend uses npm:
cd client
npm start

🔐 Environment Variables (Optional)

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key


Update values based on your environment.

🤝 Contributing

Contributions are always welcome!

Fork this repository

Create a feature branch

Commit your changes

Push to your branch

Open a Pull Request

🐛 Issues

Found a bug or need a new feature?
👉 Create an Issue in the repo and describe it clearly.

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Yuvaraj M
GitHub: Yuvarajm-19
