# 🛡️ Ransom Guard - Ransomware Analysis Platform
> **Note**: This project is currently under active development.

A modern web-based platform for analyzing suspicious files, domains, and URLs to detect ransomware and other malware threats. Built with a React frontend, FastAPI backend, and Machine Learning integration.

---

## ✨ Key Features

- **Automated Analysis**: Static and dynamic analysis of PE files using LightGBM models.
- **Real-time Monitoring**: Live progress tracking and instant notifications for analysis results.
- **Secure Authentication**: Google OAuth and Email/Password integration via Firebase.
- **Rich Visualization**: Modern, dark-themed dashboard with detailed behavioral indicators.
- **Reporting**: Export comprehensive analysis results as styled PDF reports.
- **Theme Support**: Seamless Dark and Light mode transitions.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React, jsPDF
- **Backend**: Python, FastAPI, Uvicorn, hashlib
- **Machine Learning**: LightGBM (LGBM), Feature Extraction
- **Authentication**: Firebase Auth (Google OAuth & Email)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Firebase Project (for Auth)

### 1. Setup Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### 2. Setup Frontend
```bash
npm install
npm run dev
```

### 3. Configure Firebase
Update `src/config/firebase.js` with your project credentials. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for details.

---

## 📁 Project Structure

```text
Ransom-Guard/
├── src/                                
│   ├── components/                     
│   │   ├── Navigation.jsx              
│   │   ├── Footer.jsx                  
│   │   └── Login.jsx                   
│   ├── config/
│   │   └── firebase.js                 
│   ├── context/
│   │   └── AuthContext.jsx             
│   ├── App.jsx                         
│   ├── App.css                        
│   ├── index.css                      
│   └── main.jsx                       
│
├── backend/                           
│   └── main.py
│
├── public/                            
│   ├── Logo.svg                       
│   ├── Light.svg / Dark.svg           
│   └── up1.svg / up2.svg / not.svg    
│
├── .gitignore                         
├── package.json                       
├── vite.config.js                      
├── FIREBASE_SETUP.md                   
├── GITHUB_UPLOAD_ANALYSIS.md           
├── README.md                           
└── test_malicious_demo.exe 
```

---

## 📚 Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Complete authentication configuration.
- [GitHub Upload Analysis](./GITHUB_UPLOAD_ANALYSIS.md) - Project hierarchy and deployment details.

---

## 📄 License

This project is licensed under the MIT License.
