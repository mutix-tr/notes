# Apple Notes Style App

A beautiful note-taking and todo list application inspired by Apple's design language, built with React, TypeScript, and Tailwind CSS.

## Features

- **Notes Management**: Create, edit, and organize notes with categories
- **Task Management**: Add, complete, and track todos with priorities and due dates
- **Apple-inspired Design**: Clean, modern interface with subtle animations
- **Search & Filter**: Find notes and tasks quickly
- **Local Storage**: Data persists between sessions
- **Export Functionality**: Backup your data as JSON
- **Responsive Design**: Works on all devices

## Docker Deployment

### Using Docker Compose (Recommended)

1. Clone the repository
2. Run with Docker Compose:
```bash
docker-compose up -d
```

The app will be available at `http://localhost:3000`

### Using Docker directly

1. Build the image:
```bash
docker build -t apple-notes-app .
```

2. Run the container:
```bash
docker run -p 3000:80 apple-notes-app
```

### Custom Port

To run on a different port, modify the `docker-compose.yml` file:
```yaml
ports:
  - "8080:80"  # Change 8080 to your desired port
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

## Design Philosophy

This application follows Apple's design principles:
- **Clarity**: Clean typography and intuitive navigation
- **Deference**: Content-focused with subtle UI elements
- **Depth**: Layered interface with backdrop blur effects
- **Consistency**: Unified color scheme and interaction patterns

## Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Docker with Nginx