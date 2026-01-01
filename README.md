# Freeqy Platform - Frontend Client

> **Note for Freeqy Platform Engineers:** This is the frontend client application. For the full development experience, ensure that both the **backend API** and **AI service** repositories are installed and running alongside this frontend application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn** or **pnpm**
- **Git**

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
   or
   ```bash
   pnpm install
   ```

## Environment Setup

1. **Create a `.env` file** in the root directory (if it doesn't exist)

2. **Configure environment variables**:

   ```env
   VITE_API_BASE_URL=https://localhost:7226/api/v1
   VITE_APP_NAME=Freeqy
   VITE_APP_VERSION=1.0.0
   VITE_ENABLE_DEVTOOLS=true
   ```

   **Note:** Update `VITE_API_BASE_URL` to match your backend API URL.

## Running the Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

## Building for Production

Build the project for production:

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── services/       # API service functions
├── types/          # TypeScript type definitions
├── lib/            # Utility functions and configurations
├── contexts/        # React contexts (Auth, etc.)
└── routes/         # Route configuration
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Sonner** - Toast notifications

## Required Services

### Backend API

The backend API repository must be installed and running for the frontend to function properly. Make sure your backend API is running and accessible at the URL specified in `VITE_API_BASE_URL`.

The application expects the backend to be running on `https://localhost:7226/api/v1` by default (for development).

### AI Service

The AI service repository should also be installed and running for the full platform experience. Some features may depend on the AI service being available.

**Important:** Without both the backend API and AI service running, you may experience incomplete functionality or errors when using certain features.

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual port.

### API Connection Issues

- Verify that your backend server is running
- Check that `VITE_API_BASE_URL` in your `.env` file matches your backend URL
- Ensure CORS is properly configured on your backend

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check TypeScript errors: `npm run build`

## License

[Still in Processing]
