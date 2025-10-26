# Parkeoya App Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      APP LAUNCH                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │   Bottom Tab Navigator       │
        └─────────────┬────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
        ▼                            ▼
┌──────────────┐            ┌──────────────────┐
│  Search Tab  │            │ Reservations Tab │
│  (Map Stack) │            │                  │
└──────┬───────┘            └────────┬─────────┘
       │                             │
       ▼                             ▼
┌──────────────────┐         ┌────────────────────┐
│   MAP SCREEN     │         │ RESERVATIONS       │
│                  │         │ SCREEN             │
│ • Google Maps    │         │                    │
│ • Search bar     │         │ • List of          │
│ • Parking cards  │         │   reservations     │
│ • Markers        │         │ • Active/Cancelled │
└────────┬─────────┘         │ • Cancel button    │
         │                   └────────────────────┘
         │ Tap marker or card
         ▼
┌──────────────────────┐
│ PARKING DETAILS      │
│ SCREEN               │
│                      │
│ • Name & rating      │
│ • Available spots    │
│ • Price per hour     │
│ • Features list      │
│ • Reserve button     │
└────────┬─────────────┘
         │ Click "Reserve Now"
         ▼
┌──────────────────────────┐
│ RESERVATION CONFIRM      │
│ SCREEN                   │
│                          │
│ • Parking info           │
│ • Duration selector      │
│   (1,2,3,4,6,8 hours)    │
│ • Start/End time         │
│ • Price summary          │
│ • Confirm/Cancel buttons │
└────────┬─────────────────┘
         │ Confirm
         ▼
┌──────────────────────┐
│  Success Dialog      │
│  "Reservation        │
│   Confirmed!"        │
└──────────────────────┘
         │
         ├─→ Navigate to Reservations Tab
         └─→ Navigate to Map Screen
```

## Data Flow

```
┌──────────────────┐
│  ParkingService  │  ──→  Mock Data (5 Barcelona parkings)
└──────────────────┘       • getAllParkings()
                           • getParkingById()
                           • searchParkings()
                           • getNearbyParkings()

┌──────────────────────┐
│ ReservationService   │  ──→  AsyncStorage (Device)
└──────────────────────┘       • createReservation()
                               • getAllReservations()
                               • cancelReservation()
                               • getReservationById()
```

## Screen Components

```
MapScreen
├── MapView (Google Maps)
│   └── Marker (for each parking)
├── TextInput (Search)
└── FlatList
    └── ParkingCard (for each parking)

ParkingDetailsScreen
├── Header (name, rating)
├── Availability Card
├── Price Card
├── Features List
└── Reserve Button

ReservationConfirmScreen
├── Parking Info
├── Duration Buttons (1h, 2h, 3h, 4h, 6h, 8h)
├── Time Display (start/end)
├── Price Summary
├── Confirm Button
└── Cancel Button

ReservationsScreen
└── FlatList
    └── ReservationCard (for each reservation)
        ├── Parking name
        ├── Status badge
        ├── Time info
        ├── Price
        └── Cancel button (if active)
```

## Technology Stack

```
Frontend Framework
└── React Native 0.72.6

Navigation
├── @react-navigation/native
├── @react-navigation/stack
└── @react-navigation/bottom-tabs

Maps
└── react-native-maps (Google Maps)

Storage
└── @react-native-async-storage/async-storage

UI Components
├── React Native core components
├── Custom ParkingCard
└── Custom ReservationCard

State Management
└── React Hooks (useState, useEffect, useCallback)

Testing
├── Jest
├── react-test-renderer
└── @testing-library/react-native
```
