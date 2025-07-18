// Ejemplo de animación fade-in con Tailwind (puedes usarla en cualquier componente)
export const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};
