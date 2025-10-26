# Parkeoya - Parking Search & Reservation App

A React Native mobile application for searching parking locations on Google Maps and making reservations.

## Features

- 🗺️ **Google Maps Integration**: View parking locations on an interactive map
- 🔍 **Search Functionality**: Search for parking spots by name or address
- 📍 **Location-based Search**: Find nearby parking spots
- 📋 **Parking Details**: View detailed information including:
  - Available spots
  - Pricing per hour
  - Features (covered, security, EV charging, etc.)
  - User ratings
- 🎫 **Reservation System**: Book parking spots with customizable duration
- 📱 **My Reservations**: View and manage your parking reservations
- ❌ **Cancel Reservations**: Cancel bookings when needed

## Tech Stack

- **React Native** 0.72.6
- **React Navigation** for screen navigation
- **React Native Maps** for Google Maps integration
- **AsyncStorage** for local data persistence

## Prerequisites

- Node.js >= 16
- npm or yarn
- For iOS development:
  - Xcode 14 or later
  - CocoaPods
- For Android development:
  - Android Studio
  - Android SDK
  - JDK 11 or later

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Lorem-Ipsum-UPC/parkeoya-appmobil.git
cd parkeoya-appmobil
```

2. Install dependencies:
```bash
npm install
```

3. For iOS, install pods:
```bash
cd ios
pod install
cd ..
```

4. Set up Google Maps API Key:
   - Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Google Maps API key:
     ```
     GOOGLE_MAPS_API_KEY=your_actual_api_key_here
     ```
   - For Android: The AndroidManifest.xml already uses `${GOOGLE_MAPS_API_KEY}` placeholder
   - For iOS: Update `ios/parkeoya/Info.plist` (add before closing `</dict>`):
     ```xml
     <key>GMSApiKey</key>
     <string>YOUR_GOOGLE_MAPS_API_KEY</string>
     ```
   - **Note**: Never commit your `.env` file with actual API keys. It's already in `.gitignore`

## Running the App

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Start Metro Bundler (if not started automatically)
```bash
npm start
```

## Project Structure

```
parkeoya-appmobil/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ParkingCard.js
│   │   └── ReservationCard.js
│   ├── screens/           # App screens
│   │   ├── MapScreen.js
│   │   ├── ParkingDetailsScreen.js
│   │   ├── ReservationConfirmScreen.js
│   │   └── ReservationsScreen.js
│   └── services/          # Business logic and data services
│       ├── ParkingService.js
│       └── ReservationService.js
├── App.js                 # Main app component with navigation
├── index.js              # App entry point
└── android/              # Android native code
└── ios/                  # iOS native code
```

## Key Components

### MapScreen
- Displays Google Maps with parking location markers
- Search bar for filtering parking spots
- List view of available parkings
- Navigation to parking details

### ParkingDetailsScreen
- Shows detailed information about a parking location
- Displays features, availability, and pricing
- "Reserve Now" button to start booking process

### ReservationConfirmScreen
- Select reservation duration
- View pricing summary
- Confirm or cancel booking

### ReservationsScreen
- List of all reservations (active and cancelled)
- Cancel active reservations
- View reservation details with dates and times

## Data Services

### ParkingService
- Mock parking data with Barcelona locations
- Search and filter functionality
- Distance calculation for nearby parkings

### ReservationService
- Create, retrieve, and cancel reservations
- Persistent storage using AsyncStorage
- Reservation status management

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Future Enhancements

- Real-time availability updates
- Payment integration
- User authentication
- Push notifications for reservation reminders
- Navigation to parking location
- User reviews and ratings
- Favorite parking locations
- Real backend API integration

## License

MIT

## Contributors

Lorem Ipsum UPC Team