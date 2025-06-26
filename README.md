# eProBlock - Blockchain-Based Procurement System

A modern, professional procurement management system built with Vue 3, TypeScript, and blockchain technology. This application provides a comprehensive solution for managing procurement requests, offers, and transactions with enhanced security and transparency through blockchain integration.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure login/register with role-based access
- **Procurement Request Management** - Create, view, and manage procurement requests
- **Offer Management** - Submit and manage offers for procurement requests
- **Transaction Tracking** - Complete transaction lifecycle management
- **Blockchain Integration** - Transparent and secure transaction recording
- **Real-time Notifications** - Stay updated with system notifications

### Technical Features
- **Modern Vue 3 Architecture** - Composition API with TypeScript
- **Professional UI/UX** - Clean, responsive design with Tailwind CSS
- **Modular Component System** - Reusable, maintainable components
- **Comprehensive State Management** - Pinia stores with proper error handling
- **Type Safety** - Full TypeScript implementation
- **API Service Layer** - Organized HTTP services with interceptors
- **Form Validation** - Client-side validation with custom rules
- **Error Handling** - Comprehensive error management and user feedback

## 🛠️ Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management for Vue
- **Vue Router** - Official router for Vue.js
- **Axios** - HTTP client for API requests

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vue DevTools** - Development debugging

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── ui/             # Base UI components
│   └── dashboard/      # Dashboard-specific components
├── config/             # Configuration files
├── layouts/            # Layout components
├── pages/              # Page components
├── router/             # Vue Router configuration
├── services/           # API service layer
├── stores/             # Pinia state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── views/              # Additional view components
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd procurement-frontend-cursor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_APP_NAME=eProBlock
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 🏗️ Architecture Overview

### Component Architecture
The application follows a modular component architecture:

- **Base Components** (`src/components/ui/`) - Reusable UI components
- **Feature Components** (`src/components/dashboard/`) - Feature-specific components
- **Page Components** (`src/pages/`) - Route-level components
- **Layout Components** (`src/layouts/`) - Layout wrapper components

### State Management
Uses Pinia for state management with organized stores:

- **Auth Store** - User authentication and authorization
- **Notification Store** - System notifications management

### API Layer
Organized service layer with:

- **HTTP Service** - Centralized HTTP client with interceptors
- **Feature Services** - Domain-specific API services
- **Error Handling** - Comprehensive error management

### Type Safety
Full TypeScript implementation with:

- **Interface Definitions** - Comprehensive type definitions
- **API Types** - Type-safe API responses
- **Component Props** - Typed component props and events

## 🎨 UI/UX Design

### Design System
- **Consistent Color Palette** - Professional blue-based theme
- **Typography** - Clean, readable font hierarchy
- **Spacing** - Consistent spacing using Tailwind's scale
- **Components** - Reusable, accessible components

### Responsive Design
- **Mobile-First** - Responsive design for all screen sizes
- **Touch-Friendly** - Optimized for touch interactions
- **Accessibility** - WCAG compliant design

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Route Guards** - Protected routes with authentication checks
- **Input Validation** - Client and server-side validation
- **Error Handling** - Secure error messages without data leakage

## 📱 Features by Role

### User (Buyer)
- Create procurement requests
- View and manage requests
- Review and accept offers
- Track transaction status
- View blockchain records

### Supplier
- Browse available requests
- Submit competitive offers
- Track offer status
- Manage transaction history

### Admin
- User management
- System monitoring
- Transaction oversight
- Blockchain verification

## 🔧 Configuration

### Environment Variables
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

### API Configuration
- Base URL configuration in `src/config/environment.ts`
- Request/response interceptors in `src/services/http.ts`
- Error handling and authentication

## 🧪 Testing

### Unit Testing
- Component testing with Vue Test Utils
- Service layer testing
- Utility function testing

### Integration Testing
- API integration testing
- User flow testing
- Cross-browser compatibility

## 📦 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Static Hosting** - Netlify, Vercel, GitHub Pages
- **Docker** - Containerized deployment
- **CDN** - Content delivery network integration

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 1.0.0
- Initial release with core procurement features
- Vue 3 + TypeScript implementation
- Professional UI/UX design
- Blockchain integration
- Comprehensive error handling

---

**Built with ❤️ using Vue 3, TypeScript, and modern web technologies**
