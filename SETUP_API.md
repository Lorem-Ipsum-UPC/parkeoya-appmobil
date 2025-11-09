# Guía Rápida - Configuración de API

## 🚀 Paso a Paso para Conectar tu App al Servidor

### 1️⃣ El servidor ya está corriendo ✅
El servidor JSON está activo en el puerto 3000 y acepta conexiones de la red local.

### 2️⃣ Identifica tu entorno

#### 📱 Android Emulator
**Ya está configurado por defecto** - No necesitas hacer nada.
```typescript
// En constants/Config.ts (YA ESTÁ ASÍ)
API_BASE_URL: 'http://10.0.2.2:3000'
```

#### 🍎 iOS Simulator
Cambia en `constants/Config.ts`:
```typescript
API_BASE_URL: 'http://localhost:3000'
```

#### 📲 Dispositivo Físico (Android o iOS)

**Paso 1:** Obtén tu IP local

Abre PowerShell y ejecuta:
```powershell
ipconfig
```

Busca una línea como esta:
```
Adaptador de LAN inalámbrica Wi-Fi:
   Dirección IPv4. . . . . . . . . : 192.168.1.100  <-- ESTA ES TU IP
```

**Paso 2:** Actualiza `constants/Config.ts`

Reemplaza la línea del API_BASE_URL con tu IP:
```typescript
export const Config = {
  API_BASE_URL: 'http://192.168.1.100:3000',  // <-- USA TU IP AQUÍ
  // ...resto del código
};
```

**Paso 3:** Asegúrate de que ambos dispositivos estén en la misma red WiFi
- Tu computadora y tu teléfono deben estar conectados a la misma red WiFi

**Paso 4:** Reinicia la app
- En Expo, presiona `r` para recargar

### 3️⃣ Verifica la conexión

#### Desde tu navegador (en la misma computadora):
```
http://localhost:3000/users/user1
```

Deberías ver:
```json
{
  "id": "user1",
  "name": "Tralalero Tralala",
  "email": "tralalerotralala@gmail.com",
  ...
}
```

#### Desde tu dispositivo móvil (navegador del teléfono):
```
http://TU_IP_LOCAL:3000/users/user1
```
Por ejemplo: `http://192.168.1.100:3000/users/user1`

### 4️⃣ Prueba la app

1. Abre la app en tu dispositivo
2. Ve a la pestaña Profile (icono de persona)
3. Si ves "Tralalero Tralala" con los datos completos = ✅ **¡Funciona con API!**
4. Si aparece el error de red pero igual ves datos = ⚠️ **Funciona en modo offline**

## 🔧 Solución de Problemas Rápida

### ❌ Error "Network request failed"
1. Verifica que el servidor esté corriendo (`npm run api`)
2. Confirma que estás usando la IP correcta en `Config.ts`
3. Verifica que ambos dispositivos estén en la misma WiFi
4. Desactiva el firewall temporalmente para probar

### ❌ No aparece el icono de Profile
**Ya está arreglado** ✅ - El layout de tabs ahora incluye todos los iconos.

### ❌ La app usa datos viejos
1. Presiona `r` en la consola de Expo para recargar
2. O ejecuta: `npx expo start -c` (limpiar caché)

## 📝 Configuración Actual

### Servidor JSON:
- ✅ Puerto: 3000
- ✅ Host: 0.0.0.0 (acepta conexiones externas)
- ✅ Recursos disponibles:
  - `/users`
  - `/vehicles`
  - `/parkings`
  - `/reservations`
  - `/paymentMethods`
  - `/reviews`

### App:
- ✅ Modo fallback con datos mock activado
- ✅ Configuración en: `constants/Config.ts`
- ✅ Usuario por defecto: `user1`

## 🎯 Siguiente Paso

Si estás usando **Android Emulator**, la configuración actual debería funcionar de inmediato.

Si no funciona:
1. Abre `constants/Config.ts`
2. Verifica que dice: `API_BASE_URL: 'http://10.0.2.2:3000'`
3. Reinicia la app presionando `r` en Expo
4. Deberías ver los datos del perfil sin errores

¿Necesitas más ayuda? Revisa `TROUBLESHOOTING.md` para información detallada.
