# Cylink - URL Shortener & QR Code Generator

<div align="center">
  <img src="public/logo/logo-cylink.png" alt="Cylink Logo" width="200" height="200">
  
  **A modern, secure URL shortening and QR code generation platform built by KSM Cyber Security UPNVJ**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC)](https://tailwindcss.com/)
</div>

## 📝 Short Description

**Cylink** is a modern platform for URL shortening and QR code generation developed by KSM Cyber Security UPNVJ as part of their commitment to digital independence and cybersecurity education. This platform combines practical utility with educational opportunities, allowing KSM members to learn modern web development while creating tools that strengthen their digital identity.

### 🎯 Problems Solved

- **Digital Security**: Providing a secure and trusted alternative to public URL shortening services
- **KSM Branding**: Maintaining KSM Cyber Security's visual identity in every link and QR code
- **Deep Analytics**: Providing detailed insights about link performance and user behavior
- **Technology Independence**: 100% internally developed platform to support KSM's 2025 digital vision

### 👥 Target Users

- **KSM Cyber Security UPNVJ Members**: For internal use and learning purposes
- **Cybersecurity Community**: As a secure alternative to public services
- **Web Developers**: As a reference for modern web development implementation

## 🚀 Key Features

### ✨ URL Shortening

- **Fast URL Shortening**: Convert long links into concise `cylink.id` links
- **Custom Short Codes**: Create customizable short codes
- **Expiry Management**: Set expiration dates for automatic link deactivation
- **Bulk Operations**: Manage multiple URLs simultaneously
- **URL Validation**: Security validation for every URL input

### 🎨 QR Code Generation

- **Branded QR Codes**: QR codes with KSM Cyber Security logo in the center
- **Complete Customization**:
  - Foreground and background color options
  - Adjustable logo size (0-1)
  - Multiple QR code sizes (280px - 1000px)
  - Optimal error correction level
- **Multiple Formats**: Download in high-quality PNG and SVG formats
- **Bulk Generation**: Generate QR codes for multiple URLs at once

### 📊 Analytics Dashboard

- **Real-time Tracking**: Monitor clicks and link performance in real-time
- **Geographic Analytics**: Analyze geographic distribution of visitors
- **Device & Browser Stats**: Insights about devices and browsers used
- **Time-based Analysis**: Performance charts based on time periods
- **CTR Analysis**: Click-Through Rate analysis with period comparison
- **Top Performing URLs**: Identify URLs with best performance

### 🔐 User Management

- **Secure Authentication**: JWT-based login system with cookie storage
- **Email Verification**: Email verification for account security
- **Password Recovery**: Password reset via email
- **Session Management**: Secure session management with "Remember Me" option
- **Login Tracking**: Login activity tracking for security

### 🎯 Conversion Tracking

- **User Registration Tracking**: Track user registration conversions
- **URL Creation Tracking**: Monitor new URL creation
- **QR Code Generation Tracking**: Track QR code generation
- **Click Analytics**: Deep analysis of user interactions

## 🛠️ Prerequisites

Before getting started, make sure you have installed:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ (installed with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Docker** (optional, for deployment) ([Download](https://www.docker.com/))

## 📦 Installation

### 1. Clone Repository

```bash
# Clone this repository
git clone https://github.com/your-username/frontend-cylink.git

# Navigate to project directory
cd frontend-cylink
```

### 2. Install Dependencies

```bash
# Install all required dependencies
npm install
```

### 3. Environment Configuration

```bash
# Create environment file from template
cp .env.example .env.local

# Edit .env.local with appropriate configuration
# Make sure to set:
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_POSTHOG_KEY
# - NEXT_PUBLIC_POSTHOG_HOST
```

## 🚀 Usage

### Development Mode

```bash
# Run the application in development mode
npm run dev

# Application will be available at http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Run production server
npm run start
```

### Linting & Code Quality

```bash
# Run ESLint
npm run lint
```

## 🐳 Docker Deployment

### Development Environment

```bash
# Run with Docker Compose
docker-compose up -d

# Application will be available at configured port
```

### Staging Environment

```bash
# Deploy to staging
docker-compose -f docker-compose.staging.yml up -d
```

### Production Environment

```bash
# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

## 🏗️ Directory Structure

```
frontend-cylink/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── login/             # Authentication pages
│   │   └── [shortCode]/       # URL redirect handler
│   ├── components/            # React components
│   │   ├── atoms/             # Basic UI components
│   │   ├── molecules/         # Composite components
│   │   ├── organisms/         # Complex components
│   │   └── templates/         # Page templates
│   ├── hooks/                 # Custom React hooks
│   ├── interfaces/            # TypeScript interfaces
│   ├── services/              # API services
│   ├── utils/                 # Utility functions
│   └── contexts/              # React contexts
├── docker/                    # Docker configuration
├── _changelog/               # Changelog files
└── public/                   # Static assets
```

## 🛡️ Security

- **JWT Authentication**: Secure JWT-based authentication system
- **URL Validation**: Security validation for every URL input
- **CORS Protection**: Proper CORS configuration
- **Input Sanitization**: Input sanitization to prevent XSS
- **Rate Limiting**: Rate limiting to prevent abuse

## 📈 Roadmap

### Version 1.3.0 (Q3 2025)

- [ ] Advanced Analytics Dashboard
- [ ] Bulk URL Management
- [ ] API Rate Limiting
- [ ] Custom Domain Support

### Version 1.4.0 (Q4 2025)

- [ ] Team Collaboration Features
- [ ] Advanced QR Code Templates
- [ ] Webhook Integration
- [ ] Mobile App

## 🤝 Contributing

We welcome contributions from the community! Here's how to contribute:

1. **Fork** this repository
2. **Create a branch** for new features (`git checkout -b new-feature`)
3. **Commit** your changes (`git commit -m 'Add new feature'`)
4. **Push** to the branch (`git push origin new-feature`)
5. **Create a Pull Request**

### Contribution Guidelines

- Follow existing code conventions
- Write tests for new features
- Update documentation if needed
- Ensure all tests pass

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits and Acknowledgments

### Development Team

- **KSM Cyber Security UPNVJ** - Development organization
- **CyLink Development Team** - Core development team

### Technologies Used

- **Next.js** - React framework for production
- **React** - UI library for interactive components
- **TypeScript** - Type safety and developer experience
- **TailwindCSS** - Utility-first CSS framework
- **Visx** - Data visualization library
- **PostHog** - Product analytics platform

### Third-Party Libraries

- **QRCode.js** - QR code generation
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Framer Motion** - Animation library

## 📞 Contact & Support

- **Website**: [KSM Cyber Security UPNVJ](https://ksm.upnvj.ac.id)
- **Email**: ksm@upnvj.ac.id
- **GitHub Issues**: [Report Bug](https://github.com/your-username/frontend-cylink/issues)

---

<div align="center">
  <p>Made with ❤️ by <strong>KSM Cyber Security UPNVJ</strong></p>
  <p>Supporting Indonesia's digital independence 🇮🇩</p>
</div>
