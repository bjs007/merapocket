# Financial Assessment Frontend

A React-based frontend application for financial health assessment. Built with modern technologies including React 18, TypeScript, Vite, TailwindCSS, and Radix UI components.

## Features

- 🏦 **Financial Assessment Form**: Comprehensive form with basic and advanced financial information
- 🌍 **Location Support**: Cascading dropdowns for 10 major countries with states and cities
- 📊 **Real-time Results**: Display financial scores and personalized advice
- 🎨 **Modern UI**: Beautiful interface with TailwindCSS and Radix UI components
- 📱 **Responsive Design**: Works perfectly on all screen sizes
- ⚡ **Fast Development**: Vite for lightning-fast development experience

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Radix UI** for accessible components
- **React Query** for API state management
- **React Router** for navigation
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Backend API running on port 5000 (see backend project)

### Installation

1. Clone and install dependencies:
```bash
cd financial-assessment-frontend
pnpm install
```

2. Copy environment file and configure:
```bash
cp .env.example .env
```

3. Start development server:
```bash
pnpm dev
```

The frontend will start on `http://localhost:3000`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format.fix` - Format code with Prettier

## Project Structure

```
src/
├── components/ui/     # Radix UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
├── types/            # TypeScript type definitions
├── App.tsx           # Main app component
└── global.css        # Global styles and Tailwind imports
```

## API Integration

The frontend communicates with the backend API for financial assessments:

- `POST /api/financial-assessment` - Submit financial data and get assessment results

The API URL is configured via the `VITE_API_URL` environment variable (defaults to `http://localhost:5000`).

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
VITE_API_URL=http://localhost:5000
```

## Building for Production

```bash
pnpm build
```

This creates a `dist` folder with optimized static files ready for deployment.

## Deployment

The built frontend can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your Git repository
- **AWS S3**: Upload static files to S3 bucket
- **GitHub Pages**: Use GitHub Actions to deploy

Make sure to update the `VITE_API_URL` to point to your production backend.
