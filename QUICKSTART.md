# Quick Start Guide

## Installation

```bash
# Clone the repository
git clone https://github.com/Lorem-Ipsum-UPC/parkeoya-appmobil.git
cd parkeoya-appmobil

# Install dependencies
npm install

# For iOS only - install CocoaPods
cd ios && pod install && cd ..

# Set up environment variables
cp .env.example .env
# Edit .env and add your Google Maps API key
```

## Configuration

### Google Maps API Key

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable these APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
3. Add the key to `.env`:
   ```
   GOOGLE_MAPS_API_KEY=your_actual_key_here
   ```

For iOS, also update `ios/parkeoya/Info.plist`:
```xml
<key>GMSApiKey</key>
<string>YOUR_GOOGLE_MAPS_API_KEY</string>
```

## Running the App

### Android
```bash
npm run android
# or
npx react-native run-android
```

### iOS
```bash
npm run ios
# or
npx react-native run-ios
```

### Start Metro Bundler (if needed)
```bash
npm start
```

## Development

### Running Tests
```bash
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Linting
```bash
npm run lint
```

### Code Style
Code is formatted using Prettier. Run:
```bash
npx prettier --write .
```

## Project Structure

```
parkeoya-appmobil/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ParkingCard.js
│   │   └── ReservationCard.js
│   ├── screens/            # App screens
│   │   ├── MapScreen.js
│   │   ├── ParkingDetailsScreen.js
│   │   ├── ReservationConfirmScreen.js
│   │   └── ReservationsScreen.js
│   └── services/           # Business logic
│       ├── ParkingService.js
│       └── ReservationService.js
├── __tests__/              # Test files
├── android/                # Android native code
├── ios/                    # iOS native code
├── App.js                  # Main app component
└── index.js               # App entry point
```

## Troubleshooting

### Common Issues

**Metro bundler not starting:**
```bash
npx react-native start --reset-cache
```

**Build errors on Android:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**Pod install fails on iOS:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

**Maps not showing:**
- Verify Google Maps API key is correct
- Check that Maps SDK is enabled in Google Cloud Console
- For Android: Check `AndroidManifest.xml` has the API key
- For iOS: Check `Info.plist` has the API key

## Key Features

### Map Screen
- View parking locations on Google Maps
- Search by name or address
- See parking cards with details
- Tap marker or card to view full details

### Parking Details
- View available spots
- See pricing and features
- Check ratings
- Reserve parking spot

### Reservations
- View all bookings
- See active and cancelled reservations
- Cancel active reservations

## Data Storage

The app uses AsyncStorage to persist reservations locally on the device. Data is not synced to a backend server.

## Mock Data

The app includes 5 sample parking locations in Barcelona:
1. Central Parking Plaza
2. Marina Park & Ride
3. Gothic Quarter Garage
4. Eixample Parking Center
5. Sagrada Familia Parking

To add more locations, edit `src/services/ParkingService.js`.

## API Integration (Future)

To integrate with a real backend:
1. Replace `ParkingService` with API calls
2. Replace `ReservationService` with API calls
3. Add authentication
4. Implement real-time updates

## Support

For issues or questions:
1. Check the README.md
2. Review IMPLEMENTATION.md for technical details
3. Open an issue on GitHub
