// Datos de las 5 sesiones del taller. Las 5 tienen la misma duración y la misma cantidad de errores.
export const SESIONES = [
  {
    id: 1,
    titulo: "Registro de usuarios",
    funcionalidad: "Registro",
    ruta: "tienda.html#registro",
    mision:
      "Explorar el formulario de registro con datos válidos, inválidos y valores límite, para descubrir problemas de validación y de mensajes al usuario.",
    pista: "Leé las reglas que muestra cada campo y comprobá si el sistema realmente las cumple.",
  },
  {
    id: 2,
    titulo: "Catálogo y buscador",
    funcionalidad: "Catálogo",
    ruta: "tienda.html#catalogo",
    mision:
      "Explorar la búsqueda, los filtros y el ordenamiento del catálogo, para descubrir resultados incorrectos o incompletos.",
    pista: "Probá escribir la misma búsqueda de distintas formas y revisá si lo que ves coincide con lo que pediste.",
  },
  {
    id: 3,
    titulo: "Carrito de compras",
    funcionalidad: "Carrito",
    ruta: "tienda.html#carrito",
    mision:
      "Explorar cómo se agregan, modifican y eliminan productos del carrito, para descubrir errores en cantidades, stock y totales.",
    pista: "Probá cantidades raras y trabajá con varios productos a la vez, no solo con uno.",
  },
  {
    id: 4,
    titulo: "Checkout y pago",
    funcionalidad: "Checkout",
    ruta: "tienda.html#checkout",
    mision:
      "Explorar el cálculo del total (envío y cupones) y la validación de los datos de pago, para descubrir errores de cálculo y de validación.",
    pista: "Hacé las cuentas a mano y comparalas con lo que muestra la pantalla. Necesitás productos en el carrito.",
  },
  {
    id: 5,
    titulo: "Mi cuenta",
    funcionalidad: "Mi cuenta",
    ruta: "tienda.html#cuenta",
    mision:
      "Explorar la edición del perfil, el cambio de contraseña y el historial de pedidos, para descubrir errores de validación, de reglas de negocio y de datos.",
    pista: "Leé las reglas que muestra la pantalla y verificá si se respetan.",
  },
];
export const DURACION_MIN = 30;
