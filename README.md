# 🛡️ Ransom Guard - Ransomware Analysis Platform 
# 🛑 Under Developmment.....

A powerful, modern web-based platform for analyzing suspicious files, domains, and URLs to detect ransomware and other malware threats. Built with React, FastAPI, and Cuckoo Sandbox integration.

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Ransomware Families](#-ransomware-families)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## ✨ Features

### Core Analysis
- **Static Analysis** - PE file feature extraction using machine learning (33% progress)
- **Dynamic Analysis** - Cuckoo Sandbox behavioral analysis on Windows VMs (120 seconds execution)
- **Ransomware Family Classification** - Automatic identification of known ransomware families
- **Real-time Progress Tracking** - WebSocket-based live updates during analysis
- **IOC Extraction** - Automatic extraction of Indicators of Compromise

### User Interface
- **Drag-and-Drop Upload** - Intuitive file upload interface
- **Tab Navigation** - File, URL, and Search tabs for different analysis types
- **Beautiful Dashboard** - Modern dark theme with responsive design
- **Real-time Results** - Comprehensive analysis reports with behavioral indicators
- **Download Reports** - Export full analysis results as PDF/JSON

### Security Indicators
- File encryption detection
- Cryptographic API call monitoring
- Network communication tracking
- Registry persistence detection
- Ransom note identification
- Process injection detection

### Ransomware Detection
- Behavioral pattern matching
- ML-based family classification
- Double extortion detection
- C2 communication analysis
- Shadow copy deletion detection

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React)                      │
│          File Upload, Results Visualization             │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/WebSocket
                     ▼
┌────────────────────────────────────────────────────────┐
│              FastAPI Backend Server                    │
│       REST API, WebSocket, Task Coordination           │
└────────────────────┬───────────────────────────────────┘
         │           │               │
    ┌────▼──┐    ┌───▼────┐   ┌──────▼──────┐
    │ Redis │    │Celery  │   │ PostgreSQL  │
    │Broker │    │Workers │   │  Database   │
    └───────┘    └────┬───┘   └─────────────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
    ┌─────▼───┐ ┌─────▼───┐ ┌────-▼────┐
    │ Static  │ │ Dynamic │ │  Family  │
    │Analysis │ │Analysis │ │Classifier│
    └─────────┘ └────┬────┘ └──────────┘
                     │
            ┌────────▼─────────┐
            │  Cuckoo Sandbox  │
            │  (Windows VMs)   │
            └──────────────────┘
```

### Analysis Pipeline

```
Upload → Static (1s) → Dynamic (2-3 min) → Family (1s) → Results
  ↓         ↓              ↓                    ↓
 33%       50%            66%                 100%
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **Socket.IO** - WebSocket communication
- **Vite** - Build tool

### Backend (PENDING)
- **FastAPI** - Web framework (Python)
- **Celery** - Distributed task queue
- **Redis** - Message broker & caching
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **pefile** - PE file parsing
- **LIEF** - Binary format library

### Machine Learning
- **scikit-learn** - Static analysis ML
- **LightGBM** - Feature importance
- **TensorFlow/Keras** - LSTM for dynamic analysis
- **NumPy/Pandas** - Data processing

### Sandbox & Analysis
- **Cuckoo Sandbox 3.0** - Dynamic malware analysis
- **VirtualBox/VMware** - Hypervisor
- **Windows 10** - Guest OS for execution

---

## 📦 Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+) or Windows with WSL2
- **RAM**: Minimum 16GB (32GB recommended)
- **Storage**: 100GB+ for VMs and analysis data
- **CPU**: 8+ cores recommended

### Software Requirements
- **Python 3.9+**
- **Node.js 16+**
- **Docker & Docker Compose**
- **Cuckoo Sandbox 3.0**
- **VirtualBox 6.1+** or **VMware**

### Docker
```bash
docker --version  # v20.10+
docker-compose --version  # v2.0+
```

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ransom-guard.git
cd ransom-guard
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL=postgresql://admin:password@postgres:5432/ransomware_db
REDIS_URL=redis://redis:6379/0

# Cuckoo Sandbox
CUCKOO_API=http://cuckoo:8090

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_MAX_SIZE=104857600  # 100MB
UPLOAD_DIR=/app/uploads

# ML Models
ML_MODELS_DIR=/app/ml_models
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 5. Setup Cuckoo Sandbox

Follow the [Cuckoo Installation Guide](https://cuckoo.sh/):

```bash
# Install Cuckoo
pip install cuckoo

# Setup analysis environment
cuckoo community

# Configure Windows VMs
# Add 2-3 Windows 10 VMs with snapshot

# Start Cuckoo
cuckoo daemon
```

### 6. Start Services with Docker

```bash
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f backend
```

### 7. Initialize Database

```bash
docker-compose exec backend alembic upgrade head
```

### 8. Train ML Models

```bash
docker-compose exec backend python scripts/train_models.py
```

### 9. Access Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## ⚙️ Configuration

### Backend Configuration (`backend/.env`)

```python
# Logging
LOG_LEVEL=INFO
LOG_FILE=/app/logs/app.log

# Analysis Settings
STATIC_TIMEOUT=60  # seconds
DYNAMIC_TIMEOUT=180  # seconds
FAMILY_TIMEOUT=30  # seconds

# Cuckoo Settings
CUCKOO_TIMEOUT=300  # seconds
CUCKOO_POLL_INTERVAL=5  # seconds
CUCKOO_MEMORY_DUMP=yes
```

### Frontend Configuration (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

### Docker Compose Override

Create `docker-compose.prod.yml` for production:

```yaml
version: '3.8'
services:
  backend:
    environment:
      - LOG_LEVEL=WARNING
      - WORKERS=4
    restart: always
```

---

## 💻 Usage

### Basic Workflow

1. **Open Application**
   ```
   http://localhost:3000
   ```

2. **Upload File**
   - Click "Choose file" or drag-and-drop
   - Supported formats: `.exe`, `.dll`, `.zip`, `.bin`, `.doc`, `.pdf`
   - Max size: 100 MB

3. **Start Analysis**
   - Click "Start Analysis" button
   - Watch real-time progress updates

4. **Review Results**
   - View verdict (Malicious/Suspicious/Clean)
   - Check confidence score
   - Examine behavioral indicators
   - View IOCs (Indicators of Compromise)

5. **Download Report**
   - Click "Download Report" for full analysis

### API Usage

#### Upload File

```bash
curl -X POST http://localhost:8000/api/upload \
  -F "file=@malware.exe"
```

Response:
```json
{
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "malware.exe",
  "status": "analysis_started"
}
```

#### Check Status

```bash
curl http://localhost:8000/api/status/550e8400-e29b-41d4-a716-446655440000
```

#### Get Results

```bash
curl http://localhost:8000/api/result/550e8400-e29b-41d4-a716-446655440000
```

#### WebSocket Connection

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/550e8400-e29b-41d4-a716-446655440000');

ws.onmessage = (event) => {
  console.log('Update:', JSON.parse(event.data));
};
```

---

## 📁 Project Structure

```
ransom-guard/
├── frontend/                          # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.tsx
│   │   │   ├── AnalysisProgress.tsx
│   │   │   ├── ResultsPanel.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── websocket.ts
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                           # FastAPI application
│   ├── app/
│   │   ├── main.py                   # Main FastAPI app
│   │   ├── models/
│   │   │   └── task.py               # Database models
│   │   ├── workers/
│   │   │   ├── static_worker.py      # Static analysis
│   │   │   ├── dynamic_worker.py     # Dynamic analysis
│   │   │   └── family_worker.py      # Family classification
│   │   ├── services/
│   │   │   ├── static_analysis.py
│   │   │   ├── dynamic_analysis.py
│   │   │   ├── cuckoo_client.py
│   │   │   ├── behavioral_features.py
│   │   │   └── family_classifier.py
│   │   ├── ml_models/
│   │   │   ├── static_model.pkl
│   │   │   ├── dynamic_model.h5
│   │   │   └── family_model.pkl
│   │   └── core/
│   │       ├── config.py
│   │       ├── database.py
│   │       └── celery_app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── ml_training/                       # ML Model Training
│   ├── train_static_model.py
│   ├── train_dynamic_model.py
│   ├── train_family_classifier.py
│   └── datasets/
│
├── scripts/                           # Utility scripts
│   ├── train_models.py
│   ├── setup_cuckoo.sh
│   └── test_platform.py
│
├── docker-compose.yml                 # Docker orchestration
├── docker-compose.prod.yml            # Production config
├── .env.example                       # Environment template
├── README.md                          # This file
└── LICENSE
```

---

## 📚 API Documentation

### Endpoints

#### File Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload file for analysis |
| GET | `/api/status/{task_id}` | Get analysis status |
| GET | `/api/result/{task_id}` | Get analysis results |
| DELETE | `/api/task/{task_id}` | Cancel analysis |

#### WebSocket

| Endpoint | Description |
|----------|-------------|
| `WS /ws/{task_id}` | Real-time analysis updates |

#### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/metrics` | Prometheus metrics |
| GET | `/docs` | Swagger UI documentation |

### Response Schema

#### Upload Response
```json
{
  "task_id": "string (UUID)",
  "filename": "string",
  "status": "analysis_started"
}
```

#### Analysis Result
```json
{
  "task_id": "string",
  "file_name": "string",
  "verdict": "malicious | suspicious | clean",
  "confidence": 0.95,
  "is_ransomware": true,
  "ransomware_family": "WannaCry",
  "family_confidence": 0.92,
  "static_analysis": {
    "score": 85,
    "suspicious_features": ["High entropy", "Crypto imports"]
  },
  "dynamic_analysis": {
    "score": 92,
    "behavioral_indicators": ["File encryption", "Registry persistence"]
  },
  "iocs": {
    "file_hashes": ["sha256_hash"],
    "network_ips": ["192.168.1.100"],
    "domains": ["malicious.com"]
  },
  "timeline": [],
  "recommendation": "string",
  "analysis_time": 180.5
}
```

---

## 🔍 Ransomware Families

Detectable families include:

| Family | Characteristics | Spread Method |
|--------|-----------------|----------------|
| **WannaCry** | SMB exploit, .wncry extension | EternalBlue, Network worms |
| **Ryuk** | Enterprise targeting, Shadow copy deletion | Manual, Affiliate-based |
| **Cerber** | Audio ransom note, Tor payment | Malicious ads, Exploit kits |
| **Locky** | Office macro delivery, Multiple extensions | Spam email, Infected sites |
| **GandCrab** | RaaS platform, Frequent updates | Exploit kits, Drive-by downloads |
| **REvil** | Double extortion, Data theft | Affiliate networks, MSP targeting |
| **Maze** | Data leak site, Double extortion | Targeted attacks |
| **Conti** | Fast multi-threaded encryption | Targeted attacks, VPN exploitation |

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests
cd ../frontend
npm test
```

### Integration Testing

```bash
python scripts/test_platform.py
```

### Load Testing

```bash
# Use Apache Bench
ab -n 1000 -c 10 http://localhost:8000/health

# Use wrk
wrk -t4 -c100 -d30s http://localhost:8000/health
```

---

## 🔐 Security Considerations

### Best Practices

1. **File Upload**
   - Validate file types and sizes
   - Store in isolated directories
   - Use virus scanning before analysis

2. **Cuckoo Sandbox**
   - Run on isolated network segment
   - Use snapshots for fast reset
   - Regular VM maintenance

3. **API Security**
   - Implement rate limiting
   - Use API keys for authentication
   - Enable HTTPS in production

4. **Database**
   - Encrypt sensitive data
   - Regular backups
   - Access controls

5. **Deployment**
   - Use environment variables for secrets
   - Enable SELinux/AppArmor
   - Monitor system resources

---

## 📊 Performance Optimization

### Recommended Settings

```yaml
# For high-volume analysis
CELERY_WORKERS: 4-8
DB_POOL_SIZE: 20
REDIS_MAXMEMORY: 2GB
CUCKOO_MACHINES: 5-10
```

### Monitoring

```bash
# Monitor Celery tasks
celery -A app.core.celery_app events

# Monitor system resources
docker stats

# View API metrics
curl http://localhost:8000/metrics
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Cuckoo analysis timeout
```bash
# Solution: Increase timeout in .env
DYNAMIC_TIMEOUT=300  # 5 minutes
```

**Issue**: Out of memory
```bash
# Solution: Reduce concurrent workers
CELERY_WORKERS=2
```

**Issue**: Database connection error
```bash
# Solution: Check PostgreSQL
docker-compose logs postgres
docker-compose restart postgres
```

**Issue**: WebSocket connection fails
```bash
# Solution: Check CORS configuration
# Verify frontend URL matches backend CORS settings
```

---

## 📝 Logging

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend

# Real-time logs
docker-compose logs -f backend
```

### Log Levels

Set in `.env`:
```
LOG_LEVEL=DEBUG    # Detailed logging
LOG_LEVEL=INFO     # General information
LOG_LEVEL=WARNING  # Warnings
LOG_LEVEL=ERROR    # Errors only
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Setup

```bash
# Install dev dependencies
pip install -r backend/requirements-dev.txt
npm install --save-dev (frontend)

# Pre-commit hooks
pre-commit install

# Run linting
black backend/
eslint frontend/src
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

### Getting Help

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ransom-guard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ransom-guard/discussions)
- **Email**: support@ransom-guard.dev

### Resources

- [Cuckoo Sandbox Documentation](https://cuckoo.sh/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [OWASP Malware Analysis](https://owasp.org/www-community/attacks/malware)

---

## 🙏 Acknowledgments

- Cuckoo Sandbox team for malware analysis framework
- YARA team for malware detection
- Open-source community contributors

---

## 📈 Roadmap

- [ ] Multi-file batch analysis
- [ ] YARA rule integration
- [ ] Timeline visualization
- [ ] Threat intelligence feeds
- [ ] Custom ML model training
- [ ] Mobile app
- [ ] Enterprise dashboard
- [ ] API rate limiting tiers

---

## 📅 Changelog

### Version 1.0.0 (2024-01-XX)
- Initial release
- Static analysis support
- Dynamic analysis with Cuckoo
- Ransomware family classification
- Real-time progress tracking
- IOC extraction

---

**Last Updated**: January 2024  
**Maintainer**: https://github.com/rajeev-cyber
