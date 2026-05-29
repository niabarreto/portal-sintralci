/* ═══════════════════════════════════════════════════════════
   PORTAL SINTRALCI — app.js
   Sindicato de Trabajadores LCI Bogotá · EST. 2024
═══════════════════════════════════════════════════════════ */

/* ── CONFIGURACIÓN ─────────────────────────────────────── */
const CFG = {
  // Pega aquí la URL de tu Google Apps Script desplegado.
  // Si está vacío, la app funciona en modo demo con datos de ejemplo.
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyMZaPaLHJKKpyy6qexzRMi_EfGIwv6lHI-7c2FzmhfIWhMZwK39NulT09lR4wkDALZwA/exec',
  TOKEN_KEY:  'sintralci_token',
  USER_KEY:   'sintralci_user',
};

/* ── DATOS DEMO ────────────────────────────────────────── */
// Cuando SCRIPT_URL esté vacío, la app usa estos datos locales.
// Los cambios se guardan en memoria (se pierden al refrescar).
const DEMO = {
  users: [
    { id:'u1', email:'junta@sintralci.com',  nombre:'Nia',    apellido:'Barreto', telefono:'300 100 0001', cargo:'Presidenta',   num_afiliado:'001', fecha_ingreso:'2024-03-15', rol:'junta',    activo:true,  password:'junta2025'  },
    { id:'u2', email:'carlos@lci.com',       nombre:'Carlos', apellido:'Mejía',   telefono:'310 234 5678', cargo:'Docente',       num_afiliado:'023', fecha_ingreso:'2024-06-20', rol:'afiliado', activo:true,  password:'carlos123'  },
    { id:'u3', email:'maria@lci.com',        nombre:'María',  apellido:'Torres',  telefono:'315 876 5432', cargo:'Administrativo',num_afiliado:'031', fecha_ingreso:'2024-08-10', rol:'afiliado', activo:true,  password:'maria123'   },
    { id:'u4', email:'luis@lci.com',         nombre:'Luis',   apellido:'Ramírez', telefono:'320 444 5566', cargo:'Docente',       num_afiliado:'047', fecha_ingreso:'2024-11-05', rol:'afiliado', activo:false, password:'luis123'    },
  ],
  clasificados: [
    { id:'cl1', fecha:'2026-05-15T10:00:00', email_afiliado:'carlos@lci.com', nombre_afiliado:'Carlos Mejía',  categoria:'Venta de artículos', titulo:'Televisor Samsung 43" Smart TV',      descripcion:'En perfecto estado, 2 años de uso. Incluye control remoto y base original.', precio:'$650.000', url_imagen:'', estado:'aprobado' },
    { id:'cl2', fecha:'2026-05-20T14:30:00', email_afiliado:'maria@lci.com',  nombre_afiliado:'María Torres',  categoria:'Servicios',          titulo:'Clases de inglés todos los niveles',  descripcion:'Profesora certificada ICFES. Clases presenciales o virtuales. Grupos reducidos de máximo 4 personas.', precio:'$40.000/hora', url_imagen:'', estado:'aprobado' },
    { id:'cl3', fecha:'2026-05-25T09:00:00', email_afiliado:'carlos@lci.com', nombre_afiliado:'Carlos Mejía',  categoria:'Arriendos / Vivienda',titulo:'Habitación en Chapinero, todo incluido',descripcion:'Habitación amoblada, baño compartido, zona muy tranquila. A 5 min de Transmilenio. Incluye WiFi y servicios.', precio:'$550.000/mes', url_imagen:'', estado:'pendiente' },
    { id:'cl4', fecha:'2026-05-27T11:00:00', email_afiliado:'maria@lci.com',  nombre_afiliado:'María Torres',  categoria:'Se busca / Necesito', titulo:'Busco bicicleta aro 26 usada',         descripcion:'Para desplazarme al trabajo. Que esté en buen estado y tenga frenos seguros. Pago de contado.', precio:'Hasta $250.000', url_imagen:'', estado:'pendiente' },
  ],
  pqrs: [
    { id:'pq1', fecha:'2026-05-10T08:30:00', email_afiliado:'carlos@lci.com', nombre_afiliado:'Carlos Mejía', telefono:'310 234 5678', tipo:'Petición',   asunto:'Solicitud de copia de la convención colectiva',     descripcion:'Quisiera recibir la copia actualizada de la convención colectiva vigente para revisarla con calma.', estado:'resuelto',   respuesta:'Hola Carlos, adjuntamos la convención en la sección de documentos del portal. Queda disponible para todos los afiliados.', fecha_respuesta:'2026-05-12', respondido_por:'Nia Barreto' },
    { id:'pq2', fecha:'2026-05-25T16:00:00', email_afiliado:'maria@lci.com',  nombre_afiliado:'María Torres', telefono:'315 876 5432', tipo:'Sugerencia',  asunto:'Propuesta de fondo de auxilio educativo',           descripcion:'Propongo que el sindicato gestione un fondo de auxilio educativo para los hijos de los afiliados que estén en universidad.', estado:'en_tramite', respuesta:'', fecha_respuesta:'', respondido_por:'' },
    { id:'pq3', fecha:'2026-05-28T07:00:00', email_afiliado:'carlos@lci.com', nombre_afiliado:'Carlos Mejía', telefono:'310 234 5678', tipo:'Queja',       asunto:'Problema con marcación de horas extra',             descripcion:'En los últimos dos meses no me han reconocido correctamente las horas extra realizadas los sábados.', estado:'abierto',    respuesta:'', fecha_respuesta:'', respondido_por:'' },
  ],
  noticias: [
    { id:'nt1', fecha:'2026-05-28T09:00:00', titulo:'Asamblea Anual 2026 — 4 de junio, 9:00 AM', contenido:'Convocamos a todos los afiliados a nuestra Asamblea Anual el próximo 4 de junio a las 9:00 AM en modalidad virtual. Su participación es fundamental para las decisiones del sindicato. El permiso sindical está garantizado para ese día y la recuperación de clases será remunerada. Pronto compartiremos el enlace de conexión y la agenda completa.\n\n¡Tu participación hace la diferencia!', autor:'Junta Directiva', visible:true },
    { id:'nt2', fecha:'2026-05-20T10:00:00', titulo:'Parqueadero SINTRALCI disponible para todos', contenido:'Recordamos a todos los afiliados que el parqueadero del sindicato está disponible para carro y moto. La reserva es 100% gratuita y se hace desde el celular.\n\nEnlace: bit.ly/Parqueadero-SINTRALCI\nHorario: Lunes a Viernes 7am–6pm · Sábados 7am–1pm', autor:'Junta Directiva', visible:true },
  ],
};

/* ── ESTADO GLOBAL ─────────────────────────────────────── */
const S = {
  user:     null,
  token:    null,
  route:    null,
  demoMode: !CFG.SCRIPT_URL,
  // Copias de los datos demo para poder mutarlos en memoria
  _demo:    null,
};

/* ── UTILIDADES ────────────────────────────────────────── */
const $  = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);

function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' });
}

function initials(nombre, apellido) {
  const n = (nombre || '')[0] || '';
  const a = (apellido || '')[0] || '';
  return (n + a).toUpperCase() || '?';
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0;
    return (c==='x' ? r : (r&0x3|0x8)).toString(16);
  });
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function toast(msg, type = 'info') {
  const icons = { success:'✓', error:'✕', info:'ℹ' };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icons[type]||''}</span> ${esc(msg)}`;
  $('toast-rack').appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

/* ── MODAL ─────────────────────────────────────────────── */
function openModal(title, bodyHtml, footerHtml = '') {
  $('modal-inner').innerHTML = `
    <div class="modal-head">
      <h3>${esc(title)}</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">${bodyHtml}</div>
    ${footerHtml ? `<div class="modal-foot">${footerHtml}</div>` : ''}
  `;
  $('modal-bg').classList.remove('hidden');
}

function closeModal() { $('modal-bg').classList.add('hidden'); }
function closeModalOutside(e) { if (e.target === $('modal-bg')) closeModal(); }

/* ── API ───────────────────────────────────────────────── */
async function api(action, data = {}) {
  if (S.demoMode) return demoApi(action, data);

  const payload = { action, token: S.token, ...data };
  try {
    const res = await fetch(CFG.SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (e) {
    return { success: false, message: 'Error de conexión: ' + e.message };
  }
}

/* ── DEMO API ──────────────────────────────────────────── */
async function demoApi(action, data) {
  await delay(250 + Math.random() * 250);
  const d = S._demo;

  // ─ AUTH
  if (action === 'login') {
    const u = d.users.find(u => u.email === data.email && u.password === data.password && u.activo);
    if (!u) return { success: false, message: 'Correo o contraseña incorrectos.' };
    const token = uuid();
    u._token = token;
    return { success: true, token, user: safeUser(u) };
  }
  if (action === 'validateToken') {
    const u = d.users.find(u => u._token === data.token);
    if (!u) return { success: false };
    return { success: true, user: safeUser(u) };
  }

  // ─ PROFILE
  if (action === 'updateProfile') {
    const u = d.users.find(u => u.id === S.user.id);
    if (!u) return { success: false, message: 'Usuario no encontrado.' };
    if (data.telefono) u.telefono = data.telefono;
    S.user = safeUser(u);
    localStorage.setItem(CFG.USER_KEY, JSON.stringify(S.user));
    renderSidebarUser();
    return { success: true };
  }
  if (action === 'changePassword') {
    const u = d.users.find(u => u.id === S.user.id);
    if (!u || u.password !== data.currentPwd) return { success: false, message: 'La contraseña actual es incorrecta.' };
    u.password = data.newPwd;
    return { success: true };
  }

  // ─ CLASIFICADOS
  if (action === 'getClasificados') {
    const approved = d.clasificados.filter(c => c.estado === 'aprobado');
    return { success: true, data: approved };
  }
  if (action === 'getMisClasificados') {
    const mine = d.clasificados.filter(c => c.email_afiliado === S.user.email);
    return { success: true, data: mine };
  }
  if (action === 'submitClasificado') {
    const nuevo = {
      id: 'cl' + Date.now(),
      fecha: new Date().toISOString(),
      email_afiliado: S.user.email,
      nombre_afiliado: S.user.nombre + ' ' + S.user.apellido,
      categoria: data.categoria,
      titulo: data.titulo,
      descripcion: data.descripcion,
      precio: data.precio || '',
      url_imagen: '',
      estado: 'pendiente',
    };
    d.clasificados.unshift(nuevo);
    return { success: true };
  }
  if (action === 'updateClasificadoEstado') {
    const cl = d.clasificados.find(c => c.id === data.id);
    if (!cl) return { success: false, message: 'No encontrado.' };
    cl.estado = data.estado;
    return { success: true };
  }
  if (action === 'getAllClasificados') {
    if (S.user.rol !== 'junta') return { success: false, message: 'No autorizado.' };
    return { success: true, data: [...d.clasificados].reverse() };
  }

  // ─ PQRS
  if (action === 'getMisPQRS') {
    const mine = d.pqrs.filter(p => p.email_afiliado === S.user.email);
    return { success: true, data: mine };
  }
  if (action === 'submitPQRS') {
    const u = d.users.find(u => u.id === S.user.id);
    const nuevo = {
      id: 'pq' + Date.now(),
      fecha: new Date().toISOString(),
      email_afiliado: S.user.email,
      nombre_afiliado: S.user.nombre + ' ' + S.user.apellido,
      telefono: u ? u.telefono : '',
      tipo: data.tipo,
      asunto: data.asunto,
      descripcion: data.descripcion,
      estado: 'abierto',
      respuesta: '',
      fecha_respuesta: '',
      respondido_por: '',
    };
    d.pqrs.unshift(nuevo);
    return { success: true };
  }
  if (action === 'getAllPQRS') {
    if (S.user.rol !== 'junta') return { success: false, message: 'No autorizado.' };
    return { success: true, data: [...d.pqrs].reverse() };
  }
  if (action === 'responderPQRS') {
    if (S.user.rol !== 'junta') return { success: false, message: 'No autorizado.' };
    const pq = d.pqrs.find(p => p.id === data.id);
    if (!pq) return { success: false, message: 'No encontrado.' };
    pq.respuesta = data.respuesta;
    pq.estado = data.estado;
    pq.fecha_respuesta = new Date().toISOString();
    pq.respondido_por = S.user.nombre + ' ' + S.user.apellido;
    return { success: true };
  }

  // ─ NOTICIAS
  if (action === 'getNoticias') {
    const visible = S.user.rol === 'junta' ? d.noticias : d.noticias.filter(n => n.visible);
    return { success: true, data: [...visible].reverse() };
  }
  if (action === 'createNoticia') {
    if (S.user.rol !== 'junta') return { success: false, message: 'No autorizado.' };
    const nueva = {
      id: 'nt' + Date.now(),
      fecha: new Date().toISOString(),
      titulo: data.titulo,
      contenido: data.contenido,
      autor: S.user.nombre + ' ' + S.user.apellido,
      visible: true,
    };
    d.noticias.unshift(nueva);
    return { success: true };
  }
  if (action === 'deleteNoticia') {
    if (S.user.rol !== 'junta') return { success: false, message: 'No autorizado.' };
    const idx = d.noticias.findIndex(n => n.id === data.id);
    if (idx > -1) d.noticias.splice(idx, 1);
    return { success: true };
  }

  // ─ AFILIADOS (admin)
  if (action === 'getAfiliados') {
    if (S.user.rol !== 'junta') return { success: false, message: 'No autorizado.' };
    return { success: true, data: d.users.map(safeUser) };
  }
  if (action === 'createAfiliado') {
    if (S.user.rol !== 'junta') return { success: false, message: 'No autorizado.' };
    if (d.users.find(u => u.email === data.email)) return { success: false, message: 'Ya existe un usuario con ese correo.' };
    const nuevo = {
      id: 'u' + Date.now(),
      email: data.email,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono || '',
      cargo: data.cargo || '',
      num_afiliado: data.num_afiliado || '',
      fecha_ingreso: data.fecha_ingreso || new Date().toISOString().split('T')[0],
      rol: data.rol || 'afiliado',
      activo: true,
      password: data.password || 'Lci2025!',
    };
    d.users.push(nuevo);
    return { success: true };
  }
  if (action === 'updateAfiliado') {
    if (S.user.rol !== 'junta') return { success: false, message: 'No autorizado.' };
    const u = d.users.find(u => u.id === data.id);
    if (!u) return { success: false, message: 'No encontrado.' };
    Object.assign(u, {
      nombre: data.nombre ?? u.nombre,
      apellido: data.apellido ?? u.apellido,
      telefono: data.telefono ?? u.telefono,
      cargo: data.cargo ?? u.cargo,
      rol: data.rol ?? u.rol,
      activo: data.activo ?? u.activo,
    });
    return { success: true };
  }
  if (action === 'resetPassword') {
    if (S.user.rol !== 'junta') return { success: false, message: 'No autorizado.' };
    const u = d.users.find(u => u.id === data.id);
    if (!u) return { success: false, message: 'No encontrado.' };
    u.password = data.newPwd;
    return { success: true };
  }

  return { success: false, message: 'Acción no reconocida: ' + action };
}

function safeUser(u) {
  const { password, _token, ...safe } = u;
  return safe;
}

/* ── AUTH ──────────────────────────────────────────────── */
async function doLogin() {
  const email = $('l-email').value.trim();
  const pwd   = $('l-pwd').value;
  const err   = $('l-err');
  const btn   = $('l-btn');

  err.classList.remove('show');

  if (!email || !pwd) {
    err.textContent = 'Completa todos los campos.';
    err.classList.add('show');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spin"></span> Ingresando…';

  const res = await api('login', { email, password: pwd });

  if (res.success) {
    S.token = res.token;
    S.user  = res.user;
    localStorage.setItem(CFG.TOKEN_KEY, res.token);
    localStorage.setItem(CFG.USER_KEY,  JSON.stringify(res.user));
    showApp();
    go('home');
  } else {
    err.textContent = res.message || 'Correo o contraseña incorrectos.';
    err.classList.add('show');
    btn.disabled = false;
    btn.innerHTML = 'Ingresar';
  }
}

function doLogout() {
  localStorage.removeItem(CFG.TOKEN_KEY);
  localStorage.removeItem(CFG.USER_KEY);
  S.user = null; S.token = null; S.route = null;
  $('app-shell').classList.add('hidden');
  $('login-screen').classList.remove('hidden');
  $('l-email').value = '';
  $('l-pwd').value = '';
  $('l-err').classList.remove('show');
}

async function restoreSession() {
  const token = localStorage.getItem(CFG.TOKEN_KEY);
  const user  = localStorage.getItem(CFG.USER_KEY);
  if (!token || !user) return false;

  S.token = token;
  const res = await api('validateToken', { token });
  if (res.success) {
    S.user = res.user;
    return true;
  }
  localStorage.removeItem(CFG.TOKEN_KEY);
  localStorage.removeItem(CFG.USER_KEY);
  return false;
}

/* ── APP SHELL ─────────────────────────────────────────── */
function showApp() {
  $('login-screen').classList.add('hidden');
  $('app-shell').classList.remove('hidden');
  renderSidebar();
}

function renderSidebar() {
  const u = S.user;

  // Brand
  $('sidebar-brand').innerHTML = `
    <svg width="40" height="40" viewBox="155 218 286 286" xmlns="http://www.w3.org/2000/svg">
      <circle cx="297.85" cy="360.53" r="128" fill="rgba(255,255,255,.2)"/>
      <path fill="#fff" d="M357.04,295.13l6.31-.53,2.72,32.55-30.33,2.54-1.14-13.58s-.9-10.04,5.43-15.35c6.33-5.31,17-5.63,17-5.63Z"/>
      <path fill="#fff" d="M317.14,298.37l6.31-.53,2.72,32.55-30.33,2.54-1.14-13.58s-.9-10.04,5.43-15.35c6.33-5.31,17-5.63,17-5.63Z"/>
      <path fill="#fff" d="M288.47,362.29l-4.92-60.16-6.31.53s-10.67.32-17,5.63c-6.33,5.31-5.43,15.35-5.43,15.35l3.24,36.3c-.05.5-.07,1-.07,1.51.03,8.33,6.81,15.06,15.14,15.04,8-.03,14.51-6.29,14.99-14.16l.36-.03Z"/>
      <path fill="#fff" d="M426.17,345.47c-.61-7.76-3.76-13.18-11.63-12.56v-.02s-9.14.76-9.14.76l.28,3.3,1.8,21.52.28,3.31,9.14-.76v-.03c7.83-.65,9.96-7.78,9.35-15.52Z"/>
      <polygon fill="#fff" points="398.39 334.32 375.27 336.15 376.06 346.74 399.29 344.84 398.39 334.32"/>
      <polygon fill="#fff" points="399.43 351.64 376.31 353.47 377.1 364.05 400.33 362.16 399.43 351.64"/>
      <path fill="#fff" d="M371.7,384.34l-.67-8.04-.02-.21-.06-.66-3.22-38.44-72.16,6.04c-.17,1.25-.05,2.65.35,4.19,4.56,10.21,20.94,20.39,43.25,21.62l.73,8.95-1.5.08-1.53.08s-5.28-.26-6.97-.49c-4.05-.57-8.2-1.41-12.22-2.62-6.45-1.94-12.56-4.82-17.34-9.06-1.68-1.49-3.19-3.15-4.5-4.99-.29,2.19-.9,5.13-2.2,8.14-1.09,2.5-2.65,5.05-4.9,7.24-2.18,2.12-4.34,3.64-6.31,4.74-4.83,2.7-8.51,2.87-8.51,2.87l-14.04,1.33-11.64.97c-21.55,1.5-27.65-1.8-27.65-1.8l.18,2.76.84,9.09s1.39,7.75,2.26,10.66c10.22,34.27,42.63,54.01,78.21,51.12,36.38-2.96,65.97-23.85,69.33-63.65.27-3.18.35-6.49.27-9.91Z"/>
      <path fill="#fff" d="M248.34,361.95l-3.72-45.45-6.31.53s-10.67.32-17,5.63c-6.33,5.31-5.43,15.35-5.43,15.35l2.34,26.22s.01,0,.02,0c.82,8.23,8.12,14.28,16.38,13.53,8.1-.74,14.1-7.75,13.68-15.8.01,0,.03,0,.04,0Z"/>
    </svg>
    <div class="sb-brand-text">
      <strong>SINTRALCI</strong>
      <span>Portal Sindical · LCI Bogotá</span>
    </div>
  `;

  // Nav
  const memberNav = [
    { id:'home',        icon:'🏠', label:'Inicio' },
    { id:'perfil',      icon:'👤', label:'Mi Perfil' },
    { id:'clasificados',icon:'📌', label:'Clasificados' },
    { id:'pqrs',        icon:'📋', label:'PQRS' },
    { id:'noticias',    icon:'📰', label:'Noticias' },
  ];
  const adminNav = [
    { id:'admin-afiliados',    icon:'👥', label:'Afiliados' },
    { id:'admin-clasificados', icon:'✅', label:'Gestionar Clasificados' },
    { id:'admin-pqrs',         icon:'📨', label:'Gestionar PQRS' },
    { id:'admin-noticias',     icon:'✏️', label:'Comunicados' },
  ];

  let navHtml = memberNav.map(n => navItem(n)).join('');
  if (u.rol === 'junta') {
    navHtml += `<div class="nav-divider"></div><div class="nav-section-label">Administración</div>`;
    navHtml += adminNav.map(n => navItem(n)).join('');
  }
  $('sidebar-nav').innerHTML = navHtml;

  // Bottom nav (mobile)
  const btmItems = [
    { id:'home',         icon:'🏠', label:'Inicio' },
    { id:'clasificados', icon:'📌', label:'Tablero' },
    { id:'pqrs',         icon:'📋', label:'PQRS' },
    { id:'noticias',     icon:'📰', label:'Noticias' },
    { id:'perfil',       icon:'👤', label:'Perfil' },
  ];
  $('btm-nav-inner').innerHTML = btmItems.map(n => `
    <button class="btm-item" id="btn-${n.id}" onclick="go('${n.id}')">
      <span class="btm-icon">${n.icon}</span>
      <span>${n.label}</span>
    </button>
  `).join('');

  // User avatar in topbar
  $('topbar-user').innerHTML = `
    <span class="text-sm" style="color:var(--muted);">${esc(u.nombre)} ${esc(u.apellido)}</span>
    <div class="user-avatar" style="width:32px;height:32px;font-size:.75rem;">${initials(u.nombre,u.apellido)}</div>
  `;

  renderSidebarUser();
}

function navItem(n) {
  return `<div class="nav-item" id="nav-${n.id}" onclick="go('${n.id}')" role="button" tabindex="0">
    <span class="nav-icon">${n.icon}</span>
    <span>${n.label}</span>
  </div>`;
}

function renderSidebarUser() {
  const u = S.user;
  $('sidebar-user').innerHTML = `
    <div class="user-avatar">${initials(u.nombre, u.apellido)}</div>
    <div class="user-info">
      <strong>${esc(u.nombre)} ${esc(u.apellido)}</strong>
      <span>Afiliado #${esc(u.num_afiliado)} · ${u.rol === 'junta' ? 'Junta Directiva' : 'Afiliado'}</span>
    </div>
    <button class="logout-btn" onclick="doLogout()" title="Cerrar sesión">⏏</button>
  `;
}

function setActiveNav(route) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.btm-item').forEach(el => el.classList.remove('active'));
  const navEl = $(`nav-${route}`);
  const btmEl = $(`btn-${route}`);
  if (navEl) navEl.classList.add('active');
  if (btmEl) btmEl.classList.add('active');
}

function toggleSidebar() {
  $('sidebar').classList.toggle('open');
  $('sidebar-overlay').classList.toggle('open');
}
function closeSidebar() {
  $('sidebar').classList.remove('open');
  $('sidebar-overlay').classList.remove('open');
}

function setPageTitle(title) { $('page-title').textContent = title; }

/* ── NAVIGATION ────────────────────────────────────────── */
const VIEWS = {
  'home':               viewHome,
  'perfil':             viewPerfil,
  'clasificados':       viewClasificados,
  'pqrs':               viewPQRS,
  'noticias':           viewNoticias,
  'admin-afiliados':    viewAdminAfiliados,
  'admin-clasificados': viewAdminClasificados,
  'admin-pqrs':         viewAdminPQRS,
  'admin-noticias':     viewAdminNoticias,
};

async function go(route) {
  if (!VIEWS[route]) return;
  S.route = route;
  setActiveNav(route);
  closeSidebar();
  const va = $('view-area');
  va.scrollTop = 0;
  va.innerHTML = `<div class="empty" style="opacity:.6"><div class="empty-icon" style="font-size:1.5rem;opacity:.5">●</div><p style="font-size:.82rem">Cargando…</p></div>`;
  await VIEWS[route]();
  // Entrance animation
  va.style.cssText += ';opacity:0;transform:translateY(10px);transition:opacity .2s ease,transform .2s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    va.style.opacity = '1';
    va.style.transform = 'translateY(0)';
    setTimeout(() => { va.style.cssText = va.style.cssText.replace(/opacity:[^;]+;transform:[^;]+;transition:[^;]+;?/g,''); }, 250);
  }));
}

/* ═══════════════════════════════════════════════════════
   VISTAS — MIEMBRO
═══════════════════════════════════════════════════════ */

/* ── INICIO ────────────────────────────────────────────── */
async function viewHome() {
  setPageTitle('Inicio');
  const u = S.user;

  const [resClasif, resPQRS, resNoticias] = await Promise.all([
    api('getMisClasificados'),
    api('getMisPQRS'),
    api('getNoticias'),
  ]);

  const misClasif  = resClasif.data   || [];
  const misPQRS    = resPQRS.data     || [];
  const noticias   = resNoticias.data || [];

  const clasifActivos = misClasif.filter(c => c.estado === 'aprobado').length;
  const pqrsAbiertos  = misPQRS.filter(p => p.estado !== 'resuelto').length;

  const noticiasHtml = noticias.slice(0,3).map(n => `
    <div class="news-card">
      <div class="news-date">📅 ${fmtDate(n.fecha)}</div>
      <div class="news-title">${esc(n.titulo)}</div>
      <div class="news-content">${esc(n.contenido).replace(/\n/g,'<br>').substring(0,180)}${n.contenido.length > 180 ? '…' : ''}</div>
      <div class="news-author">— ${esc(n.autor)}</div>
    </div>
  `).join('') || `<div class="empty"><div class="empty-icon">📭</div><p>No hay noticias aún.</p></div>`;

  $('view-area').innerHTML = `
    <div class="home-banner">
      <div class="home-banner-avatar">${initials(u.nombre, u.apellido)}</div>
      <div class="home-banner-content">
        <h2>¡Hola, <span class="name-accent">${esc(u.nombre)}</span>!</h2>
        <p>${esc(u.cargo)} · LCI Bogotá</p>
      </div>
      <div class="home-banner-right">
        <span class="afiliado-badge">#${esc(u.num_afiliado)}</span>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card" style="cursor:pointer" onclick="go('clasificados')">
        <div class="stat-num">${clasifActivos}</div>
        <div class="stat-lbl">Clasificados activos</div>
      </div>
      <div class="stat-card" style="cursor:pointer" onclick="go('pqrs')">
        <div class="stat-num">${pqrsAbiertos}</div>
        <div class="stat-lbl">PQRS en trámite</div>
      </div>
      <div class="stat-card" style="cursor:pointer" onclick="go('noticias')">
        <div class="stat-num">${noticias.length}</div>
        <div class="stat-lbl">Comunicados</div>
      </div>
    </div>

    <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-bottom:1.5rem;">
      <button class="btn btn-primary" onclick="go('clasificados')">📌 Publicar clasificado</button>
      <button class="btn btn-secondary" onclick="go('pqrs')">📋 Enviar PQRS</button>
    </div>

    <p class="section-lbl">Últimas noticias</p>
    <div style="display:flex;flex-direction:column;gap:.75rem;">${noticiasHtml}</div>
    ${S.demoMode ? `<div class="card card-sm mt-3" style="border-left:3px solid var(--amb);border-radius:0 var(--r) var(--r) 0;">
      <div class="card-body text-sm">⚙️ <strong>Modo demo</strong> — Los datos son de ejemplo. Configura <code>CFG.SCRIPT_URL</code> en <code>app.js</code> para conectar con el backend real.</div>
    </div>` : ''}
  `;
}

/* ── MI PERFIL ─────────────────────────────────────────── */
async function viewPerfil() {
  setPageTitle('Mi Perfil');
  const u = S.user;

  $('view-area').innerHTML = `
    <div style="max-width:580px;">
      <div class="card" style="margin-bottom:1rem;">
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;padding-bottom:1.25rem;border-bottom:1px solid var(--border);">
            <div class="user-avatar" style="width:60px;height:60px;font-size:1.4rem;">${initials(u.nombre,u.apellido)}</div>
            <div>
              <div style="font-size:1.1rem;font-weight:800;">${esc(u.nombre)} ${esc(u.apellido)}</div>
              <div class="text-sm text-muted">${esc(u.cargo)} · ${u.rol === 'junta' ? '<span class="badge badge-or">Junta Directiva</span>' : '<span class="badge badge-muted">Afiliado</span>'}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem 1.5rem;">
            ${infoRow('Afiliado N°', '#' + u.num_afiliado)}
            ${infoRow('Correo',      u.email)}
            ${infoRow('Cargo',       u.cargo)}
            ${infoRow('Ingreso',     fmtDate(u.fecha_ingreso))}
          </div>
          <div class="form-group mt-3" style="max-width:280px;">
            <label class="form-label">Teléfono / WhatsApp</label>
            <input type="tel" id="p-telefono" class="form-control" value="${esc(u.telefono || '')}" placeholder="300 000 0000" />
          </div>
          <div id="p-err" class="form-error-msg"></div>
          <div class="mt-2">
            <button class="btn btn-primary" id="p-save-btn" onclick="guardarPerfil()">Guardar cambios</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="fw-700" style="margin-bottom:1rem;">🔒 Cambiar contraseña</div>
          <div class="form-group">
            <label class="form-label">Contraseña actual</label>
            <input type="password" id="pwd-current" class="form-control" placeholder="••••••••" />
          </div>
          <div class="form-group">
            <label class="form-label">Nueva contraseña</label>
            <input type="password" id="pwd-new" class="form-control" placeholder="••••••••" />
          </div>
          <div class="form-group">
            <label class="form-label">Confirmar nueva contraseña</label>
            <input type="password" id="pwd-confirm" class="form-control" placeholder="••••••••" />
          </div>
          <div id="pwd-err" class="form-error-msg"></div>
          <div class="mt-2">
            <button class="btn btn-secondary" id="pwd-btn" onclick="cambiarPassword()">Cambiar contraseña</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function infoRow(label, value) {
  return `<div>
    <div class="text-xs text-muted" style="margin-bottom:.15rem;">${esc(label)}</div>
    <div class="text-sm fw-600">${esc(value) || '—'}</div>
  </div>`;
}

async function guardarPerfil() {
  const telefono = $('p-telefono').value.trim();
  const err = $('p-err');
  const btn = $('p-save-btn');
  err.classList.remove('show');

  btn.disabled = true;
  btn.innerHTML = '<span class="spin"></span>';

  const res = await api('updateProfile', { telefono });

  if (res.success) {
    toast('Perfil actualizado correctamente.', 'success');
    S.user.telefono = telefono;
  } else {
    err.textContent = res.message || 'Error al guardar.';
    err.classList.add('show');
  }
  btn.disabled = false;
  btn.innerHTML = 'Guardar cambios';
}

async function cambiarPassword() {
  const current = $('pwd-current').value;
  const newPwd  = $('pwd-new').value;
  const confirm = $('pwd-confirm').value;
  const err = $('pwd-err');
  const btn = $('pwd-btn');
  err.classList.remove('show');

  if (!current || !newPwd || !confirm) { err.textContent='Completa todos los campos.'; err.classList.add('show'); return; }
  if (newPwd !== confirm) { err.textContent='Las contraseñas nuevas no coinciden.'; err.classList.add('show'); return; }
  if (newPwd.length < 6) { err.textContent='La contraseña debe tener al menos 6 caracteres.'; err.classList.add('show'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spin"></span>';

  const res = await api('changePassword', { currentPwd: current, newPwd });
  if (res.success) {
    toast('Contraseña cambiada correctamente.', 'success');
    $('pwd-current').value = '';
    $('pwd-new').value = '';
    $('pwd-confirm').value = '';
  } else {
    err.textContent = res.message || 'Error al cambiar contraseña.';
    err.classList.add('show');
  }
  btn.disabled = false;
  btn.innerHTML = 'Cambiar contraseña';
}

/* ── CLASIFICADOS ──────────────────────────────────────── */
let _clTabActual = 'tablero';

async function viewClasificados() {
  setPageTitle('Clasificados');

  $('view-area').innerHTML = `
    <div class="page-head">
      <div class="page-head-left">
        <h2>Clasificados</h2>
        <p>Artículos, servicios y más entre compañeros</p>
      </div>
      <div class="page-head-right">
        <button class="btn btn-primary" onclick="openNuevoClasificado()">+ Nuevo anuncio</button>
      </div>
    </div>
    <div class="tab-bar">
      <button class="tab-btn ${_clTabActual==='tablero'?'active':''}" onclick="switchClTab('tablero',this)">🏠 Tablero</button>
      <button class="tab-btn ${_clTabActual==='mis'?'active':''}" onclick="switchClTab('mis',this)">📋 Mis publicaciones</button>
    </div>
    <div id="cl-content"></div>
  `;

  loadClasificados();
}

function switchClTab(tab, el) {
  _clTabActual = tab;
  document.querySelectorAll('.tab-bar .tab-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  loadClasificados();
}

async function loadClasificados() {
  const cont = $('cl-content');
  cont.innerHTML = `<div class="empty"><p>Cargando…</p></div>`;

  if (_clTabActual === 'tablero') {
    const res = await api('getClasificados');
    const list = res.data || [];
    if (!list.length) {
      cont.innerHTML = `<div class="empty"><div class="empty-icon">📭</div><p>No hay clasificados aprobados aún.</p></div>`;
      return;
    }
    cont.innerHTML = `<div style="display:flex;flex-direction:column;gap:.75rem;">${list.map(clCard).join('')}</div>`;
  } else {
    const res = await api('getMisClasificados');
    const list = res.data || [];
    if (!list.length) {
      cont.innerHTML = `<div class="empty"><div class="empty-icon">📭</div><p>Aún no has publicado clasificados.</p><button class="btn btn-primary mt-2" onclick="openNuevoClasificado()">+ Publicar ahora</button></div>`;
      return;
    }
    cont.innerHTML = `<div style="display:flex;flex-direction:column;gap:.75rem;">${list.map(c => clCard(c, true)).join('')}</div>`;
  }
}

function clCard(c, showStatus = false) {
  const statusBadge = showStatus ? `<span class="badge ${estadoBadgeClass(c.estado)}">${estadoLabel(c.estado)}</span>` : '';
  const catIcon = { 'Venta de artículos':'🛍️', 'Servicios':'🔧', 'Se busca / Necesito':'🔍', 'Arriendos / Vivienda':'🏠', 'Donaciones / Regalos':'🎁' }[c.categoria] || '📢';

  return `
    <div class="cl-card">
      <div class="cl-img">
        ${c.url_imagen ? `<img src="${esc(c.url_imagen)}" alt="foto" onerror="this.parentElement.innerHTML='${catIcon}'" />` : catIcon}
      </div>
      <div class="cl-body">
        <div style="display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;">
          <span class="badge badge-muted">${esc(c.categoria)}</span>
          ${statusBadge}
        </div>
        <div class="cl-title">${esc(c.titulo)}</div>
        <div class="cl-desc">${esc(c.descripcion)}</div>
        ${c.precio ? `<div class="cl-price">${esc(c.precio)}</div>` : ''}
        <div class="cl-meta">
          <span>👤 ${esc(c.nombre_afiliado)}</span>
          <span>📅 ${fmtDate(c.fecha)}</span>
        </div>
      </div>
    </div>
  `;
}

function openNuevoClasificado() {
  openModal('Nuevo Clasificado',
    `<div class="form-group">
      <label class="form-label">Categoría <span class="req">*</span></label>
      <select id="nc-cat" class="form-control">
        <option value="">— Selecciona —</option>
        <option>Venta de artículos</option>
        <option>Servicios</option>
        <option>Se busca / Necesito</option>
        <option>Arriendos / Vivienda</option>
        <option>Donaciones / Regalos</option>
        <option>Otros avisos</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Título <span class="req">*</span></label>
      <input type="text" id="nc-titulo" class="form-control" placeholder="Ej: Vendo nevera LG 200L" maxlength="80" />
    </div>
    <div class="form-group">
      <label class="form-label">Precio (opcional)</label>
      <input type="text" id="nc-precio" class="form-control" placeholder="Ej: $150.000 · Gratis · Negociable" />
    </div>
    <div class="form-group">
      <label class="form-label">Descripción <span class="req">*</span></label>
      <textarea id="nc-desc" class="form-control" placeholder="Describe el artículo o servicio: estado, características, condiciones de venta…" maxlength="500"></textarea>
    </div>
    <div id="nc-err" class="form-error-msg"></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" id="nc-btn" onclick="submitClasificado()">Publicar</button>`
  );
}

async function submitClasificado() {
  const cat   = $('nc-cat').value;
  const titulo= $('nc-titulo').value.trim();
  const desc  = $('nc-desc').value.trim();
  const precio= $('nc-precio').value.trim();
  const err   = $('nc-err');
  const btn   = $('nc-btn');

  if (!cat || !titulo || !desc) { err.textContent='Completa los campos obligatorios.'; err.classList.add('show'); return; }

  btn.disabled=true; btn.innerHTML='<span class="spin"></span>';

  const res = await api('submitClasificado', { categoria:cat, titulo, descripcion:desc, precio });

  if (res.success) {
    closeModal();
    toast('¡Clasificado enviado! La junta lo revisará pronto.', 'success');
    _clTabActual = 'mis';
    viewClasificados();
  } else {
    err.textContent = res.message || 'Error al enviar.';
    err.classList.add('show');
    btn.disabled=false; btn.innerHTML='Publicar';
  }
}

/* ── PQRS ──────────────────────────────────────────────── */
async function viewPQRS() {
  setPageTitle('PQRS');
  const res = await api('getMisPQRS');
  const list = res.data || [];

  const listHtml = list.length ? list.map(pq => `
    <div class="pq-card" onclick="verPQRS('${esc(pq.id)}')">
      <div class="pq-card-top">
        <div style="display:flex;gap:.4rem;flex-wrap:wrap;">
          <span class="badge badge-blue">${esc(pq.tipo)}</span>
          <span class="badge ${estadoPQRSClass(pq.estado)}">${estadoPQRSLabel(pq.estado)}</span>
        </div>
        <span class="text-xs text-muted">${fmtDate(pq.fecha)}</span>
      </div>
      <div class="pq-asunto">${esc(pq.asunto)}</div>
      <div class="pq-desc">${esc(pq.descripcion).substring(0,120)}${pq.descripcion.length>120?'…':''}</div>
      ${pq.respuesta ? `<div class="response-box"><div class="resp-label">Respuesta de la junta</div><div class="resp-text">${esc(pq.respuesta).substring(0,150)}${pq.respuesta.length>150?'…':''}</div></div>` : ''}
    </div>
  `).join('') : `<div class="empty"><div class="empty-icon">📭</div><p>Aún no has enviado ninguna PQRS.</p></div>`;

  $('view-area').innerHTML = `
    <div class="page-head">
      <div class="page-head-left">
        <h2>PQRS</h2>
        <p>Peticiones, Quejas, Reclamos y Sugerencias</p>
      </div>
      <div class="page-head-right">
        <button class="btn btn-primary" onclick="openNuevoPQRS()">+ Nueva PQRS</button>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:.75rem;">${listHtml}</div>
  `;

  // Store current PQRS list for detail view
  S._pqrsList = list;
}

function verPQRS(id) {
  const pq = (S._pqrsList || []).find(p => p.id === id);
  if (!pq) return;
  openModal(pq.asunto, `
    <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.75rem;">
      <span class="badge badge-blue">${esc(pq.tipo)}</span>
      <span class="badge ${estadoPQRSClass(pq.estado)}">${estadoPQRSLabel(pq.estado)}</span>
    </div>
    <div class="text-sm text-muted" style="margin-bottom:.75rem;">Enviada el ${fmtDate(pq.fecha)}</div>
    <div class="text-sm" style="line-height:1.6;white-space:pre-wrap;">${esc(pq.descripcion)}</div>
    ${pq.respuesta ? `
      <div class="response-box mt-2">
        <div class="resp-label">Respuesta de la junta</div>
        <div class="resp-text" style="white-space:pre-wrap;">${esc(pq.respuesta)}</div>
        <div class="resp-meta">— ${esc(pq.respondido_por)} · ${fmtDate(pq.fecha_respuesta)}</div>
      </div>` : ''}
  `);
}

function openNuevoPQRS() {
  openModal('Nueva PQRS',
    `<p class="text-sm text-muted" style="margin-bottom:1rem;">Tu nombre y datos de contacto se enviarán automáticamente con la solicitud.</p>
    <div class="form-group">
      <label class="form-label">Tipo <span class="req">*</span></label>
      <select id="nq-tipo" class="form-control">
        <option value="">— Selecciona —</option>
        <option>Petición</option>
        <option>Queja</option>
        <option>Reclamo</option>
        <option>Sugerencia</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Asunto <span class="req">*</span></label>
      <input type="text" id="nq-asunto" class="form-control" placeholder="Resume tu solicitud en pocas palabras" maxlength="100" />
    </div>
    <div class="form-group">
      <label class="form-label">Descripción <span class="req">*</span></label>
      <textarea id="nq-desc" class="form-control" style="min-height:120px;" placeholder="Describe con detalle tu petición, queja, reclamo o sugerencia…"></textarea>
    </div>
    <div id="nq-err" class="form-error-msg"></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" id="nq-btn" onclick="submitPQRS()">Enviar</button>`
  );
}

async function submitPQRS() {
  const tipo  = $('nq-tipo').value;
  const asunto= $('nq-asunto').value.trim();
  const desc  = $('nq-desc').value.trim();
  const err   = $('nq-err');
  const btn   = $('nq-btn');

  if (!tipo || !asunto || !desc) { err.textContent='Completa todos los campos.'; err.classList.add('show'); return; }

  btn.disabled=true; btn.innerHTML='<span class="spin"></span>';

  const res = await api('submitPQRS', { tipo, asunto, descripcion:desc });

  if (res.success) {
    closeModal();
    toast('PQRS enviada correctamente.', 'success');
    viewPQRS();
  } else {
    err.textContent = res.message || 'Error al enviar.';
    err.classList.add('show');
    btn.disabled=false; btn.innerHTML='Enviar';
  }
}

/* ── NOTICIAS ──────────────────────────────────────────── */
async function viewNoticias() {
  setPageTitle('Noticias');
  const res = await api('getNoticias');
  const list = res.data || [];

  const html = list.length ? list.map(n => `
    <div class="news-card">
      <div class="news-date">📅 ${fmtDate(n.fecha)} · ${esc(n.autor)}</div>
      <div class="news-title">${esc(n.titulo)}</div>
      <div class="news-content" style="white-space:pre-wrap;">${esc(n.contenido)}</div>
    </div>
  `).join('') : `<div class="empty"><div class="empty-icon">📭</div><p>No hay comunicados publicados aún.</p></div>`;

  $('view-area').innerHTML = `
    <div class="page-head">
      <div class="page-head-left">
        <h2>Noticias y Comunicados</h2>
        <p>Información oficial de la junta directiva</p>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:.875rem;">${html}</div>
  `;
}

/* ═══════════════════════════════════════════════════════
   VISTAS — JUNTA DIRECTIVA (ADMIN)
═══════════════════════════════════════════════════════ */

/* ── ADMIN: AFILIADOS ──────────────────────────────────── */
async function viewAdminAfiliados() {
  setPageTitle('Afiliados');
  const res = await api('getAfiliados');
  const list = res.data || [];

  const total   = list.length;
  const activos = list.filter(u => u.activo).length;
  const junta   = list.filter(u => u.rol === 'junta').length;

  const rows = list.map(u => `
    <tr>
      <td><strong>#${esc(u.num_afiliado)}</strong></td>
      <td>
        <div style="display:flex;align-items:center;gap:.6rem;">
          <div class="user-avatar" style="width:30px;height:30px;font-size:.7rem;flex-shrink:0;">${initials(u.nombre,u.apellido)}</div>
          <div>
            <div class="fw-600" style="font-size:.85rem;">${esc(u.nombre)} ${esc(u.apellido)}</div>
            <div class="text-xs text-muted">${esc(u.email)}</div>
          </div>
        </div>
      </td>
      <td class="text-sm">${esc(u.cargo)}</td>
      <td class="text-sm">${esc(u.telefono||'—')}</td>
      <td><span class="badge ${u.rol==='junta'?'badge-or':'badge-muted'}">${u.rol==='junta'?'Junta':'Afiliado'}</span></td>
      <td><span class="badge ${u.activo?'badge-grn':'badge-red'}">${u.activo?'Activo':'Inactivo'}</span></td>
      <td>
        <div class="td-actions">
          <button class="btn btn-secondary btn-sm" onclick="editarAfiliado('${esc(u.id)}')">Editar</button>
          <button class="btn ${u.activo?'btn-danger':'btn-success'} btn-sm" onclick="toggleActivo('${esc(u.id)}',${u.activo})">${u.activo?'Desactivar':'Activar'}</button>
        </div>
      </td>
    </tr>
  `).join('');

  $('view-area').innerHTML = `
    <div class="page-head">
      <div class="page-head-left">
        <h2>Afiliados</h2>
        <p>Gestiona las cuentas de los miembros del sindicato</p>
      </div>
      <div class="page-head-right">
        <button class="btn btn-primary" onclick="openCrearAfiliado()">+ Agregar afiliado</button>
      </div>
    </div>

    <div class="stats-row" style="grid-template-columns:repeat(3,1fr);max-width:420px;margin-bottom:1.25rem;">
      <div class="stat-card"><div class="stat-num">${total}</div><div class="stat-lbl">Total</div></div>
      <div class="stat-card"><div class="stat-num">${activos}</div><div class="stat-lbl">Activos</div></div>
      <div class="stat-card"><div class="stat-num">${junta}</div><div class="stat-lbl">Junta</div></div>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>#</th><th>Nombre</th><th>Cargo</th><th>Teléfono</th><th>Rol</th><th>Estado</th><th>Acciones</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;

  S._afiliadosList = list;
}

function openCrearAfiliado() {
  openModal('Agregar Afiliado',
    `<div class="form-grid">
      <div class="form-group"><label class="form-label">Nombre <span class="req">*</span></label><input id="na-nombre" class="form-control" type="text" /></div>
      <div class="form-group"><label class="form-label">Apellido <span class="req">*</span></label><input id="na-apellido" class="form-control" type="text" /></div>
      <div class="form-group span-2"><label class="form-label">Correo electrónico <span class="req">*</span></label><input id="na-email" class="form-control" type="email" placeholder="correo@ejemplo.com" /></div>
      <div class="form-group"><label class="form-label">Teléfono</label><input id="na-tel" class="form-control" type="tel" /></div>
      <div class="form-group"><label class="form-label">Cargo</label><input id="na-cargo" class="form-control" type="text" /></div>
      <div class="form-group"><label class="form-label">N° Afiliado</label><input id="na-num" class="form-control" type="text" /></div>
      <div class="form-group"><label class="form-label">Fecha de ingreso</label><input id="na-fecha" class="form-control" type="date" /></div>
      <div class="form-group"><label class="form-label">Rol</label>
        <select id="na-rol" class="form-control"><option value="afiliado">Afiliado</option><option value="junta">Junta Directiva</option></select>
      </div>
      <div class="form-group span-2"><label class="form-label">Contraseña inicial <span class="req">*</span></label>
        <input id="na-pwd" class="form-control" type="text" value="Lci2025!" />
        <span class="form-hint">El afiliado deberá cambiarla al ingresar.</span>
      </div>
    </div>
    <div id="na-err" class="form-error-msg"></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" id="na-btn" onclick="crearAfiliado()">Crear cuenta</button>`
  );
}

async function crearAfiliado() {
  const nombre  = $('na-nombre').value.trim();
  const apellido= $('na-apellido').value.trim();
  const email   = $('na-email').value.trim();
  const pwd     = $('na-pwd').value.trim();
  const err = $('na-err');
  const btn = $('na-btn');

  if (!nombre||!apellido||!email||!pwd) { err.textContent='Completa los campos obligatorios.'; err.classList.add('show'); return; }

  btn.disabled=true; btn.innerHTML='<span class="spin"></span>';

  const res = await api('createAfiliado', {
    nombre, apellido, email, password:pwd,
    telefono: $('na-tel').value.trim(),
    cargo:    $('na-cargo').value.trim(),
    num_afiliado: $('na-num').value.trim(),
    fecha_ingreso: $('na-fecha').value,
    rol: $('na-rol').value,
  });

  if (res.success) {
    closeModal();
    toast('Afiliado creado correctamente.', 'success');
    viewAdminAfiliados();
  } else {
    err.textContent = res.message || 'Error al crear.';
    err.classList.add('show');
    btn.disabled=false; btn.innerHTML='Crear cuenta';
  }
}

function editarAfiliado(id) {
  const u = (S._afiliadosList||[]).find(u=>u.id===id);
  if (!u) return;
  openModal('Editar Afiliado — ' + u.nombre + ' ' + u.apellido,
    `<div class="form-grid">
      <div class="form-group"><label class="form-label">Nombre</label><input id="ea-nombre" class="form-control" value="${esc(u.nombre)}" /></div>
      <div class="form-group"><label class="form-label">Apellido</label><input id="ea-apellido" class="form-control" value="${esc(u.apellido)}" /></div>
      <div class="form-group"><label class="form-label">Teléfono</label><input id="ea-tel" class="form-control" value="${esc(u.telefono||'')}" /></div>
      <div class="form-group"><label class="form-label">Cargo</label><input id="ea-cargo" class="form-control" value="${esc(u.cargo||'')}" /></div>
      <div class="form-group span-2"><label class="form-label">Rol</label>
        <select id="ea-rol" class="form-control">
          <option value="afiliado" ${u.rol==='afiliado'?'selected':''}>Afiliado</option>
          <option value="junta"    ${u.rol==='junta'?'selected':''}>Junta Directiva</option>
        </select>
      </div>
    </div>
    <div class="mt-2" style="padding-top:1rem;border-top:1px solid var(--border);">
      <div class="fw-600 text-sm" style="margin-bottom:.5rem;">Restablecer contraseña</div>
      <div class="form-group">
        <input id="ea-pwd" class="form-control" type="text" placeholder="Nueva contraseña (dejar vacío para no cambiar)" />
      </div>
    </div>
    <div id="ea-err" class="form-error-msg"></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" id="ea-btn" onclick="guardarAfiliado('${esc(id)}')">Guardar</button>`
  );
}

async function guardarAfiliado(id) {
  const err = $('ea-err');
  const btn = $('ea-btn');
  btn.disabled=true; btn.innerHTML='<span class="spin"></span>';

  const res = await api('updateAfiliado', {
    id,
    nombre:   $('ea-nombre').value.trim(),
    apellido: $('ea-apellido').value.trim(),
    telefono: $('ea-tel').value.trim(),
    cargo:    $('ea-cargo').value.trim(),
    rol:      $('ea-rol').value,
  });

  const newPwd = $('ea-pwd').value.trim();
  if (res.success && newPwd) {
    await api('resetPassword', { id, newPwd });
  }

  if (res.success) {
    closeModal();
    toast('Afiliado actualizado.', 'success');
    viewAdminAfiliados();
  } else {
    err.textContent = res.message || 'Error.';
    err.classList.add('show');
    btn.disabled=false; btn.innerHTML='Guardar';
  }
}

async function toggleActivo(id, activo) {
  const res = await api('updateAfiliado', { id, activo: !activo });
  if (res.success) {
    toast(activo ? 'Cuenta desactivada.' : 'Cuenta activada.', 'success');
    viewAdminAfiliados();
  } else {
    toast(res.message || 'Error.', 'error');
  }
}

/* ── ADMIN: CLASIFICADOS ───────────────────────────────── */
let _adminClTab = 'pendiente';

async function viewAdminClasificados() {
  setPageTitle('Gestionar Clasificados');
  const res = await api('getAllClasificados');
  const all = res.data || [];

  const pendientes = all.filter(c => c.estado === 'pendiente');
  const aprobados  = all.filter(c => c.estado === 'aprobado');

  S._adminCL = all;

  $('view-area').innerHTML = `
    <div class="page-head">
      <div class="page-head-left">
        <h2>Gestionar Clasificados</h2>
        <p>Revisa, aprueba o rechaza los anuncios de los afiliados</p>
      </div>
      <div class="page-head-right">
        <button class="btn btn-secondary" onclick="imprimirAprobados()">🖨️ Imprimir aprobados</button>
      </div>
    </div>
    <div class="tab-bar">
      <button class="tab-btn ${_adminClTab==='pendiente'?'active':''}" onclick="switchAdminClTab('pendiente',this)">
        ⏳ Pendientes <span class="tab-badge">${pendientes.length}</span>
      </button>
      <button class="tab-btn ${_adminClTab==='aprobado'?'active':''}" onclick="switchAdminClTab('aprobado',this)">✅ Aprobados</button>
      <button class="tab-btn ${_adminClTab==='todos'?'active':''}" onclick="switchAdminClTab('todos',this)">Todos</button>
    </div>
    <div id="admin-cl-content"></div>
  `;

  renderAdminCLList();
}

function switchAdminClTab(tab, el) {
  _adminClTab = tab;
  document.querySelectorAll('.tab-bar .tab-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderAdminCLList();
}

function renderAdminCLList() {
  const all  = S._adminCL || [];
  const list = _adminClTab === 'todos' ? all : all.filter(c => c.estado === _adminClTab);
  const cont = $('admin-cl-content');

  if (!list.length) {
    cont.innerHTML = `<div class="empty"><div class="empty-icon">📭</div><p>No hay clasificados en esta categoría.</p></div>`;
    return;
  }

  cont.innerHTML = `<div style="display:flex;flex-direction:column;gap:.75rem;">${list.map(c => {
    const catIcon = { 'Venta de artículos':'🛍️', 'Servicios':'🔧', 'Se busca / Necesito':'🔍', 'Arriendos / Vivienda':'🏠' }[c.categoria] || '📢';
    return `
    <div class="cl-card">
      <div class="cl-img">${catIcon}</div>
      <div class="cl-body">
        <div style="display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;">
          <span class="badge badge-muted">${esc(c.categoria)}</span>
          <span class="badge ${estadoBadgeClass(c.estado)}">${estadoLabel(c.estado)}</span>
        </div>
        <div class="cl-title">${esc(c.titulo)}</div>
        <div class="cl-desc">${esc(c.descripcion)}</div>
        ${c.precio ? `<div class="cl-price">${esc(c.precio)}</div>` : ''}
        <div class="cl-meta">
          <span>👤 ${esc(c.nombre_afiliado)}</span>
          <span>📅 ${fmtDate(c.fecha)}</span>
        </div>
        <div class="cl-actions">
          ${c.estado !== 'aprobado'  ? `<button class="btn btn-success btn-sm" onclick="cambiarEstadoCL('${c.id}','aprobado')">✅ Aprobar</button>` : ''}
          ${c.estado !== 'rechazado' ? `<button class="btn btn-danger btn-sm"  onclick="cambiarEstadoCL('${c.id}','rechazado')">✕ Rechazar</button>` : ''}
          ${c.estado !== 'pendiente' ? `<button class="btn btn-secondary btn-sm" onclick="cambiarEstadoCL('${c.id}','pendiente')">↩ Pendiente</button>` : ''}
        </div>
      </div>
    </div>`;
  }).join('')}</div>`;
}

async function cambiarEstadoCL(id, estado) {
  const res = await api('updateClasificadoEstado', { id, estado });
  if (res.success) {
    const cl = S._adminCL.find(c=>c.id===id);
    if (cl) cl.estado = estado;
    renderAdminCLList();
    toast(`Clasificado ${estadoLabel(estado).toLowerCase()}.`, 'success');
  } else {
    toast(res.message||'Error.', 'error');
  }
}

function imprimirAprobados() {
  const aprobados = (S._adminCL||[]).filter(c=>c.estado==='aprobado');
  if (!aprobados.length) { toast('No hay clasificados aprobados para imprimir.', 'info'); return; }
  generarPrint(aprobados);
}

/* ── ADMIN: PQRS ───────────────────────────────────────── */
let _adminPQTab = 'abierto';

async function viewAdminPQRS() {
  setPageTitle('Gestionar PQRS');
  const res = await api('getAllPQRS');
  const all = res.data || [];
  S._adminPQ = all;

  const counts = { abierto:0, en_tramite:0, resuelto:0 };
  all.forEach(p => { if (counts[p.estado]!==undefined) counts[p.estado]++; });

  $('view-area').innerHTML = `
    <div class="page-head">
      <div class="page-head-left"><h2>Gestionar PQRS</h2><p>Revisa y responde las solicitudes de los afiliados</p></div>
    </div>
    <div class="tab-bar">
      <button class="tab-btn ${_adminPQTab==='abierto'?'active':''}" onclick="switchAdminPQTab('abierto',this)">Abiertos <span class="tab-badge">${counts.abierto}</span></button>
      <button class="tab-btn ${_adminPQTab==='en_tramite'?'active':''}" onclick="switchAdminPQTab('en_tramite',this)">En trámite <span class="tab-badge">${counts.en_tramite}</span></button>
      <button class="tab-btn ${_adminPQTab==='resuelto'?'active':''}" onclick="switchAdminPQTab('resuelto',this)">Resueltos</button>
      <button class="tab-btn ${_adminPQTab==='todos'?'active':''}" onclick="switchAdminPQTab('todos',this)">Todos</button>
    </div>
    <div id="admin-pq-content"></div>
  `;

  renderAdminPQList();
}

function switchAdminPQTab(tab, el) {
  _adminPQTab = tab;
  document.querySelectorAll('.tab-bar .tab-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderAdminPQList();
}

function renderAdminPQList() {
  const all  = S._adminPQ || [];
  const list = _adminPQTab === 'todos' ? all : all.filter(p=>p.estado===_adminPQTab);
  const cont = $('admin-pq-content');

  if (!list.length) {
    cont.innerHTML = `<div class="empty"><div class="empty-icon">📭</div><p>No hay solicitudes en esta categoría.</p></div>`;
    return;
  }

  cont.innerHTML = `<div style="display:flex;flex-direction:column;gap:.75rem;">${list.map(pq => `
    <div class="pq-card">
      <div class="pq-card-top">
        <div style="display:flex;gap:.4rem;flex-wrap:wrap;">
          <span class="badge badge-blue">${esc(pq.tipo)}</span>
          <span class="badge ${estadoPQRSClass(pq.estado)}">${estadoPQRSLabel(pq.estado)}</span>
        </div>
        <span class="text-xs text-muted">${fmtDate(pq.fecha)}</span>
      </div>
      <div class="pq-asunto">${esc(pq.asunto)}</div>
      <div class="pq-desc">${esc(pq.descripcion)}</div>
      <div class="pq-footer">
        <span>👤 ${esc(pq.nombre_afiliado)}</span>
        <span>📧 ${esc(pq.email_afiliado)}</span>
        ${pq.telefono ? `<span>📞 ${esc(pq.telefono)}</span>` : ''}
      </div>
      ${pq.respuesta ? `<div class="response-box mt-2"><div class="resp-label">Respuesta enviada</div><div class="resp-text">${esc(pq.respuesta)}</div><div class="resp-meta">— ${esc(pq.respondido_por)} · ${fmtDate(pq.fecha_respuesta)}</div></div>` : ''}
      <div class="cl-actions mt-1">
        <button class="btn btn-primary btn-sm" onclick="openResponderPQRS('${esc(pq.id)}')">✏️ ${pq.respuesta ? 'Editar respuesta' : 'Responder'}</button>
        ${pq.estado !== 'resuelto' ? `<button class="btn btn-success btn-sm" onclick="marcarResuelto('${esc(pq.id)}')">✅ Marcar resuelto</button>` : ''}
      </div>
    </div>
  `).join('')}</div>`;
}

function openResponderPQRS(id) {
  const pq = (S._adminPQ||[]).find(p=>p.id===id);
  if (!pq) return;
  openModal('Responder PQRS — ' + pq.asunto,
    `<div class="text-sm text-muted" style="margin-bottom:1rem;">Afiliado: <strong>${esc(pq.nombre_afiliado)}</strong> · ${esc(pq.telefono||pq.email_afiliado)}</div>
    <div class="form-group">
      <label class="form-label">Respuesta</label>
      <textarea id="resp-texto" class="form-control" style="min-height:140px;" placeholder="Escribe la respuesta para el afiliado…">${esc(pq.respuesta||'')}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Nuevo estado</label>
      <select id="resp-estado" class="form-control">
        <option value="abierto"    ${pq.estado==='abierto'?'selected':''}>Abierto</option>
        <option value="en_tramite" ${pq.estado==='en_tramite'?'selected':''}>En trámite</option>
        <option value="resuelto"   ${pq.estado==='resuelto'?'selected':''}>Resuelto</option>
      </select>
    </div>
    <div id="resp-err" class="form-error-msg"></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" id="resp-btn" onclick="enviarRespuestaPQRS('${esc(id)}')">Guardar respuesta</button>`
  );
}

async function enviarRespuestaPQRS(id) {
  const respuesta= $('resp-texto').value.trim();
  const estado   = $('resp-estado').value;
  const err = $('resp-err');
  const btn = $('resp-btn');

  if (!respuesta) { err.textContent='Escribe la respuesta.'; err.classList.add('show'); return; }

  btn.disabled=true; btn.innerHTML='<span class="spin"></span>';

  const res = await api('responderPQRS', { id, respuesta, estado });

  if (res.success) {
    closeModal();
    toast('Respuesta guardada.', 'success');
    viewAdminPQRS();
  } else {
    err.textContent = res.message||'Error.';
    err.classList.add('show');
    btn.disabled=false; btn.innerHTML='Guardar respuesta';
  }
}

async function marcarResuelto(id) {
  const res = await api('responderPQRS', { id, respuesta: (S._adminPQ||[]).find(p=>p.id===id)?.respuesta||'Solicitud marcada como resuelta.', estado:'resuelto' });
  if (res.success) {
    toast('Marcado como resuelto.', 'success');
    viewAdminPQRS();
  } else {
    toast(res.message||'Error.', 'error');
  }
}

/* ── ADMIN: COMUNICADOS ────────────────────────────────── */
async function viewAdminNoticias() {
  setPageTitle('Comunicados');
  const res = await api('getNoticias');
  const list = res.data || [];
  S._adminNoticias = list;

  const html = list.length ? list.map(n => `
    <div class="news-card">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem;">
        <div class="news-date">📅 ${fmtDate(n.fecha)}</div>
        <span class="badge ${n.visible?'badge-grn':'badge-muted'}">${n.visible?'Publicado':'Borrador'}</span>
      </div>
      <div class="news-title">${esc(n.titulo)}</div>
      <div class="news-content">${esc(n.contenido).replace(/\n/g,'<br>').substring(0,200)}${n.contenido.length>200?'…':''}</div>
      <div style="display:flex;gap:.4rem;margin-top:.75rem;flex-wrap:wrap;">
        <button class="btn btn-secondary btn-sm" onclick="editarNoticia('${esc(n.id)}')">✏️ Editar</button>
        <button class="btn btn-danger btn-sm" onclick="borrarNoticia('${esc(n.id)}')">🗑️ Borrar</button>
      </div>
    </div>
  `).join('') : `<div class="empty"><div class="empty-icon">✏️</div><p>No hay comunicados publicados aún.</p></div>`;

  $('view-area').innerHTML = `
    <div class="page-head">
      <div class="page-head-left"><h2>Comunicados</h2><p>Publica noticias y avisos para todos los afiliados</p></div>
      <div class="page-head-right"><button class="btn btn-primary" onclick="openNuevaNoticia()">+ Nuevo comunicado</button></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:.875rem;">${html}</div>
  `;
}

function openNuevaNoticia(id) {
  const n = id ? (S._adminNoticias||[]).find(x=>x.id===id) : null;
  openModal(n ? 'Editar Comunicado' : 'Nuevo Comunicado',
    `<div class="form-group">
      <label class="form-label">Título <span class="req">*</span></label>
      <input id="nn-titulo" class="form-control" type="text" value="${esc(n?.titulo||'')}" placeholder="Título del comunicado" />
    </div>
    <div class="form-group">
      <label class="form-label">Contenido <span class="req">*</span></label>
      <textarea id="nn-contenido" class="form-control" style="min-height:160px;">${esc(n?.contenido||'')}</textarea>
    </div>
    <div id="nn-err" class="form-error-msg"></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" id="nn-btn" onclick="publicarNoticia(${JSON.stringify(id||null)})">${n?'Guardar cambios':'Publicar'}</button>`
  );
}

function editarNoticia(id) { openNuevaNoticia(id); }

async function publicarNoticia(id) {
  const titulo    = $('nn-titulo').value.trim();
  const contenido = $('nn-contenido').value.trim();
  const err = $('nn-err');
  const btn = $('nn-btn');

  if (!titulo||!contenido) { err.textContent='Completa todos los campos.'; err.classList.add('show'); return; }

  btn.disabled=true; btn.innerHTML='<span class="spin"></span>';

  let res;
  if (id) {
    // For demo, we update in place
    const n = (S._adminNoticias||[]).find(x=>x.id===id);
    if (n) { n.titulo=titulo; n.contenido=contenido; res={success:true}; await delay(300); }
    else res={success:false, message:'No encontrado.'};
  } else {
    res = await api('createNoticia', { titulo, contenido });
  }

  if (res.success) {
    closeModal();
    toast(id ? 'Comunicado actualizado.' : 'Comunicado publicado.', 'success');
    viewAdminNoticias();
  } else {
    err.textContent = res.message||'Error.';
    err.classList.add('show');
    btn.disabled=false; btn.innerHTML = id?'Guardar cambios':'Publicar';
  }
}

async function borrarNoticia(id) {
  if (!confirm('¿Confirmas que quieres borrar este comunicado?')) return;
  const res = await api('deleteNoticia', { id });
  if (res.success) {
    toast('Comunicado eliminado.', 'success');
    viewAdminNoticias();
  } else {
    toast(res.message||'Error.', 'error');
  }
}

/* ── IMPRIMIR CLASIFICADOS ─────────────────────────────── */
function generarPrint(list) {
  const withImg    = list.filter(c => c.url_imagen);
  const withoutImg = list.filter(c => !c.url_imagen);
  let html = '';

  // Con imagen: 2 por hoja (media carta c/u)
  for (let i=0; i<withImg.length; i+=2) {
    html += `<div class="print-sheet">`;
    html += halfCard(withImg[i]);
    if (withImg[i+1]) { html += `<div class="cut-line">✂ CORTAR ✂</div>`; html += halfCard(withImg[i+1]); }
    html += `</div>`;
  }

  // Sin imagen: 4 por hoja (cuarto de carta c/u)
  for (let i=0; i<withoutImg.length; i+=4) {
    html += `<div class="print-sheet"><div class="print-quarter-grid">`;
    for (let j=0; j<4; j++) {
      html += withoutImg[i+j] ? quarterCard(withoutImg[i+j]) : `<div class="print-quarter"></div>`;
    }
    html += `</div></div>`;
  }

  $('print-area').innerHTML = html;
  window.print();
}

function halfCard(c) {
  return `<div class="print-half">
    ${c.url_imagen ? `<div class="pc-img"><img src="${esc(c.url_imagen)}" /></div>` : ''}
    <div class="pc-body">
      <div class="pc-brand"><div class="pc-orange-circle"><span>S</span></div><span class="pc-brand-text">SINTRALCI</span></div>
      <div class="pc-category">${esc(c.categoria)}</div>
      <div class="pc-title">${esc(c.titulo)}</div>
      ${c.precio ? `<div class="pc-price">${esc(c.precio)}</div>` : ''}
      <div class="pc-desc">${esc(c.descripcion)}</div>
      <div class="pc-contact">
        <div class="pc-contact-label">Contacto</div>
        <div class="pc-contact-name">${esc(c.nombre_afiliado)}</div>
        <div class="pc-date">Publicado: ${fmtDate(c.fecha)}</div>
      </div>
    </div>
  </div>`;
}

function quarterCard(c) {
  return `<div class="print-quarter">
    <div class="pc-brand"><div class="pc-orange-circle"><span>S</span></div><span class="pc-brand-text">SINTRALCI</span></div>
    <div class="pc-category">${esc(c.categoria)}</div>
    <div class="pc-title pc-title-sm">${esc(c.titulo)}</div>
    ${c.precio ? `<div class="pc-price" style="font-size:11pt;">${esc(c.precio)}</div>` : ''}
    <div class="pc-desc">${esc(c.descripcion)}</div>
    <div class="pc-contact">
      <div class="pc-contact-label">Contacto</div>
      <div class="pc-contact-name">${esc(c.nombre_afiliado)}</div>
      <div class="pc-date">${fmtDate(c.fecha)}</div>
    </div>
  </div>`;
}

/* ── HELPERS DE ESTADO ─────────────────────────────────── */
function estadoBadgeClass(e) {
  return { aprobado:'badge-grn', pendiente:'badge-amb', rechazado:'badge-red' }[e] || 'badge-muted';
}
function estadoLabel(e) {
  return { aprobado:'Aprobado', pendiente:'Pendiente', rechazado:'Rechazado' }[e] || e;
}
function estadoPQRSClass(e) {
  return { abierto:'badge-amb', en_tramite:'badge-blue', resuelto:'badge-grn' }[e] || 'badge-muted';
}
function estadoPQRSLabel(e) {
  return { abierto:'Abierto', en_tramite:'En trámite', resuelto:'Resuelto' }[e] || e;
}

/* ── INICIALIZACIÓN ────────────────────────────────────── */
async function init() {
  // Inicializar copia demo mutable
  S._demo = JSON.parse(JSON.stringify(DEMO));

  // Intentar restaurar sesión
  const token = localStorage.getItem(CFG.TOKEN_KEY);
  if (token) {
    S.token = token;
    const cached = localStorage.getItem(CFG.USER_KEY);
    if (cached) {
      try { S.user = JSON.parse(cached); } catch(e) {}
    }

    const res = await api('validateToken', { token });
    if (res.success) {
      S.user = res.user;
      localStorage.setItem(CFG.USER_KEY, JSON.stringify(S.user));
      showApp();
      go('home');
      return;
    }
    localStorage.removeItem(CFG.TOKEN_KEY);
    localStorage.removeItem(CFG.USER_KEY);
  }

  // Mostrar login
  $('login-screen').classList.remove('hidden');
}

init();
