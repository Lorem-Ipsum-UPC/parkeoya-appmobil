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
  (tabs)/         # Pantallas principales con tabs
  parking/        # Pantallas relacionadas con estacionamientos
  profile/        # Pantallas de perfil
  reservation/    # Pantallas de reservas
components/       # Componentes reutilizables
lib/
  api.ts          # Servicio API y tipos
  storage.ts      # Almacenamiento local
  utils.ts        # Utilidades
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
