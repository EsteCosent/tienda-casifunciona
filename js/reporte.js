import { SESIONES, DURACION_MIN } from "./sesiones.js";

/* Formulario de reporte de sesión: se guarda solo en este navegador y se descarga como Markdown. */
const params = new URLSearchParams(location.search);
const S = SESIONES.find((s) => s.id === Number(params.get("s"))) || SESIONES[0];
const KEY = "qa_reporte_s" + S.id;
const CAMPOS = [
  "tester",
  "os",
  "dispositivo",
  "navegador",
  "rol",
  "fecha",
  "inicio",
  "fin",
  "notas",
  "datos",
  "otras",
  "riesgos",
  "inconvenientes",
  "mConf",
  "mDis",
  "mRep",
  "mMis",
  "mOpo",
];
const $ = (s) => document.querySelector(s);
const mem = {};
function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return mem[KEY] || {};
  }
}
function store(d) {
  mem[KEY] = d;
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    // el navegador no permite guardar: se sigue sin persistir
  }
}

let data = load();
data.incidentes = data.incidentes || [];

document.title = `Reporte · Sesión ${S.id}: ${S.titulo}`;
$("#titulo").innerHTML = `<span class="session-num">${S.id}</span>Reporte de sesión: ${S.titulo}`;
$("#mision").textContent = S.mision;
$("#pista").textContent = "Pista: " + S.pista;
$("#funcionalidad").value = S.funcionalidad;
$("#lnkTienda").href = S.ruta;

CAMPOS.forEach((id) => {
  if (data[id] !== undefined) $("#" + id).value = data[id];
  $("#" + id).addEventListener("input", guardar);
});

function guardar() {
  CAMPOS.forEach((id) => (data[id] = $("#" + id).value));
  data.incidentes = [...document.querySelectorAll(".incident")].map((div) => ({
    titulo: div.querySelector(".iTit").value,
    severidad: div.querySelector(".iSev").value,
    tipo: div.querySelector(".iTipo").value,
    pasos: div.querySelector(".iPasos").value,
    esperado: div.querySelector(".iEsp").value,
    obtenido: div.querySelector(".iObt").value,
  }));
  store(data);
  $("#guardado").textContent = "Guardado automáticamente en este navegador.";
  actualizar();
}

function actualizar() {
  const n = (id) => Number($("#" + id).value || 0);
  const t = n("mConf") + n("mDis") + n("mRep"),
    m = n("mMis") + n("mOpo");
  $("#sumaTareas").innerHTML =
    `Suma: <span class="${t === 100 ? "sum-ok" : "sum-bad"}">${t} %</span> ${t === 100 ? "✓" : "(tiene que dar 100 %)"}`;
  $("#sumaMision").innerHTML =
    `Suma: <span class="${m === 100 ? "sum-ok" : "sum-bad"}">${m} %</span> ${m === 100 ? "✓" : "(tiene que dar 100 %)"}`;
  const ini = $("#inicio").value,
    fin = $("#fin").value;
  $("#duracion").textContent = ini && fin ? Math.max(0, mins(fin) - mins(ini)) : "–";
  const c = document.querySelectorAll(".incident").length;
  $("#cantInc").textContent = c ? `(${c})` : "";
}
const mins = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const esc = (s) =>
  String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function agregarIncidente(i = {}) {
  const div = document.createElement("div");
  div.className = "incident";
  div.innerHTML = `
    <div class="row"><div style="flex:3"><label>Título</label><input class="iTit" placeholder="Ej: Se puede registrar un usuario de 17 años" value="${esc(i.titulo)}"></div>
    <div><label>Severidad</label><select class="iSev"><option>Alta</option><option>Media</option><option>Baja</option></select></div>
    <div><label>¿Dentro de la misión?</label><select class="iTipo"><option>Misión</option><option>Oportunidad</option></select></div></div>
    <label>Pasos para reproducirlo</label><textarea class="iPasos" placeholder="1. Ir a...&#10;2. Ingresar...&#10;3. Tocar...">${esc(i.pasos)}</textarea>
    <div class="row"><div><label>Resultado esperado</label><textarea class="iEsp">${esc(i.esperado)}</textarea></div>
    <div><label>Resultado obtenido</label><textarea class="iObt">${esc(i.obtenido)}</textarea></div></div>
    <button class="secondary no-print iDel" style="margin-top:10px">Quitar incidente</button>`;
  if (i.severidad) div.querySelector(".iSev").value = i.severidad;
  if (i.tipo) div.querySelector(".iTipo").value = i.tipo;
  div.querySelectorAll("input,textarea,select").forEach((el) => el.addEventListener("input", guardar));
  div.querySelector(".iDel").onclick = () => {
    if (confirm("¿Quitar este incidente?")) {
      div.remove();
      guardar();
    }
  };
  $("#incidentes").appendChild(div);
}
data.incidentes.forEach(agregarIncidente);
$("#btnAgregarInc").onclick = () => {
  agregarIncidente();
  guardar();
};

/* reloj de la sesión */
const hora = () => {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
};
let tick = null;
function correrReloj() {
  clearInterval(tick);
  if (!data.inicioTs || data.finTs) {
    $("#timer").textContent = data.finTs ? "Sesión terminada" : "";
    return;
  }
  const pintar = () => {
    const rest = DURACION_MIN * 60 - Math.floor((Date.now() - data.inicioTs) / 1000);
    const a = Math.abs(rest),
      txt = `${Math.floor(a / 60)}:${String(a % 60).padStart(2, "0")}`;
    $("#timer").innerHTML =
      rest >= 0 ? `⏱ ${txt} restantes` : `<span style="color:#C8553D">⏱ Tiempo cumplido (+${txt})</span>`;
  };
  pintar();
  tick = setInterval(pintar, 1000);
}
$("#btnEmpezar").onclick = () => {
  if (data.inicioTs && !confirm("La sesión ya empezó. ¿Reiniciar el reloj?")) return;
  data.inicioTs = Date.now();
  data.finTs = null;
  if (!$("#fecha").value) $("#fecha").value = new Date().toISOString().slice(0, 10);
  $("#inicio").value = hora();
  $("#fin").value = "";
  guardar();
  correrReloj();
};
$("#btnTerminar").onclick = () => {
  data.finTs = Date.now();
  $("#fin").value = hora();
  guardar();
  correrReloj();
};

/* exportar */
function markdown() {
  const v = (id) => (data[id] || "").trim() || "—";
  let md = `# Reporte de sesión ${S.id}: ${S.titulo}\n\n## Misión\n\n${S.mision}\n\n## Datos de la sesión\n\n`;
  md += `| Campo | Valor |\n|---|---|\n| Tester(s) | ${v("tester")} |\n| Sistema operativo | ${v("os")} |\n| Dispositivo | ${v("dispositivo")} |\n| Navegador | ${v("navegador")} |\n| Rol | ${v("rol")} |\n| Funcionalidad | ${S.funcionalidad} |\n| Estrategia | Testing exploratorio |\n| Fecha | ${v("fecha")} |\n| Inicio y fin | ${v("inicio")} a ${v("fin")} (${$("#duracion").textContent} min) |\n\n`;
  md += `## Notas de pruebas\n\n${v("notas")}\n\n## Archivo de datos\n\n${v("datos")}\n\n## Otras notas\n\n${v("otras")}\n\n`;
  md += `## Incidentes (${data.incidentes.length})\n\n`;
  data.incidentes.forEach((i, k) => {
    md += `### ${k + 1}. ${i.titulo || "Sin título"}\n\n- **Severidad:** ${i.severidad}\n- **Dentro de la misión:** ${i.tipo}\n\n**Pasos:**\n\n${i.pasos || "—"}\n\n**Resultado esperado:** ${i.esperado || "—"}\n\n**Resultado obtenido:** ${i.obtenido || "—"}\n\n`;
  });
  if (!data.incidentes.length) md += "No se registraron incidentes.\n\n";
  md += `## Riesgos\n\n${v("riesgos")}\n\n## Inconvenientes\n\n${v("inconvenientes")}\n\n`;
  md += `## Métricas\n\n| Métrica | Valor |\n|---|---|\n| Armado de la sesión | ${v("mConf")} % |\n| Diseño y ejecución de pruebas | ${v("mDis")} % |\n| Reporte e investigación de defectos | ${v("mRep")} % |\n| Misión / oportunidad | ${v("mMis")} / ${v("mOpo")} |\n`;
  return md;
}
$("#btnDescargar").onclick = () => {
  guardar();
  const blob = new Blob([markdown()], { type: "text/markdown;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `reporte-sesion-${S.id}.md`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
$("#btnImprimir").onclick = () => {
  guardar();
  window.print();
};
$("#btnBorrar").onclick = () => {
  if (!confirm("Se borra todo lo escrito en este reporte. ¿Seguir?")) return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // el navegador no permite guardar: se sigue sin persistir
  }
  delete mem[KEY];
  location.reload();
};

actualizar();
correrReloj();
