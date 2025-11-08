# Configuración de Ubicación y Permisos

## Permisos Configurados

### Android
Los siguientes permisos han sido agregados en `app.json`:
- `ACCESS_FINE_LOCATION` - Ubicación precisa del GPS
- `ACCESS_COARSE_LOCATION` - Ubicación aproximada de red
- `INTERNET` - Conexión a internet

### iOS
Permisos de ubicación configurados en `infoPlist`:
- `NSLocationWhenInUseUsageDescription` - Ubicación cuando la app está en uso
- `NSLocationAlwaysAndWhenInUseUsageDescription` - Ubicación siempre

## Funcionalidades del Mapa

### 1. Ubicación en Tiempo Real
- Al abrir el mapa, automáticamente solicita permisos de ubicación
- Si se concede, el mapa se centra en la ubicación actual del usuario
- Muestra un marcador azul personalizado en la ubicación del usuario

### 2. Botón de Recentrar
- El botón de "locate" (esquina inferior derecha) recentra el mapa a tu ubicación actual
- Actualiza la ubicación en tiempo real cuando se presiona

### 3. Manejo de Permisos
- Si el usuario deniega los permisos, muestra un alert y usa ubicación por defecto
- Si hay error al obtener la ubicación, usa ubicación por defecto de Lima

## Cómo Probar

### Con Expo Go (Solo para desarrollo)
```bash
npm start
```
Escanea el QR con tu celular. Los permisos de ubicación funcionarán en tu dispositivo real.

### Con Build de Desarrollo (Recomendado)
Si necesitas todas las funcionalidades nativas:

1. **Para Android:**
   ```bash
   npx expo prebuild --platform android
   npx expo run:android
   ```

2. **Para iOS:**
   ```bash
   npx expo prebuild --platform ios
   npx expo run:ios
   ```

### Emulador Android
Para simular ubicación en el emulador:
1. Abre el emulador
2. Click en `...` (Extended controls)
3. Ve a `Location`
4. Ingresa coordenadas o usa el mapa
5. Click en `Set Location`

### Simulador iOS
Para simular ubicación en el simulador:
1. Ejecuta el simulador
2. `Features > Location > Custom Location...`
3. Ingresa latitud y longitud
4. O usa `Features > Location > Apple` para una ubicación predefinida

## Ubicación por Defecto

Si no se pueden obtener permisos o hay error:
- **Latitud:** -12.1108
- **Longitud:** -77.0045
- **Ubicación:** Lima, Perú

## Notas Importantes

1. **Expo Go:** La ubicación funciona, pero algunas características nativas pueden estar limitadas
2. **Development Build:** Recomendado para probar todas las funcionalidades
3. **Producción:** Asegúrate de hacer un build nativo (`eas build` o `expo prebuild`)
4. **Permisos:** El usuario DEBE aceptar los permisos de ubicación para que el mapa funcione correctamente

## Resolución de Problemas

### El mapa no muestra mi ubicación
1. Verifica que los permisos estén aceptados en la configuración del dispositivo
2. Asegúrate de tener GPS/ubicación activados en el dispositivo
3. Revisa la consola para ver errores de ubicación
4. Intenta presionar el botón de "locate" nuevamente

### Permisos denegados
1. Ve a la configuración de tu dispositivo
2. Busca la app ParkeoYa
3. Activa los permisos de ubicación
4. Reinicia la app

### No funciona en emulador
1. Configura una ubicación manual en el emulador (ver instrucciones arriba)
2. Asegúrate de que los Google Play Services estén instalados (Android)
