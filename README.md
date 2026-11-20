# Animaciones con React Native Reanimated y Expo

Aplicación móvil desarrollada con **Expo**, **React Native Reanimated 4** y **React Native Gesture Handler 3** que integra seis ejercicios de animación accesibles desde un **menú lateral (Drawer Navigation)**.

**Autor:** Santiago Torres

---

## Ejercicios implementados

| # | Ejercicio | Archivo | Descripción |
|---|-----------|---------|-------------|
| 1 | Arrastrar y rotar | `src/screens/DragRotateScreen.tsx` | Figura que se arrastra por la pantalla. Al moverla hacia la izquierda rota a la izquierda y hacia la derecha rota a la derecha (`usePanGesture` + `interpolate`). Al soltarla recupera su ángulo con `withSpring`. |
| 2 | Animación de carga | `src/screens/LoadingScreen.tsx` | Al montarse el componente inicia automáticamente un spinner infinito (`withRepeat` + `withTiming`) y, en simultáneo, una barra de progreso animada con porcentaje. |
| 3 | Gestos multitáctiles | `src/screens/MultitouchScreen.tsx` | Imagen que se puede acercar/alejar (pinch), mover (pan) y rotar (rotation) al mismo tiempo con `useSimultaneousGestures`. Doble toque para restablecer. |
| 4 | Animación de rebote | `src/screens/BounceScreen.tsx` | Figura que se reduce al presionarla y vuelve a su tamaño original con un rebote (`withSpring` con baja amortiguación) al soltarla. |
| 5 | Carrusel animado | `src/screens/CarouselScreen.tsx` | Carrusel horizontal de tarjetas con efectos de escala, rotación (Z y Y con perspectiva), opacidad y transición, controlado con `useAnimatedScrollHandler`. Incluye indicadores animados y botones Anterior/Siguiente. |
| 6 | Acelerómetro | `src/screens/ShakeScreen.tsx` | Usa el sensor acelerómetro (`expo-sensors`). Cuando la fuerza supera el umbral (1.8 g) la figura ejecuta una animación de sacudida (`withSequence`). Incluye botón para simular en emulador. |
| 7 | Drawer Navigation | `src/navigation/AppNavigator.tsx` | Menú lateral con `@react-navigation/drawer` que permite acceder a cada ejercicio de forma independiente. |

## Tecnologías

- Expo SDK 58
- React Native 0.88 / React 19
- react-native-reanimated 4 + react-native-worklets
- react-native-gesture-handler 3 (API de hooks: `usePanGesture`, `usePinchGesture`, `useRotationGesture`, `useTapGesture`)
- @react-navigation/native + @react-navigation/drawer 7
- expo-sensors (Accelerometer)
- TypeScript

## Estructura del proyecto

```
.
├── App.tsx                      # Raíz: GestureHandlerRootView + navegación
├── assets/paisaje.png           # Imagen del ejercicio multitáctil
└── src/
    ├── components/              # Componentes reutilizables (botón, contenedor)
    ├── constants/
    │   ├── strings.ts           # Textos centralizados (sin textos quemados en pantallas)
    │   └── theme.ts             # Colores, espaciados y radios
    ├── navigation/
    │   ├── AppNavigator.tsx     # Drawer Navigator
    │   └── routes.ts            # Rutas y tipos
    └── screens/                 # Una pantalla por ejercicio
```

## Requisitos

- Node.js 20 o superior
- App **Expo Go** (SDK 58) en un teléfono Android o iOS, o un emulador/simulador

## Instalación y ejecución

```bash
git clone <URL_DEL_REPOSITORIO>
cd animaciones-reanimated
npm install
npx expo start
```

Luego escanear el código QR con Expo Go (Android) o con la cámara (iOS). También se puede presionar `a` para abrir en un emulador Android o `i` para el simulador de iOS.

> El ejercicio del acelerómetro requiere un dispositivo físico. En emulador puede usarse el botón **"Simular sacudida"** o los sensores virtuales del emulador.

## Verificación

```bash
npx tsc --noEmit                          # Revisión de tipos
npx expo export --platform android        # Genera el bundle de producción
```
