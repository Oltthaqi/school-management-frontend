# School Management System - Frontend

A modern Vue.js 3 frontend application for the School Management System with role-based access control and responsive design.

## Technology Stack

- **Framework**: Vue 3 with Composition API
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **UI Components**: Headless UI
- **Build Tool**: Vite
- **Language**: TypeScript

## Features

- Modern, responsive design with Tailwind CSS
- Role-based navigation and access control
- JWT authentication with automatic token management
- Real-time form validation
- Modal dialogs and interactive components
- Dark mode support (configurable)
- Mobile-first responsive design

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (AppLayout, Navbar, Sidebar)
│   └── ui/              # Reusable UI components (Modal, Button, etc.)
├── router/              # Vue Router configuration
├── services/            # API service layer
├── stores/              # Pinia stores for state management
├── types/               # TypeScript type definitions
├── views/               # Page components
├── App.vue              # Root component
├── main.ts              # Application entry point
└── style.css            # Global styles and Tailwind imports
```

## Setup Instructions

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the frontend folder
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## User Roles & Access

### Admin Users
- Full access to all features
- Can manage students, teachers, courses, enrollments, grades, and admissions
- Access to all navigation items

### Teacher Users
- Can view students and courses
- Can manage grades for their assigned courses
- Limited administrative access

### Student Users
- Can view their own information
- Can see their enrollments and grades
- Read-only access to most features

## Key Features

### Authentication
- Login and registration forms with validation
- JWT token management with automatic refresh
- Persistent login state across browser sessions
- Automatic logout on token expiration

### Dashboard
- Role-specific dashboard with relevant statistics
- Quick access to recent activities
- Overview cards showing key metrics

### Student Management
- Complete CRUD operations for students (Admin only)
- Student profile views with detailed information
- Search and filter capabilities

### Course Management
- Course listing with teacher information
- Course creation and editing (Admin/Teacher)
- Credit hour tracking and descriptions

### Grade Management
- Grade entry and editing for teachers
- Student grade viewing
- Letter grade calculation and display

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface elements
- Collapsible navigation for mobile

## Component Architecture

### Layout Components
- `AppLayout.vue` - Main application layout with sidebar and navigation
- Responsive sidebar with role-based menu items
- Header with user information and logout functionality

### UI Components
- `Modal.vue` - Reusable modal dialog component
- Form components with validation
- Data tables with sorting and pagination
- Loading states and error handling

### State Management
- `authStore` - User authentication and authorization
- Entity-specific stores for data management
- Reactive state updates across components

## Styling

The application uses Tailwind CSS with custom configurations:

### Color Palette
- Primary: Blue tones for main actions
- Success: Green for positive actions
- Warning: Yellow for cautions
- Error: Red for errors and deletions

### Typography
- Font: Inter (Google Fonts)
- Responsive font sizes
- Proper line heights for readability

### Animations
- Smooth transitions for interactions
- Hover effects on interactive elements
- Loading animations for async operations

## API Integration

### Service Layer
- Centralized API configuration with Axios
- Automatic JWT token attachment
- Response interceptors for error handling
- Request/response type safety with TypeScript

### Error Handling
- Global error handling for API requests
- User-friendly error messages
- Automatic token refresh on 401 errors
- Network error detection and retry logic

## Development Guidelines

### Code Style
- Use Composition API with `<script setup>`
- TypeScript for type safety
- Reactive references with `ref()` and `reactive()`
- Computed properties for derived state

### Component Guidelines
- Single responsibility principle
- Props validation with TypeScript
- Emit events for parent communication
- Proper component lifecycle management

### State Management
- Use Pinia stores for shared state
- Keep component state local when possible
- Actions for async operations
- Getters for computed state

## Building for Production

1. Build the application:
```bash
npm run build
```

2. The built files will be in the `dist/` directory
3. Deploy to your preferred hosting service (Netlify, Vercel, etc.)

### Environment Variables for Production

Set the following environment variables in your production environment:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimizations

- Code splitting with Vue Router
- Lazy loading of components
- Optimized bundle size with Vite
- Tree shaking for unused code elimination
- Image optimization and lazy loading

## Accessibility

- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast color ratios
- Focus management in modals

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new features
3. Include responsive design considerations
4. Test across different user roles
5. Update documentation for new features