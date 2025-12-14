# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite. This project showcases professional experience, technical skills, and expertise through an interactive interface with multi-language support (English/Spanish).

## Features

- **Multi-language Support**: Toggle between English and Spanish
- **Interactive Tech Radar**: Visual representation of technical skills and expertise
- **Experience Timeline**: Chronological display of professional experience
- **Live CV Modal**: Interactive curriculum vitae viewer
- **Responsive Design**: Optimized for all device sizes
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router
- **State Management**: React Context API
- **Data Fetching**: TanStack Query

## Local Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Portafolio
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:8080`

The development server will automatically reload when you make changes to the code.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Automatic Deployment on Vercel

This project is configured for automatic deployment on Vercel. The deployment process works as follows:

1. **Automatic Detection**: Vercel automatically detects this as a Vite project and configures the build settings accordingly.

2. **Build Configuration**:

   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deployment Triggers**:

   - **Push to main branch**: Automatically deploys to production
   - **Pull Requests**: Creates preview deployments for each PR
   - **Manual Deploy**: Can be triggered from the Vercel dashboard

4. **Environment**: Vercel automatically handles:

   - Node.js version detection
   - Dependency installation
   - Build optimization
   - CDN distribution

5. **Custom Domain**: If configured, Vercel automatically provisions SSL certificates and handles DNS configuration.

To set up Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect the framework and configure build settings
3. Deployments will happen automatically on every push to the main branch

## Additional Considerations

### Project Structure

```
src/
├── components/     # React components (UI, sections, etc.)
├── contexts/       # React Context providers
├── data/          # Static data (CV data, etc.)
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── pages/         # Page components
└── main.tsx       # Application entry point
```

### Data Management

- CV and portfolio data is stored in `src/data/cvData.json`
- The application uses React Context for language state management
- All text content supports both English and Spanish

### Browser Support

This project targets modern browsers that support ES6+ features. For production use, consider adding polyfills if you need to support older browsers.

### Performance

- Code splitting is handled automatically by Vite
- Images and assets are optimized during the build process
- The production build is minified and optimized for performance

## Contact

If you have any questions about this repository or its content, please feel free to reach out:

**Email**: felipe.gomez.quezada@gmail.com

---

Built with ❤️ using React, TypeScript, and Vite
