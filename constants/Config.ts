// Configuración de la aplicación

// API Configuration
// Cambia según donde ejecutes la app:
// - Android Emulator: http://10.0.2.2:3000
// - iOS Simulator: http://localhost:3000
// - Dispositivo físico: http://TU_IP_LOCAL:3000 (ejemplo: http://192.168.1.100:3000)

export const Config = {
  // ParkeoYa Backend API
  API_BASE_URL: 'https://parkeoya-backend-latest-1.onrender.com',
  
  // Timeout para requests
  API_TIMEOUT: 30000,
  
  // API Version
  API_VERSION: 'v1',
};

// Para encontrar tu IP local:
// 1. Abre una terminal
// 2. En Windows: ejecuta "ipconfig"
// 3. Busca "Dirección IPv4" o "IPv4 Address"
// 4. Usa esa IP en lugar de "192.168.1.100"
