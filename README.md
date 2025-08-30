# Financial Assessment Application

A full-stack financial health assessment application separated into independent frontend and backend projects. Users can input their financial information and receive a comprehensive financial score with personalized improvement advice.

## 🏗️ Architecture

This application has been separated into two independent projects:

- **Frontend**: React SPA with modern UI components
- **Backend**: Express.js REST API with financial calculation algorithms

## 📁 Project Structure

```
.
├── financial-assessment-frontend/    # React frontend application
│   ├── src/
│   │   ├── components/ui/            # Radix UI components
│   │   ├── pages/                    # Page components
│   │   ├── types/                    # TypeScript types
│   │   └── ...
│   ├── package.json
│   └── README.md
│
├── financial-assessment-backend/     # Express.js backend API
│   ├── src/
│   │   ├── routes/                   # API routes
│   │   ├── types/                    # TypeScript types
│   │   └── server.ts                 # Main server
│   ├── package.json
│   └── README.md
│
└── README.md                         # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm package manager

### 1. Start the Backend

```bash
cd financial-assessment-backend
pnpm install
cp .env.example .env
pnpm dev
```

Backend runs on `http://localhost:5000`

### 2. Start the Frontend

```bash
cd financial-assessment-frontend
pnpm install
cp .env.example .env
pnpm dev
```

Frontend runs on `http://localhost:3000`

### 3. Open the Application

Visit `http://localhost:3000` to use the financial assessment app.

## ✨ Features

### 📊 Financial Assessment
- **Basic Information**: Profession, salary, education, assets, insurance coverage
- **Advanced Portfolio**: Investment details (land, stocks, mutual funds, gold)
- **Location Data**: Country, state/province, and city selection
- **Smart Calculations**: Comprehensive financial scoring algorithm

### 🌍 Global Support
Support for 10 major countries with cascading location dropdowns:
- China, India, United States, Indonesia, Brazil
- Russia, Nigeria, Japan, Mexico, Germany

### 🎨 Modern Interface
- **Responsive Design**: Works on all devices
- **Beautiful UI**: TailwindCSS with Radix UI components
- **Real-time Validation**: Instant feedback on form inputs
- **Loading States**: Clear progress indicators

### 🔒 Robust Backend
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Structured error responses
- **Location-Aware**: Geographic considerations in scoring
- **Scalable Architecture**: Clean separation of concerns

## 🧮 Financial Scoring System

The application evaluates multiple financial factors:

| Category | Factors | Points |
|----------|---------|--------|
| **Income** | Salary levels | 0-1.5 |
| **Insurance** | Life & Health coverage | 0-1.0 |
| **Assets** | Properties, vehicles | 0-variable |
| **Education** | Degree levels | 0-0.5 |
| **Investments** | Portfolio diversification | 0-1.0 |
| **Location** | Country economic status | 0-0.2 |
| **Dependencies** | Family obligations | -0.5 to 0 |

**Final Score**: 1.0 - 10.0 with personalized advice

## 🔄 API Communication

The frontend communicates with the backend via REST API:

```
Frontend (port 3000) → Backend API (port 5000)
                     ↓
              POST /api/financial-assessment
                     ↓
              Financial Score + Advice
```

## 🚢 Deployment

### Frontend Deployment
Deploy to static hosting services:
- **Netlify**: Automatic deployment from Git
- **Vercel**: Optimized for React applications
- **AWS S3 + CloudFront**: Scalable static hosting

### Backend Deployment
Deploy to cloud platforms:
- **Railway**: Simple Git-based deployment
- **Heroku**: Container or Git deployment
- **DigitalOcean App Platform**: Managed deployment
- **AWS EC2**: Custom server deployment

## 🛠️ Development

### Adding New Features

1. **Frontend Changes**: Navigate to `financial-assessment-frontend/`
2. **Backend Changes**: Navigate to `financial-assessment-backend/`
3. **Shared Types**: Update types in both projects' `src/types/api.ts`

### Testing

```bash
# Frontend tests
cd financial-assessment-frontend
pnpm test

# Backend tests  
cd financial-assessment-backend
pnpm test
```

## 📝 Environment Configuration

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```bash
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branches for frontend and backend changes
3. Make your changes in the appropriate project directory
4. Test both frontend and backend independently
5. Submit pull requests

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For detailed setup and development instructions, see:
- [Frontend README](./financial-assessment-frontend/README.md)
- [Backend README](./financial-assessment-backend/README.md)

---

**Happy Coding! 🚀**
