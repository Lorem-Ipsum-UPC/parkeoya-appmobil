# Authentication API Integration - ParkeoYa

## Overview
This document describes the authentication integration with the ParkeoYa backend API for the mobile application. The app is designed exclusively for **drivers** to access parking services.

## Backend API
- **Base URL**: `https://parkeoya-backend-latest-1.onrender.com`
- **API Version**: `v1`
- **Documentation**: [Swagger UI](https://parkeoya-backend-latest-1.onrender.com/swagger-ui/index.html)

## Authentication Endpoints

### 1. Driver Sign In
**Endpoint**: `POST /api/v1/authentication/sign-in`

**Request Body**:
```json
{
  "email": "driver@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "id": 1,
  "email": "driver@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "roles": ["ROLE_DRIVER"]
}
```

**Features**:
- Validates user credentials
- Returns JWT token for authenticated requests
- Verifies user has `ROLE_DRIVER` role
- Only drivers can access the mobile app

### 2. Driver Sign Up
**Endpoint**: `POST /api/v1/authentication/sign-up/driver`

**Request Body**:
```json
{
  "email": "newdriver@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "city": "Lima",
  "country": "Peru",
  "phone": "+51987654321",
  "dni": "12345678"
}
```

**Response**:
```json
{
  "id": 2,
  "email": "newdriver@example.com",
  "roles": ["ROLE_DRIVER"]
}
```

**Features**:
- Creates a new driver account
- Automatically assigns ROLE_DRIVER
- Returns user resource
- Auto-login after successful registration

### 3. Get Driver Profile
**Endpoint**: `GET /api/v1/profiles/driver/{userId}`

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "userId": 1,
  "driverId": 1,
  "fullName": "John Doe",
  "city": "Lima",
  "country": "Peru",
  "phone": "+51987654321",
  "dni": "12345678"
}
```

### 4. Update Driver Profile
**Endpoint**: `PATCH /api/v1/profiles/driver/{driverId}`

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body** (all fields optional):
```json
{
  "fullName": "John Updated Doe",
  "city": "Arequipa",
  "country": "Peru",
  "phone": "+51912345678",
  "dni": "87654321"
}
```

## Implementation

### File Structure
```
features/auth/
├── services/
│   └── authService.ts       # API service for authentication
├── types/
│   └── auth.types.ts        # TypeScript interfaces
└── utils/
    └── validation.ts        # Form validation utilities

app/(auth)/
├── sign-in.tsx              # Driver login screen
└── sign-up.tsx              # Driver registration screen

lib/
└── storage.ts               # Persistent storage with AsyncStorage
```

### Authentication Service
The `authService` provides methods for:
- `signIn()` - Authenticate driver
- `signUpDriver()` - Register new driver
- `getDriverProfile()` - Fetch driver profile
- `updateDriverProfile()` - Update driver information
- `isTokenValid()` - Validate JWT token
- `isDriver()` - Verify user has driver role

### Storage
Authentication data is persisted using `@react-native-async-storage/async-storage`:

```typescript
interface AuthData {
  user: AuthenticatedUserResource;
  driver?: DriverResource;
  expiresAt?: number;
}
```

**Methods**:
- `setAuthData()` - Save auth data
- `getAuthData()` - Retrieve auth data
- `removeAuthData()` - Clear auth data
- `clearAll()` - Clear all storage

## Usage Examples

### Sign In
```typescript
import { authService } from '@/features/auth/services/authService';
import { StorageService } from '@/lib/storage';

const handleSignIn = async () => {
  const authenticatedUser = await authService.signIn({
    email: 'driver@example.com',
    password: 'password123',
  });

  const driverProfile = await authService.getDriverProfile(
    authenticatedUser.id,
    authenticatedUser.token
  );

  await StorageService.setAuthData({
    user: authenticatedUser,
    driver: driverProfile,
  });
};
```

### Sign Up
```typescript
const handleSignUp = async () => {
  const authenticatedUser = await authService.signUpDriver({
    email: 'newdriver@example.com',
    password: 'securePass123',
    fullName: 'Jane Smith',
    city: 'Lima',
    country: 'Peru',
    phone: '+51987654321',
    dni: '87654321',
  });

  const driverProfile = await authService.getDriverProfile(
    authenticatedUser.id,
    authenticatedUser.token
  );

  await StorageService.setAuthData({
    user: authenticatedUser,
    driver: driverProfile,
  });
};
```

## Security Features

1. **Role-Based Access**: Only users with `ROLE_DRIVER` can access the app
2. **JWT Tokens**: All authenticated requests use Bearer tokens
3. **Password Validation**: Minimum 6 characters required
4. **Email Validation**: Standard email format validation
5. **Secure Storage**: Credentials stored using AsyncStorage

## Error Handling

The authentication service handles common errors:
- Invalid credentials
- Network errors
- API validation errors
- Role verification failures

All errors are caught and displayed to users with appropriate messages.

## Required Fields

### Sign Up (All Required)
- ✅ Full Name
- ✅ Email (valid format)
- ✅ Phone Number
- ✅ DNI
- ✅ City
- ✅ Country
- ✅ Password (min. 6 characters)
- ✅ Terms & Conditions agreement

### Sign In (All Required)
- ✅ Email
- ✅ Password

## Testing

To test the authentication:

1. Start the Expo development server:
```bash
npm start
```

2. Navigate to the Sign Up screen
3. Fill in all required fields
4. Create a driver account
5. Use the credentials to sign in

## Notes

- The app is **driver-only** - parking owners cannot use this mobile app
- Authentication tokens are stored securely in AsyncStorage
- The app automatically navigates to the main screen after successful authentication
- All API requests include proper error handling and loading states
