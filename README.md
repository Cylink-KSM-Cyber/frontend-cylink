# Cylink - URL Shortener & QR Code Generator

A modern web application for URL shortening and QR code generation with analytics and management features.

## Technologies Used

- **Frontend Framework**: Next.js 15.3.0
- **UI Library**: React 19.0.0
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Data Visualization**: Visx for analytics charts
- **Authentication**: JWT-based with Cookie storage
- **QR Code**: QRCode.js and react-qr-code
- **Styling**: TailwindCSS
- **TypeScript**: 5.x

## Quick Start

1. Clone the repository from the internal Git server
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (refer to `.env.example` or internal documentation)
4. Run the development server:
   ```bash
   npm run dev
   ```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Key Features

- **URL Shortening**: Create and manage shortened URLs
- **QR Code Generation**: Generate customizable QR codes for URLs
- **Analytics Dashboard**: Track URL performance with click metrics
- **User Authentication**: Secure login system
- **URL Management**: Activate/deactivate URLs, delete URLs
- **QR Code Customization**: Colors, logo inclusion, and style options

## Deployment

Refer to the internal deployment documentation for detailed instructions on deploying to development, staging, and production environments.

Basic deployment can be done using Docker Compose:

```bash
# Development
docker-compose up -d

# Staging
docker-compose -f docker-compose.staging.yml up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## Documentation

For more detailed information, please refer to:

- [Internal API Documentation](link-to-internal-docs)
- [Deployment Guide](link-to-internal-deployment-guide)
- [Architecture Overview](link-to-architecture-docs)

## Contact

For questions and support, please contact the development team through internal channels.
