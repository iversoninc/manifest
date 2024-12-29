# Proposal Generator

A modern web application built with Next.js for creating and managing professional business proposals.

## Features

- Create and manage multiple proposals
- Dark-themed modern interface
- PDF generation for downloadable proposals
- Local storage persistence
- Customizable proposal sections:
  - Client information
  - Project context
  - Timeline
  - Process description
  - Optional termination clauses
  - Copyright statements
  - Deliverables management

## Technology Stack

- Next.js 14.2
- React 18
- TypeScript
- @react-pdf/renderer for PDF generation

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   Note: The `--legacy-peer-deps` flag is required to resolve dependency conflicts.

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

To create a production build:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Project Structure

- `/pages` - Application routes and pages
- `/components` - Reusable React components
- `/assets` - Static assets
- `/public` - Publicly accessible files
- `/styles` - CSS and styling files

## Data Storage

The application uses browser's localStorage for data persistence. Proposals are automatically saved and can be accessed across browser sessions.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run linting checks

## License

This project is private and not licensed for public use.
