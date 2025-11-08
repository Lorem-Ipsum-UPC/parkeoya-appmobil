# ParkeoYa - App Móvil

Aplicación móvil para búsqueda y reserva de estacionamientos.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the fake API server (en una terminal separada)

   ```bash
   npm run api
   ```

   El servidor JSON estará disponible en `http://localhost:3000`

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

**Nota:** Para probar la funcionalidad de ubicación completa, se recomienda usar un dispositivo real o un emulador con ubicación configurada. Ver [LOCATION_SETUP.md](./LOCATION_SETUP.md) para más detalles.

## Fake API

El proyecto incluye un servidor JSON para desarrollo local con datos de prueba.

### Endpoints disponibles:

- `GET /parkings` - Lista de estacionamientos
- `GET /parkings/:id` - Detalles de un estacionamiento
- `GET /reservations` - Lista de reservas
- `POST /reservations` - Crear nueva reserva
- `GET /users/:id` - Información de usuario
- `GET /vehicles` - Lista de vehículos
- `POST /vehicles` - Agregar vehículo
- `GET /paymentMethods` - Métodos de pago
- `GET /reviews` - Reseñas

### Datos de prueba incluidos:

- 4 estacionamientos con diferentes ubicaciones
- 1 usuario de ejemplo
- 2 vehículos
- 1 método de pago
- 1 reserva activa

Para modificar los datos, edita el archivo `db.json` en la raíz del proyecto.

## Estructura del proyecto

```
app/
  (auth)/         # Pantallas de autenticación
    - welcome.tsx       # Pantalla de bienvenida
    - sign-in.tsx       # Inicio de sesión
    - sign-up.tsx       # Registro
    - forgot-password.tsx
    - verify-code.tsx
    - reset-password.tsx
  (tabs)/         # Pantallas principales con tabs
    - index.tsx         # Home (búsqueda de parkings)
    - profile.tsx       # Perfil de usuario
    - map.tsx
    - reservation.tsx
  parking/        # Pantallas relacionadas con estacionamientos
  profile/        # Pantallas de perfil
    - my-cars.tsx       # Lista de vehículos
    - add-car.tsx       # Agregar nuevo vehículo
    - edit.tsx          # Editar perfil
    - payment-history.tsx
  reservation/    # Pantallas de reservas
components/       # Componentes reutilizables
lib/
  api.ts          # Servicio API y tipos
  storage.ts      # Almacenamiento local
  utils.ts        # Utilidades
```

## Pantallas implementadas

### Autenticación ✅
- **Welcome**: Pantalla inicial con logo y opciones de Sign in/Sign up
- **Sign In**: Inicio de sesión con email y contraseña
- **Sign Up**: Registro de usuario con datos completos
- **Forgot Password**: Recuperación de contraseña
- **Verify Code**: Verificación de código de 5 dígitos
- **Reset Password**: Establecer nueva contraseña

### Home ✅
- Búsqueda de estacionamientos
- Vista de lugares recientes
- Integración con fake API
- Tarjetas de parking con información

### Perfil ✅
- **My Profile**: Vista principal del perfil con:
  - Información del usuario (avatar, nombre, email, teléfono, dirección)
  - Lista de vehículos registrados
  - Lugares recientes visitados
  - Historial de pagos
  - Botón para editar perfil
  
- **My Cars**: Lista detallada de vehículos con:
  - Visualización de cada vehículo con su color
  - Información: Modelo, Color, Placa
  - Opciones para editar o eliminar
  - Botón para agregar nuevo vehículo

- **Add New Car**: Formulario para agregar vehículo:
  - Campo de modelo
  - Selector de color con vista previa
  - Campo de placa
  - Vista previa del auto en el color seleccionado
  
- **Edit Profile**: Edición de perfil completo:
  - Cambio de foto de perfil
  - Edición de nombre, email, teléfono
  - Cambio de contraseña
  - Validaciones de campos

## Datos de prueba (Fake API)

### Usuario:
```json
{
  "name": "Tralalero Tralala",
  "email": "tralalerotralala@gmail.com",
  "phone": "999484999",
  "address": "Av. Primavera 1750, Lima 15023"
}
```

### Vehículos:
- Toyota Red (A1A-123)
- Suzuki Black (A4B-456)

### Endpoints de perfil disponibles:
- `GET /users/user1` - Obtener datos del usuario
- `PATCH /users/user1` - Actualizar datos del usuario
- `GET /vehicles?userId=user1` - Obtener vehículos del usuario
- `POST /vehicles` - Agregar nuevo vehículo
- `DELETE /vehicles/:id` - Eliminar vehículo

## Navegación

La navegación está configurada para:
- La app inicia en la pantalla **Welcome**
- Después del login/registro, se accede a las tabs principales
- Desde el perfil se puede navegar a My Cars, Add Car y Edit Profile
- Todas las pantallas están conectadas al fake API

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
