// Configuración de la aplicación

// API Configuration
// Cambia según donde ejecutes la app:
// - Android Emulator: http://10.0.2.2:3000
// - iOS Simulator: http://localhost:3000
// - Dispositivo físico: http://TU_IP_LOCAL:3000 (ejemplo: http://192.168.1.100:3000)

export const Config = {
  // Para obtener tu IP local:
  // Windows: ipconfig (busca IPv4 Address)
  // Mac/Linux: ifconfig (busca inet)
  API_BASE_URL: __DEV__ 
    ? 'http://10.0.2.2:3000'  // Android Emulator por defecto
    : 'http://localhost:3000',
  
  // Si estás usando dispositivo físico, descomenta y usa tu IP:
  // API_BASE_URL: 'http://192.168.1.100:3000',
  
  // Timeout para requests
  API_TIMEOUT: 10000,
  
  // Usuario de prueba
  DEFAULT_USER_ID: 'user1',
};

// Para encontrar tu IP local:
// 1. Abre una terminal
// 2. En Windows: ejecuta "ipconfig"
// 3. Busca "Dirección IPv4" o "IPv4 Address"
// 4. Usa esa IP en lugar de "192.168.1.100"
