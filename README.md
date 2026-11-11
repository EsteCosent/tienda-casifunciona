# 🐞 Actividad: Expedición Bug (Testing exploratorio)

## 🎯 Objetivos

- Practicar el testing exploratorio basado en sesiones sobre una aplicación real.
- Trabajar con una misión, un bloque de tiempo fijo y notas de lo que se prueba.
- Documentar incidentes con pasos para reproducirlos, resultado esperado y resultado obtenido.
- Medir la sesión: división de tareas y misión vs. oportunidad.


## 🛒 La aplicación

**Tienda CasiFunciona** es una tienda online de tecnología con secciones de registro, catálogo, carrito, checkout y "Mi cuenta". _Todo anda… casi._ La tienda tiene **errores escondidos a propósito**, y tu trabajo es encontrarlos explorando, como lo haría un usuario.

> Regla del juego: no vale mirar el código fuente de la tienda (`js/tienda.js`). Los errores se encuentran usando la aplicación.

## ⚙️ Set up inicial

1. Realizá un fork del repositorio. A partir de este punto, se trabajará en el repositorio creado en este paso.
2. En el fork: cloná el repositorio con

```bash
git clone https://github.com/<USUARIO>/<NOMBRE-DEL-REPO>.git
cd <NOMBRE-DEL-REPO>
code .
```

3. Inicializá la aplicación:

```bash
npm install
npm run dev
```

4. Se abre el navegador en `http://localhost:5173/`. Leé las instrucciones de la página de inicio y recorré la tienda un par de minutos para familiarizarte con ella, **sin buscar errores todavía**.

## 🧭 Parte 1 — Elegir la sesión y preparar el reporte

1. Tu grupo recibe una de las 5 sesiones. Las cinco tienen la misma duración (30 minutos) y la misma cantidad de errores para encontrar.

| Sesión | Funcionalidad       | Misión                                                                                    |
| ------ | ------------------- | ----------------------------------------------------------------------------------------- |
| 1      | Registro            | Validaciones y mensajes del formulario de registro, con datos válidos, inválidos y límite |
| 2      | Catálogo y buscador | Búsqueda, filtros y ordenamiento del catálogo                                             |
| 3      | Carrito             | Agregar, modificar y eliminar productos: cantidades, stock y totales                      |
| 4      | Checkout y pago     | Cálculo del total (envío y cupones) y validación de los datos de pago                     |
| 5      | Mi cuenta           | Edición del perfil, cambio de contraseña e historial de pedidos                           |



2. En la página de inicio, tocá **Abrir reporte** en tu sesión y completá los datos: testers, sistema operativo, dispositivo y navegador.

## ⏱️ Parte 2 — Ejecutar la sesión

1. Tocá **Empezar sesión**. Arranca un reloj de 30 minutos y se registra la hora de inicio.
2. Abrí la tienda y explorá según tu misión. Durante la sesión, anotá en el reporte:
   - **Notas de pruebas:** frases cortas con lo que probaste. Ejemplo: "Registrarse con edad 17".
   - **Archivo de datos:** los datos que usaste (correos, cupones, cantidades).
   - **Otras notas:** dudas, aprendizajes y oportunidades.
   - **Incidentes:** uno por cada error, con título, severidad, pasos, resultado esperado y resultado obtenido.
3. Si encontrás algo **fuera de tu misión**, anotalo igual y marcá el incidente como **Oportunidad**.
4. Al terminar el tiempo, tocá **Terminar sesión**.



