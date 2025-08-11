# Timshee E-commerce Platform - Refactored

## Overview

This is a completely refactored version of the Timshee e-commerce platform, following modern software architecture principles and best practices.

## Project Structure

```
timshee/
├── refactored/                 # New refactored codebase
│   ├── backend/               # Django REST API
│   │   ├── src/
│   │   │   ├── apps/          # Django applications
│   │   │   │   ├── authentication/  # User auth & profiles
│   │   │   │   ├── catalog/         # Product catalog
│   │   │   │   ├── shopping/        # Shopping cart
│   │   │   │   ├── orders/          # Order management
│   │   │   │   ├── payments/        # Payment processing
│   │   │   │   ├── users/           # User management
│   │   │   │   └── notifications/   # Email & notifications
│   │   │   ├── api/           # Shared API utilities
│   │   │   ├── core/          # Django settings & config
│   │   │   ├── services/      # Business logic services
│   │   │   └── utils/         # Shared utilities
│   │   ├── manage.py
│   │   └── requirements.txt
│   └── frontend/              # Next.js application
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── next.config.js
├── legacy/                    # Old Docker configurations
└── backend/                   # Original backend (to be deprecated)
```

## Key Improvements

### 1. Smart Code Splitting
- **Modular Apps**: Split functionality into focused Django apps
- **Service Layer**: Business logic separated from views
- **Shared Utilities**: DRY principles with reusable components
- **API Layer**: Common base classes and utilities

### 2. DRY Principles Applied
- **Base Model Mixins**: Timestamp, UUID, UserSession mixins
- **Base ViewSets**: Common functionality extracted
- **Shared Serializers**: Reusable serializer components
- **Utility Functions**: Common helpers and validators

### 3. Modern Architecture
- **Django REST Framework**: Clean API design
- **JWT Authentication**: Secure token-based auth
- **Service Pattern**: Business logic separation
- **Middleware**: Custom middleware for cart merging

### 4. Next.js Frontend
- **Server-Side Rendering**: Better SEO and performance
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Redux Toolkit**: State management

## Applications

### Authentication (`src.apps.authentication`)
- User registration, login, logout
- JWT token management
- User profiles and preferences
- Dynamic application settings

### Catalog (`src.apps.catalog`)
- Product management
- Collections and categories
- Product variants (size, color)
- Wishlist functionality
- Currency rates

### Shopping (`src.apps.shopping`)
- Shopping cart management
- Cart persistence for anonymous users
- Cart merging on login
- Stock validation

### Orders (`src.apps.orders`)
- Order processing
- Shipping addresses
- Order status tracking
- Return management

### Payments (`src.apps.payments`)
- Payment processing
- Payment method management
- Transaction tracking

### Users (`src.apps.users`)
- User profile management
- Address book
- Order history

### Notifications (`src.apps.notifications`)
- Email templates
- Notification sending
- MJML email templates

## Key Features

### Backend
- **RESTful API**: Clean, consistent API design
- **JWT Authentication**: Secure token-based authentication
- **Cart Persistence**: Carts persist across sessions
- **Internationalization**: Multi-language support
- **Image Management**: Optimized image handling
- **Admin Interface**: Django admin for content management

### Frontend (Next.js)
- **Server-Side Rendering**: Better performance and SEO
- **TypeScript**: Type safety and better DX
- **Responsive Design**: Mobile-first approach
- **Internationalization**: Multi-language support
- **State Management**: Redux Toolkit for complex state

## Migration Guide

### From Old Backend
1. Data migration scripts will be provided
2. API endpoints maintain backward compatibility
3. Gradual migration path available

### Environment Setup
```bash
# Backend
cd refactored/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Frontend
cd refactored/frontend
npm install
npm run dev
```

## Configuration

### Environment Variables
Create `.env` files in both backend and frontend directories:

#### Backend (.env)
```
DJANGO_SECRET_KEY=your-secret-key
DJANGO_SETTINGS_DEBUG_MODE=1
POSTGRES_DB_NAME=timshee
POSTGRES_DB_USER=postgres
POSTGRES_DB_PASSWORD=password
POSTGRES_DB_HOST=localhost
POSTGRES_DB_PORT=5432
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email
EMAIL_HOST_PASSWORD=your-password
MJML_APP_ID=your-mjml-app-id
MJML_SECRET_KEY=your-mjml-secret
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## Deprecated Features

### Docker Support
- All Docker configurations moved to `legacy/` folder
- Docker support is deprecated in favor of:
  - Native development environment
  - Cloud deployment solutions
  - Container orchestration platforms

### Legacy Backend
- Original backend code remains for reference
- Will be gradually phased out
- Migration scripts provided for data transfer

## Development Workflow

1. **Backend Development**
   ```bash
   cd refactored/backend
   python manage.py runserver
   ```

2. **Frontend Development**
   ```bash
   cd refactored/frontend
   npm run dev
   ```

3. **API Documentation**
   - Available at `/admin/` for Django admin
   - API endpoints documented in code
   - Postman collection available

## Testing

### Backend
```bash
cd refactored/backend
python manage.py test
```

### Frontend
```bash
cd refactored/frontend
npm test
```

## Deployment

### Backend
- Use Gunicorn/uWSGI for production
- PostgreSQL database required
- Static files served via CDN/nginx

### Frontend
- Vercel (recommended)
- Netlify
- AWS Amplify
- Custom Next.js deployment

## Contributing

1. Follow the established app structure
2. Use the provided base classes and mixins
3. Write tests for new functionality
4. Update documentation

## License

[Your License Here]
