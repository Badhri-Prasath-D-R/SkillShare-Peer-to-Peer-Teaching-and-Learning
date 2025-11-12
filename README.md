# 🎓 SkillShare — Peer-to-Peer Teaching & Learning Platform

![Platform](https://img.shields.io/badge/Platform-SkillShare-orange)
![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Overview

**SkillShare** is a Smart Education web application designed to create an **interactive, learner-centered environment** for knowledge sharing and collaborative learning.  
Unlike traditional e-learning systems that focus on static content delivery, **SkillShare** emphasizes **engagement, adaptability, and peer-to-peer interaction**.

Developed as part of the **B.Tech Artificial Intelligence and Data Science** curriculum at **Chennai Institute of Technology**, this project bridges the gap between learners and teachers by enabling anyone to **teach, learn, and collaborate** seamlessly.

---

## 🎯 Key Features

### 🚀 Core Functionality
- 👩‍🏫 **Peer-to-Peer Sessions** — Host or join interactive learning sessions  
- 🎥 **Live Video Calls** — Real-time WebRTC-based video conferencing  
- 📅 **Session Management** — Schedule, join, and manage sessions  
- 📊 **Progress Tracking** — Earn points and achievements  
- 🧩 **Skill Profiles** — Showcase teachable and learning skills  
- 🏆 **Gamification System** — Badges, points, and ranks for engagement  

### 🎨 User Experience
- 💻 **Interactive Dashboard** with user stats and achievements  
- 🔍 **Advanced Search & Filters** by category, level, and keywords  
- 🔔 **Real-time Notifications** for updates and enrollments  
- 📱 **Responsive Design** — Mobile-friendly and accessible  
- 🔐 **Secure Authentication** using JWT  

---

## 🛠️ Tech Stack

### **Frontend**
- React 18 + TypeScript  
- TanStack Query for efficient data caching  
- Wouter for lightweight routing  
- Tailwind CSS + shadcn/ui for modern UI  
- Lucide Icons & date-fns utilities  

### **Backend**
- Node.js + Express.js  
- MongoDB (NoSQL database)  
- JWT Authentication for security  
- WebRTC for live video calls  
- RESTful API Architecture  

### **Development Tools**
- VS Code • Postman • Git & GitHub • Chrome DevTools  

---

## 📦 Installation & Setup

### 🧩 Prerequisites
- Node.js ≥ v16  
- MongoDB (Local or Atlas)  
- A modern WebRTC-compatible browser  

### ⚙️ Quick Start

#### 1. Clone Repository
```bash
git clone https://github.com/Badhri-Prasath-D-R/SkillShare-Peer-to-Peer-Teaching-and-Learning.git
cd SkillShare-Peer-to-Peer-Teaching-and-Learning

backend setup
cd server
npm install
cp .env.example .env
# Configure environment variables:
# MONGODB_URI=mongodb://localhost:27017/skillshare
# JWT_SECRET=your_secret_key
# PORT=5000

npm run dev

Frontend Setup
cd ../client
npm install
npm run dev

Access the App

Frontend → http://localhost:3000

Backend → http://localhost:5000

👨‍🎓 Usage Guide
For Learners

Create an account and set your learning goals

Browse sessions using category filters

Join live WebRTC sessions

Track progress and achievements

For Teachers

Create and host sessions

Manage participants and schedules

Earn badges and improve your rating

🔬 Research & Academic Context

Developed under the Core Course Project (CCP)
B.Tech Artificial Intelligence & Data Science,
Chennai Institute of Technology

⚙️ Technical Highlights
Frontend

dashboard.tsx — user overview with statistics

browse-sessions.tsx — session discovery & filters

video-call.tsx — WebRTC video interface

create-session.tsx — interactive session setup

Backend

RESTful APIs using Express.js

JWT-based authentication

WebRTC signaling for live calls

Input validation and error handling

| Name                   | ID       | Role                 | Key Contributions                   |
| ---------------------- | -------- | -------------------- | ----------------------------------- |
| **Sushil G**           | 24AD0301 | Full Stack Developer | UI/UX, frontend architecture        |
| **Badhri Prasath D R** | 24AD0040 | Full Stack Developer | Backend APIs, database, integration |

<div align="center">
🎓 SkillShare Platform

Empowering collaborative learning through peer-to-peer teaching

“When you teach, you learn twice.” — Joseph Joubert

Developers:
Sushil G (24AD0301) • Badhri Prasath D R (24AD0040)

Institution: Chennai Institute of Technology — Dept. of AI & DS
Academic Year: 2025–2026

</div> ```
