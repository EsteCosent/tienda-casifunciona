/* TiendaQA: tienda de práctica con errores intencionales para el taller de testing exploratorio.
   NO corregir: los errores son parte de la actividad. Ver SOLUCIONARIO_DOCENTE.md (fuera del repositorio). */

const PRODUCTOS = [
  { id: 1, nombre: "Mouse inalámbrico", categoria: "Periféricos", precio: 690, stock: 8, icono: "🖱️" },
  { id: 2, nombre: "Teclado mecánico", categoria: "Periféricos", precio: 2490, stock: 5, icono: "⌨️" },
  { id: 3, nombre: "Auriculares Bluetooth", categoria: "Audio", precio: 1890, stock: 0, icono: "🎧" },
  { id: 4, nombre: "Parlante portátil", categoria: "Audio", precio: 1350, stock: 4, icono: "🔊" },
  { id: 5, nombre: "Monitor 24 pulgadas", categoria: "Pantallas", precio: 7990, stock: 3, icono: "🖥️" },
  { id: 6, nombre: "Webcam HD", categoria: "Periféricos", precio: 1200, stock: 6, icono: "📷" },
  { id: 7, nombre: "Cable USB-C", categoria: "Accesorios", precio: 350, stock: 20, icono: "🔌" },
  { id: 8, nombre: "Hub USB 4 puertos", categoria: "Accesorios", precio: 890, stock: 7, icono: "🧩" },
  { id: 9, nombre: "Pendrive 64 GB", categoria: "Almacenamiento", precio: 450, stock: 15, icono: "💾" },
  { id: 10, nombre: "Disco SSD 1 TB", categoria: "Almacenamiento", precio: 3990, stock: 2, icono: "🗄️" },
  { id: 11, nombre: "Soporte para notebook", categoria: "Accesorios", precio: 1100, stock: 5, icono: "💻" },
  { id: 12, nombre: "Micrófono USB", categoria: "Audio", precio: 2200, stock: 3, icono: "🎙️" },
];

const PEDIDOS_INICIALES = [
  { id: 1001, fecha: "05/09/2026", estado: "Entregado", total: 3490 },
  { id: 1002, fecha: "28/10/2026", estado: "Pendiente", total: 1350 },
  { id: 1003, fecha: "12/10/2026", estado: "Cancelado", total: 7990 },
  { id: 1004, fecha: "03/11/2026", estado: "Enviado", total: 890 },
];
const USUARIO_INICIAL = {
  nombre: "Ana Pérez",
  email: "ana@correo.com",
  telefono: "099 123 456",
  password: "Clave1234",
};

/* ---------- almacenamiento ---------- */
const mem = {};
function load(k, def) {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : structuredClone(def);
  } catch {
    return k in mem ? mem[k] : structuredClone(def);
  }
}
function save(k, v) {
  mem[k] = v;
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    // el navegador no permite guardar: se sigue sin persistir
  }
}
const getCart = () => load("qa_cart", []);
const setCart = (c) => save("qa_cart", c);
const getUser = () => load("qa_user", USUARIO_INICIAL);
const getOrders = () => load("qa_orders", PEDIDOS_INICIALES);

const $ = (s) => document.querySelector(s);
const money = (n) => "$ " + Math.round(n).toLocaleString("es-UY");
const prod = (id) => PRODUCTOS.find((p) => p.id === id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function updateBadge() {
  $("#badge").textContent = getCart().reduce((a, i) => a + i.qty, 0);
}

/* ---------- router ---------- */
const VISTAS = { registro, catalogo, carrito, checkout, cuenta };
function router() {
  const ruta = (location.hash || "#catalogo").slice(1);
  document
    .querySelectorAll("#menu a")
    .forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + ruta));
  (VISTAS[ruta] || noEncontrada)();
  window.scrollTo(0, 0);
}
function noEncontrada() {
  document.title = "TiendaQA";
  $("#view").innerHTML =
    `<h1>Página no encontrada</h1><div class="card"><p>La página que buscás no existe.</p><a class="btn" href="#catalogo">Volver al catálogo</a></div>`;
}

/* ======================= SESIÓN 1: REGISTRO ======================= */
function registro() {
  document.title = "TiendaQA - Registro";
  $("#view").innerHTML = `
  <h1>Crear una cuenta</h1>
  <div class="card" style="max-width:560px">
    <form id="fReg" novalidate>
      <label for="rNombre">Nombre completo</label><input id="rNombre">
      <label for="rEmail">Correo electrónico</label><input id="rEmail" type="text" placeholder="nombre@dominio.com">
      <label for="rPass">Contraseña</label><input id="rPass" type="password">
      <div class="hint">Mínimo 8 caracteres.</div>
      <label for="rPass2">Repetir contraseña</label><input id="rPass2" type="password">
      <label for="rEdad">Edad</label><input id="rEdad" type="number">
      <div class="hint">Tenés que tener 18 años o más para registrarte.</div>
      <label for="rPais">País</label>
      <select id="rPais"><option value="">Elegí un país</option><option>Uruguay</option><option>Argentina</option><option>Brasil</option><option>Chile</option><option>Paraguay</option></select>
      <label class="inline"><input type="checkbox" id="rTerm"> Acepto los términos y condiciones (obligatorio)</label>
      <div style="margin-top:16px"><button>Registrarme</button></div>
      <div id="rMsg"></div>
    </form>
  </div>`;
  $("#fReg").onsubmit = (e) => {
    e.preventDefault();
    const nombre = $("#rNombre").value.trim(),
      email = $("#rEmail").value.trim();
    const p1 = $("#rPass").value,
      p2 = $("#rPass2").value,
      edad = $("#rEdad").value,
      pais = $("#rPais").value;
    const err = [];
    if (!nombre) err.push("Ingresá tu nombre.");
    if (!email.includes("@")) err.push("El correo electrónico no es válido.");
    if (p1.length < 6) err.push("La contraseña es demasiado corta.");
    if (p1.slice(0, 6) !== p2.slice(0, 6)) err.push("Las contraseñas no coinciden.");
    if (edad === "" || Number(edad) <= 18) err.push("Tenés que ser mayor de edad para registrarte.");
    if (!pais) err.push("Elegí un país.");
    $("#rMsg").innerHTML = err.length
      ? `<div class="msg err">${err.join("<br>")}</div>`
      : `<div class="msg ok">¡Registro exitoso! Bienvenido/a, ${esc(nombre)}.</div>`;
  };
}

/* ======================= SESIÓN 2: CATÁLOGO ======================= */
let filtros = { q: "", cat: "", min: "", max: "", orden: "" };
function catalogo() {
  document.title = "TiendaQA - Catalogo";
  const cats = [...new Set(PRODUCTOS.map((p) => p.categoria))];
  $("#view").innerHTML = `
  <h1>Catálogo</h1>
  <div class="card">
    <div class="row">
      <div><label for="cQ">Buscar</label><input id="cQ" placeholder="Ej: teclado" value="${esc(filtros.q)}"></div>
      <div><label for="cCat">Categoría</label><select id="cCat"><option value="">Todas</option>${cats.map((c) => `<option ${c === filtros.cat ? "selected" : ""}>${c}</option>`).join("")}</select></div>
      <div><label for="cMin">Precio desde</label><input id="cMin" type="number" value="${filtros.min}"></div>
      <div><label for="cMax">Precio hasta</label><input id="cMax" type="number" value="${filtros.max}"></div>
      <div><label for="cOrden">Ordenar por</label><select id="cOrden">
        <option value="">Destacados</option><option value="asc">Precio: menor a mayor</option><option value="desc">Precio: mayor a menor</option><option value="az">Nombre: A-Z</option></select></div>
    </div>
    <div style="margin-top:12px" class="row"><div><button id="cBuscar">Aplicar</button> <button class="secondary" id="cLimpiar">Limpiar filtros</button></div></div>
  </div>
  <p class="muted" id="cCount"></p>
  <div class="grid" id="cGrid"></div>`;
  $("#cOrden").value = filtros.orden;
  const aplicar = () => {
    filtros = {
      q: $("#cQ").value,
      cat: $("#cCat").value,
      min: $("#cMin").value,
      max: $("#cMax").value,
      orden: $("#cOrden").value,
    };
    pintarCatalogo();
  };
  $("#cBuscar").onclick = aplicar;
  $("#cQ").onkeydown = (e) => {
    if (e.key === "Enter") aplicar();
  };
  $("#cOrden").onchange = aplicar;
  $("#cLimpiar").onclick = () => {
    filtros = { q: "", cat: "", min: "", max: "", orden: "" };
    catalogo();
  };
  pintarCatalogo();
}
function pintarCatalogo() {
  let lista = PRODUCTOS.filter((p) => p.nombre.includes(filtros.q));
  if (filtros.cat) lista = lista.filter((p) => p.categoria === filtros.cat);
  if (filtros.min !== "") lista = lista.filter((p) => p.precio >= Number(filtros.min));
  if (filtros.max !== "") lista = lista.filter((p) => p.precio < Number(filtros.max));
  if (filtros.orden === "asc") lista.sort((a, b) => String(a.precio).localeCompare(String(b.precio)));
  if (filtros.orden === "desc") lista.sort((a, b) => String(b.precio).localeCompare(String(a.precio)));
  if (filtros.orden === "az") lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
  $("#cCount").textContent = `Mostrando ${PRODUCTOS.length} productos`;
  $("#cGrid").innerHTML = lista.length
    ? lista
        .map(
          (p) => `
    <div class="card product">
      <div class="img">${p.icono}</div>
      <strong>${p.nombre}</strong>
      <span class="tag">${p.categoria}</span>
      <span class="price">${money(p.precio)}</span>
      ${p.stock > 0 ? `<span class="muted">Stock: ${p.stock} unidades</span>` : `<span class="tag out">Sin stock</span>`}
      <button data-add="${p.id}">Agregar al carrito</button>
    </div>`,
        )
        .join("")
    : `<div class="card"><p>No encontramos productos con esos filtros.</p></div>`;
  document.querySelectorAll("[data-add]").forEach((b) => (b.onclick = () => agregar(Number(b.dataset.add), b)));
}

/* ======================= SESIÓN 3: CARRITO ======================= */
function agregar(id, boton) {
  const cart = getCart(),
    p = prod(id);
  let item = cart.find((i) => i.id === id);
  if (item && item.qty > p.stock) {
    alert(`No hay más stock de ${p.nombre}.`);
    return;
  }
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  setCart(cart);
  updateBadge();
  if (boton) {
    const t = boton.textContent;
    boton.textContent = "Agregado ✓";
    setTimeout(() => (boton.textContent = t), 900);
  }
}
function carrito() {
  document.title = "TiendaQA - Carrito";
  const cart = getCart();
  if (!cart.length) {
    $("#view").innerHTML =
      `<h1>Tu carrito</h1><div class="card"><p>Tu carrito está vacío.</p><a class="btn" href="#catalogo">Ir al catálogo</a></div>`;
    return;
  }
  const subtotal = cart.reduce((a, i) => a + i.qty * prod(i.id).precio, 0);
  $("#view").innerHTML = `
  <h1>Tu carrito</h1>
  <div class="card">
    <table><thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead><tbody>
    ${cart
      .map((i, idx) => {
        const p = prod(i.id);
        return `
      <tr><td>${p.icono} ${p.nombre}</td><td>${money(p.precio)}</td>
      <td><input type="number" style="width:90px" value="${i.qty}" data-qty="${idx}"></td>
      <td>${money(i.qty * p.precio)}</td>
      <td><button class="secondary" data-del="${idx}">Eliminar</button></td></tr>`;
      })
      .join("")}
    </tbody></table>
    <p style="text-align:right;font-size:20px;margin-top:16px"><strong>Total: ${money(subtotal)}</strong></p>
    <div style="text-align:right"><button class="secondary" id="vaciar">Vaciar carrito</button> <a class="btn" href="#checkout">Continuar con la compra</a></div>
  </div>`;
  document.querySelectorAll("[data-qty]").forEach(
    (inp) =>
      (inp.onchange = () => {
        const c = getCart(),
          it = c[Number(inp.dataset.qty)],
          p = prod(it.id);
        let q = parseInt(inp.value, 10);
        if (isNaN(q)) q = 1;
        if (q > p.stock) {
          alert(`Solo hay ${p.stock} unidades de ${p.nombre}.`);
          q = p.stock;
        }
        it.qty = q;
        setCart(c);
        updateBadge();
        carrito();
      }),
  );
  document.querySelectorAll("[data-del]").forEach(
    (b) =>
      (b.onclick = () => {
        const c = getCart(),
          idx = Number(b.dataset.del);
        c.splice(Math.max(0, idx - 1), 1);
        setCart(c);
        carrito();
      }),
  );
  $("#vaciar").onclick = () => {
    setCart([]);
    updateBadge();
    carrito();
  };
}

/* ======================= SESIÓN 4: CHECKOUT ======================= */
let cuponesAplicados = [];
function checkout() {
  document.title = "TiendaQA - Checkout";
  const cart = getCart();
  if (!cart.length) {
    $("#view").innerHTML =
      `<h1>Checkout</h1><div class="card"><p>No hay productos en el carrito. Agregá algo desde el catálogo para poder comprar.</p><a class="btn" href="#catalogo">Ir al catálogo</a></div>`;
    return;
  }
  $("#view").innerHTML = `
  <h1>Checkout</h1>
  <div class="msg info">Envío estándar gratis en compras desde $ 5.000. Cupón vigente: <strong>DESC10</strong> (10 % de descuento, uno por compra).</div>
  <div class="row" style="margin-top:16px;align-items:flex-start">
    <div class="card">
      <h3>Envío</h3>
      <label class="inline"><input type="radio" name="envio" value="retiro"> Retiro en el local ($ 0)</label>
      <label class="inline"><input type="radio" name="envio" value="estandar" checked> Estándar, 3 a 5 días ($ 250)</label>
      <label class="inline"><input type="radio" name="envio" value="express"> Express, 24 horas ($ 350)</label>
      <h3 style="margin-top:20px">Cupón</h3>
      <div class="row"><div><input id="kCupon" placeholder="Código"></div><div style="flex:0"><button id="kAplicar" class="secondary">Aplicar</button></div></div>
      <div id="kCupMsg"></div>
      <h3 style="margin-top:20px">Pago con tarjeta</h3>
      <label for="kTitular">Titular</label><input id="kTitular">
      <label for="kNum">Número de tarjeta</label><input id="kNum" placeholder="16 dígitos">
      <div class="row"><div><label for="kVto">Vencimiento</label><input id="kVto" placeholder="MM/AA"></div>
      <div><label for="kCvv">Código de seguridad</label><input id="kCvv" placeholder="3 dígitos"></div></div>
      <div style="margin-top:16px"><button id="kPagar">Confirmar compra</button></div>
      <div id="kMsg"></div>
    </div>
    <div class="card" id="kResumen"></div>
  </div>`;
  document.querySelectorAll("[name=envio]").forEach((r) => (r.onchange = resumen));
  $("#kAplicar").onclick = () => {
    const code = $("#kCupon").value.trim().toUpperCase();
    if (code === "DESC10") {
      cuponesAplicados.push(code);
      $("#kCupMsg").innerHTML = `<div class="msg ok">Cupón aplicado.</div>`;
    } else $("#kCupMsg").innerHTML = `<div class="msg err">El cupón no existe o está vencido.</div>`;
    resumen();
  };
  $("#kPagar").onclick = pagar;
  resumen();
}
function calcularTotales() {
  const cart = getCart();
  const subtotal = cart.reduce((a, i) => a + i.qty * prod(i.id).precio, 0);
  const tipo = (document.querySelector("[name=envio]:checked") || {}).value || "estandar";
  let envio = { retiro: 0, estandar: 250, express: 450 }[tipo];
  if (tipo === "estandar" && subtotal > 5000) envio = 0;
  const descuento = cuponesAplicados.reduce((a) => a + subtotal * 0.1, 0);
  return { subtotal, envio, descuento, total: subtotal - descuento + envio };
}
function resumen() {
  const t = calcularTotales();
  $("#kResumen").innerHTML = `<h3>Resumen</h3>
    <table><tr><td>Subtotal</td><td style="text-align:right">${money(t.subtotal)}</td></tr>
    <tr><td>Descuento</td><td style="text-align:right">- ${money(t.descuento)}</td></tr>
    <tr><td>Envío</td><td style="text-align:right">${t.envio === 0 ? "Gratis" : money(t.envio)}</td></tr>
    <tr><th>Total</th><th style="text-align:right">${money(t.total)}</th></tr></table>`;
}
function pagar() {
  const titular = $("#kTitular").value.trim(),
    num = $("#kNum").value.replace(/\s/g, ""),
    vto = $("#kVto").value.trim(),
    cvv = $("#kCvv").value.trim();
  const err = [];
  if (!titular) err.push("Ingresá el titular de la tarjeta.");
  if (num.length !== 16) err.push("El número de tarjeta debe tener 16 dígitos.");
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vto)) err.push("El vencimiento debe tener el formato MM/AA.");
  if (!/^\d{3}$/.test(cvv)) err.push("El código de seguridad debe tener 3 dígitos.");
  if (err.length) {
    $("#kMsg").innerHTML = `<div class="msg err">${err.join("<br>")}</div>`;
    return;
  }
  const t = calcularTotales(),
    orders = getOrders();
  const d = new Date(),
    fecha = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  const id = Math.max(...orders.map((o) => o.id)) + 1;
  orders.push({ id, fecha, estado: "Pendiente", total: t.total });
  save("qa_orders", orders);
  setCart([]);
  cuponesAplicados = [];
  updateBadge();
  $("#view").innerHTML =
    `<h1>¡Gracias por tu compra!</h1><div class="card"><p>Tu pedido <strong>#${id}</strong> por <strong>${money(t.total)}</strong> fue registrado.</p><a class="btn" href="#cuenta">Ver mis pedidos</a></div>`;
}

/* ======================= SESIÓN 5: MI CUENTA ======================= */
function cuenta() {
  document.title = "TiendaQA - Mi cuenta";
  const u = getUser();
  const orders = getOrders()
    .slice()
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  const gastado = orders.reduce((a, o) => a + o.total, 0);
  $("#view").innerHTML = `
  <h1>Hola, ${esc(u.nombre)}</h1>
  <div class="row" style="align-items:flex-start">
    <div class="card">
      <h3>Mis datos</h3>
      <label for="uNombre">Nombre</label><input id="uNombre" value="${esc(u.nombre)}">
      <label>Correo electrónico</label><input value="${esc(u.email)}" disabled>
      <label for="uTel">Teléfono</label><input id="uTel" value="${esc(u.telefono)}">
      <div class="hint">Solo números, por ejemplo 099123456.</div>
      <div style="margin-top:14px"><button id="uGuardar">Guardar cambios</button></div><div id="uMsg"></div>
    </div>
    <div class="card">
      <h3>Cambiar contraseña</h3>
      <label for="pAct">Contraseña actual</label><input id="pAct" type="password">
      <label for="pNew">Nueva contraseña</label><input id="pNew" type="password"><div class="hint">Mínimo 8 caracteres.</div>
      <label for="pNew2">Repetir nueva contraseña</label><input id="pNew2" type="password">
      <div style="margin-top:14px"><button id="pGuardar">Cambiar contraseña</button></div><div id="pMsg"></div>
    </div>
  </div>
  <div class="card">
    <h3>Mis pedidos</h3>
    <p class="muted">Ordenados del más reciente al más antiguo. Solo se pueden cancelar los pedidos pendientes.</p>
    <table><thead><tr><th>Pedido</th><th>Fecha</th><th>Estado</th><th>Total</th><th></th></tr></thead><tbody>
    ${orders
      .map(
        (
          o,
        ) => `<tr><td>#${o.id}</td><td>${o.fecha}</td><td><span class="status st-${o.estado}">${o.estado}</span></td><td>${money(o.total)}</td>
      <td>${o.estado !== "Cancelado" ? `<button class="secondary" data-cancel="${o.id}">Cancelar</button>` : ""}</td></tr>`,
      )
      .join("")}
    </tbody></table>
    <p style="margin-top:14px"><strong>Total gastado: ${money(gastado)}</strong> <span class="muted">(no incluye pedidos cancelados)</span></p>
  </div>`;
  $("#uGuardar").onclick = () => {
    const nombre = $("#uNombre").value.trim(),
      tel = $("#uTel").value.trim();
    if (!nombre) {
      $("#uMsg").innerHTML = `<div class="msg err">El nombre no puede quedar vacío.</div>`;
      return;
    }
    if (!tel) {
      $("#uMsg").innerHTML = `<div class="msg err">Ingresá un teléfono.</div>`;
      return;
    }
    save("qa_user", { ...getUser(), nombre, telefono: tel });
    cuenta();
    $("#uMsg").innerHTML = `<div class="msg ok">Cambios guardados.</div>`;
  };
  $("#pGuardar").onclick = () => {
    const act = $("#pAct").value,
      n1 = $("#pNew").value,
      n2 = $("#pNew2").value;
    if (!act) {
      $("#pMsg").innerHTML = `<div class="msg err">Ingresá tu contraseña actual.</div>`;
      return;
    }
    if (n1.length < 8) {
      $("#pMsg").innerHTML = `<div class="msg err">La nueva contraseña debe tener al menos 8 caracteres.</div>`;
      return;
    }
    if (n1 !== n2) {
      $("#pMsg").innerHTML = `<div class="msg err">Las contraseñas nuevas no coinciden.</div>`;
      return;
    }
    save("qa_user", { ...getUser(), password: n1 });
    $("#pMsg").innerHTML = `<div class="msg ok">Contraseña actualizada.</div>`;
    ["#pAct", "#pNew", "#pNew2"].forEach((s) => ($(s).value = ""));
  };
  document.querySelectorAll("[data-cancel]").forEach(
    (b) =>
      (b.onclick = () => {
        if (!confirm("¿Seguro que querés cancelar este pedido?")) return;
        const os = getOrders();
        os.find((o) => o.id === Number(b.dataset.cancel)).estado = "Cancelado";
        save("qa_orders", os);
        cuenta();
      }),
  );
}

/* ---------- inicio ---------- */
$("#reset").onclick = (e) => {
  e.preventDefault();
  if (!confirm("Esto borra el carrito, los pedidos nuevos y los cambios de la cuenta. ¿Seguir?")) return;
  ["qa_cart", "qa_user", "qa_orders"].forEach((k) => {
    delete mem[k];
    try {
      localStorage.removeItem(k);
    } catch {
      // el navegador no permite guardar: se sigue sin persistir
    }
  });
  cuponesAplicados = [];
  updateBadge();
  router();
};
window.addEventListener("hashchange", router);
updateBadge();
router();
