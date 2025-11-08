# Troubleshooting - ParkeoYa App

## Error: "Network request failed"

Este error ocurre cuando la app no puede conectarse al servidor JSON. Sigue estos pasos:

### 1. Verifica que el servidor JSON esté corriendo

Abre una terminal y ejecuta:
```bash
npm run api
```

Deberías ver:
```
Resources
http://localhost:3000/parkings
http://localhost:3000/users
...
```

### 2. Configura la URL correcta según tu entorno

Edita el archivo `constants/Config.ts`:

#### Para Android Emulator (por defecto):
```typescript
API_BASE_URL: 'http://10.0.2.2:3000'
```

#### Para iOS Simulator:
```typescript
API_BASE_URL: 'http://localhost:3000'
```

#### Para Dispositivo Físico:

1. **Encuentra tu IP local:**

   **Windows:**
   ```bash
   ipconfig
   ```
   Busca "Dirección IPv4" (ejemplo: 192.168.1.100)

   **Mac/Linux:**
   ```bash
   ifconfig | grep inet
   ```

2. **Actualiza la configuración:**
   ```typescript
   API_BASE_URL: 'http://TU_IP_LOCAL:3000'  // ejemplo: http://192.168.1.100:3000
   ```

3. **IMPORTANTE:** Tu dispositivo y computadora deben estar en la misma red WiFi

### 3. Configuración del servidor JSON para dispositivos físicos

Si usas un dispositivo físico, inicia el servidor con:

```bash
json-server --watch db.json --port 3000 --host 0.0.0.0
```

El flag `--host 0.0.0.0` permite conexiones desde otros dispositivos en la red.

### 4. Verifica el Firewall

Asegúrate de que el puerto 3000 no esté bloqueado:
- En Windows: Permite el puerto 3000 en el Firewall
- En Mac: Verifica System Preferences > Security & Privacy

### 5. Modo Fallback (Sin API)

La app ahora usa datos mock automáticamente si falla la conexión al API. Verás los datos de ejemplo:
- Usuario: Tralalero Tralala
- 2 vehículos (Toyota Red, Suzuki Black)

## Problema: No aparece el icono en el tab de Profile

**Solución:** Ya está arreglado. El layout de tabs ahora incluye:
- Home (icono de casa)
- Map (icono de mapa)
- Reservations (icono de lista)
- Profile (icono de persona)

## Problema: La app se cierra al navegar

Verifica que todas las pantallas de tabs existan:
- `app/(tabs)/index.tsx` ✓
- `app/(tabs)/map.tsx` ✓
- `app/(tabs)/reservation.tsx` ✓
- `app/(tabs)/profile.tsx` ✓

## Testing Checklist

### Probar con API:
1. ✅ Servidor JSON corriendo en puerto 3000
2. ✅ URL configurada correctamente en `Config.ts`
3. ✅ Reiniciar la app después de cambiar la configuración

### Probar sin API (modo offline):
1. ✅ Detener el servidor JSON
2. ✅ La app debe cargar datos mock automáticamente
3. ✅ Todas las pantallas deben funcionar con datos de prueba

## Comandos Útiles

### Reiniciar Expo
```bash
# Limpiar caché
npx expo start -c

# Reiniciar Metro
r
```

### Ver logs
```bash
# En la terminal de Expo, presiona:
# j - para abrir el debugger
# r - para reload
```

### Verificar conectividad
```bash
# Desde tu computadora, verifica que el API responde:
curl http://localhost:3000/users/user1

# Desde tu dispositivo (en el navegador):
http://TU_IP_LOCAL:3000/users/user1
```

## Estado Actual

### ✅ Funciona sin API
La app ahora tiene datos mock integrados y funcionará incluso si el servidor no está disponible.

### ✅ Tabs corregidos
Los 4 tabs aparecen correctamente con sus iconos:
- Home
- Map (placeholder)
- Reservations (placeholder)
- Profile (completo)

### ✅ Navegación
Todas las rutas de perfil funcionan:
- My Profile → My Cars
- My Profile → Add Car
- My Profile → Edit Profile
