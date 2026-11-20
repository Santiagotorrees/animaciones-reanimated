export const strings = {
  appName: 'Animaciones Reanimated',
  author: 'Santiago Torres',

  home: {
    title: 'Inicio',
    heading: 'Taller de animaciones',
    description:
      'Aplicación construida con Expo, React Native Reanimated y Gesture Handler. Seleccione un ejercicio en el menú lateral o en la lista inferior.',
  },

  drag: {
    title: '1. Arrastrar y rotar',
    hint: 'Arrastre la figura por la pantalla: hacia la izquierda rota a la izquierda y hacia la derecha rota a la derecha. Al soltarla recupera su ángulo.',
    reset: 'Volver al centro',
  },

  loading: {
    title: '2. Animación de carga',
    hint: 'El spinner inicia de forma automática al montar el componente y la barra de progreso avanza al mismo tiempo.',
    loading: 'Cargando',
    restart: 'Reiniciar',
  },

  multitouch: {
    title: '3. Gestos multitáctiles',
    hint: 'Pellizque para acercar o alejar, gire con dos dedos y arrastre para mover la imagen. Doble toque para restablecer.',
    reset: 'Restablecer',
    scale: 'Escala',
    rotation: 'Rotación',
  },

  bounce: {
    title: '4. Animación de rebote',
    hint: 'Mantenga presionada la figura: se reduce. Al soltarla vuelve a su tamaño original con un rebote.',
    press: 'Presióneme',
    counter: 'Pulsaciones',
  },

  carousel: {
    title: '5. Carrusel animado',
    hint: 'Deslice horizontalmente para navegar entre tarjetas con efectos de escala, rotación y transición.',
    previous: 'Anterior',
    next: 'Siguiente',
    items: [
      { title: 'Montañas', subtitle: 'Rutas y senderismo', icon: '⛰️' },
      { title: 'Playa', subtitle: 'Sol, arena y mar', icon: '🏖️' },
      { title: 'Ciudad', subtitle: 'Cultura y gastronomía', icon: '🏙️' },
      { title: 'Desierto', subtitle: 'Paisajes infinitos', icon: '🏜️' },
      { title: 'Bosque', subtitle: 'Naturaleza viva', icon: '🌲' },
    ],
  },

  shake: {
    title: '6. Acelerómetro',
    hint: 'Agite físicamente el dispositivo y la figura se sacudirá. Se usa el sensor acelerómetro.',
    simulate: 'Simular sacudida',
    unavailable: 'El acelerómetro no está disponible en este dispositivo. Use el botón para simular.',
    shakes: 'Sacudidas detectadas',
    force: 'Fuerza actual (g)',
  },
};
