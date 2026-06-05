/**
 * ══════════════════════════════════════════════════════════════════
 *  PORTAL SINTRALCI — Google Apps Script Backend  v2.0
 *  Sindicato de Trabajadores LCI Bogotá
 *  Correo: sindicatodetrabajadoreslci@gmail.com
 * ══════════════════════════════════════════════════════════════════
 *
 *  PRIMER USO — sigue estos pasos en orden:
 *
 *  1. Ejecuta  setup()  desde el editor (▶ Run → setup).
 *     Esto crea la hoja de cálculo, la carpeta en Drive y el primer
 *     usuario de junta directiva. Anota los IDs que aparecen en el log.
 *
 *  2. Pega los IDs en las variables SPREADSHEET_ID y FOLDER_ID de abajo.
 *     Guarda el archivo (Ctrl+S).
 *
 *  3. Despliega como Web App:
 *     Implementar → Nueva implementación → tipo "Aplicación web"
 *       · Ejecutar como: Yo (sindicatodetrabajadoreslci@gmail.com)
 *       · Quién tiene acceso: Cualquier persona
 *     Copia la URL que aparece.
 *
 *  4. Pega esa URL en CFG.SCRIPT_URL dentro de  app.js.
 *
 *  5. Sube app.js e index.html a GitHub Pages (ver INSTRUCCIONES.md).
 */

// ─── IDs (completa después de correr setup) ──────────────────────
let SPREADSHEET_ID = '';   // Ej: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms'
let FOLDER_ID      = '';   // Ej: '1A2B3C4D5E6F7G8H9I0J'

// ─── PRIMER USUARIO JUNTA (para el setup inicial) ────────────────
// Este es el usuario administrador inicial. Después del primer ingreso,
// la junta puede crear todas las cuentas desde Panel → Afiliados.
// Cada miembro de junta se crea como afiliado con rol "junta".
const ADMIN_INICIAL = {
  nombre:       'Admin',
  apellido:     'SINTRALCI',
  email:        'sindicatodetrabajadoreslci@gmail.com',
  password:     'junta-sintralci-2025',   // ← cámbialo después del primer ingreso
  cargo:        'Administrador',
  num_afiliado: '000',
};

// ─── DURACIÓN DEL TOKEN (horas) ──────────────────────────────────
const TOKEN_HORAS = 72;   // 3 días


// ════════════════════════════════════════════════════════════════
//  SETUP — ejecuta UNA SOLA VEZ
// ════════════════════════════════════════════════════════════════
function setup() {
  // 1. Crear hoja de cálculo
  const ss = SpreadsheetApp.create('Portal SINTRALCI');

  // 2. Hoja: Usuarios
  const shUsers = ss.getActiveSheet();
  shUsers.setName('Usuarios');
  const hUsers = ['ID','Email','Nombre','Apellido','Telefono','Cargo',
                  'Num_Afiliado','Fecha_Ingreso','Rol','Activo',
                  'Password_Hash','Token','Token_Expiry'];
  _setHeader(shUsers, hUsers, '#e94e1b');
  [50,200,120,120,140,160,110,110,80,60,200,200,160]
    .forEach((w,i) => shUsers.setColumnWidth(i+1, w));

  // 3. Hoja: Clasificados
  const shCl = ss.insertSheet('Clasificados');
  const hCl = ['ID','Fecha','Email_Afiliado','Nombre_Afiliado','Categoria',
               'Titulo','Descripcion','Precio','URL_Imagen','Estado'];
  _setHeader(shCl, hCl, '#e94e1b');
  [50,160,200,180,160,220,300,100,220,90]
    .forEach((w,i) => shCl.setColumnWidth(i+1, w));

  // 4. Hoja: PQRS
  const shPQ = ss.insertSheet('PQRS');
  const hPQ = ['ID','Fecha','Email_Afiliado','Nombre_Afiliado','Telefono',
               'Tipo','Asunto','Descripcion','Estado','Respuesta',
               'Fecha_Respuesta','Respondido_Por'];
  _setHeader(shPQ, hPQ, '#e94e1b');
  [50,160,200,180,140,100,240,300,90,300,130,160]
    .forEach((w,i) => shPQ.setColumnWidth(i+1, w));

  // 5. Hoja: Noticias
  const shNt = ss.insertSheet('Noticias');
  const hNt = ['ID','Fecha','Titulo','Contenido','Autor','Visible'];
  _setHeader(shNt, hNt, '#e94e1b');
  [50,160,300,500,160,60]
    .forEach((w,i) => shNt.setColumnWidth(i+1, w));

  // 6. Crear carpeta en Drive
  const folder = DriveApp.createFolder('📌 Portal SINTRALCI — Imágenes');
  folder.setDescription('Imágenes de clasificados · SINTRALCI LCI Bogotá');

  // 7. Guardar IDs
  const sheetId  = ss.getId();
  const folderId = folder.getId();

  // 8. Crear primer usuario admin
  SPREADSHEET_ID = sheetId;
  FOLDER_ID      = folderId;
  _crearUsuario(shUsers, {
    nombre:       ADMIN_INICIAL.nombre,
    apellido:     ADMIN_INICIAL.apellido,
    email:        ADMIN_INICIAL.email,
    password:     ADMIN_INICIAL.password,
    cargo:        ADMIN_INICIAL.cargo,
    num_afiliado: ADMIN_INICIAL.num_afiliado,
    rol:          'junta',
    activo:       true,
  });

  // 9. Log
  console.log('═══════════════════════════════════════════════');
  console.log('✅ SETUP COMPLETADO EXITOSAMENTE');
  console.log('═══════════════════════════════════════════════');
  console.log('SPREADSHEET_ID = "' + sheetId + '"');
  console.log('FOLDER_ID      = "' + folderId + '"');
  console.log('───────────────────────────────────────────────');
  console.log('Primer usuario creado:');
  console.log('  Email:    ' + ADMIN_INICIAL.email);
  console.log('  Password: ' + ADMIN_INICIAL.password);
  console.log('═══════════════════════════════════════════════');
}


// ════════════════════════════════════════════════════════════════
//  ENTRY POINTS WEB APP
// ════════════════════════════════════════════════════════════════

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', app: 'Portal SINTRALCI', version: '2.0' })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data   = JSON.parse(e.postData.contents);
    const action = data.action;

    const handlers = {
      // Auth
      login:                  () => handleLogin(data),
      validateToken:          () => handleValidateToken(data),
      // Perfil
      updateProfile:          () => handleUpdateProfile(data),
      changePassword:         () => handleChangePassword(data),
      // Clasificados
      submitClasificado:      () => handleSubmitClasificado(data),
      getMisClasificados:     () => handleGetMisClasificados(data),
      getClasificados:        () => handleGetClasificados(data),
      updateClasificadoEstado:() => handleUpdateClasificadoEstado(data),
      // PQRS
      submitPQRS:             () => handleSubmitPQRS(data),
      getMisPQRS:             () => handleGetMisPQRS(data),
      getAllPQRS:              () => handleGetAllPQRS(data),
      responderPQRS:          () => handleResponderPQRS(data),
      // Noticias
      getNoticias:            () => handleGetNoticias(data),
      createNoticia:          () => handleCreateNoticia(data),
      updateNoticia:          () => handleUpdateNoticia(data),
      deleteNoticia:          () => handleDeleteNoticia(data),
      // Afiliados (admin)
      getAfiliados:           () => handleGetAfiliados(data),
      createAfiliado:         () => handleCreateAfiliado(data),
      updateAfiliado:         () => handleUpdateAfiliado(data),
      resetPassword:          () => handleResetPassword(data),
    };

    if (handlers[action]) return handlers[action]();
    return ok({ success: false, message: 'Acción no reconocida: ' + action });

  } catch (err) {
    return ok({ success: false, message: 'Error interno: ' + err.message });
  }
}


// ════════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════════

function handleLogin(data) {
  const email = (data.email || '').trim().toLowerCase();
  const pwd   = (data.password || '').trim();

  if (!email || !pwd) return ok({ success: false, message: 'Email y contraseña son requeridos' });

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Usuarios');
  const rows  = sheet.getDataRange().getValues();

  // Buscar usuario por email (columna 2, índice 1)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if ((row[1] || '').toString().trim().toLowerCase() !== email) continue;

    const activo = row[9];
    if (!activo) return ok({ success: false, message: 'Tu cuenta está inactiva. Contacta a la junta directiva.' });

    const hash = _hash(pwd);
    if (hash !== row[10]) return ok({ success: false, message: 'Contraseña incorrecta' });

    // Generar token
    const token  = Utilities.getUuid();
    const expiry = new Date(Date.now() + TOKEN_HORAS * 3600 * 1000).toISOString();
    sheet.getRange(i + 1, 12).setValue(token);   // columna 12 = Token
    sheet.getRange(i + 1, 13).setValue(expiry);  // columna 13 = Token_Expiry

    const user = _rowToUser(row);
    return ok({ success: true, token, user });
  }

  return ok({ success: false, message: 'No encontramos una cuenta con ese email' });
}

function handleValidateToken(data) {
  const result = _getUserByToken(data.token);
  if (!result.valid) return ok({ success: false, message: result.message });
  return ok({ success: true, user: result.user });
}


// ════════════════════════════════════════════════════════════════
//  PERFIL
// ════════════════════════════════════════════════════════════════

function handleUpdateProfile(data) {
  const auth = _getUserByToken(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Usuarios');
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] !== auth.user.id) continue;
    // Solo se puede cambiar teléfono
    if (data.telefono !== undefined)
      sheet.getRange(i + 1, 5).setValue(data.telefono);
    const updated = sheet.getRange(i + 1, 1, 1, rows[i].length).getValues()[0];
    return ok({ success: true, user: _rowToUser(updated) });
  }
  return ok({ success: false, message: 'Usuario no encontrado' });
}

function handleChangePassword(data) {
  const auth = _getUserByToken(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Usuarios');
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] !== auth.user.id) continue;

    // Verificar contraseña actual
    if (_hash(data.currentPassword) !== rows[i][10])
      return ok({ success: false, message: 'La contraseña actual no es correcta' });

    sheet.getRange(i + 1, 11).setValue(_hash(data.newPassword));
    return ok({ success: true, message: 'Contraseña actualizada correctamente' });
  }
  return ok({ success: false, message: 'Usuario no encontrado' });
}


// ════════════════════════════════════════════════════════════════
//  CLASIFICADOS
// ════════════════════════════════════════════════════════════════

function handleSubmitClasificado(data) {
  const auth = _getUserByToken(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  // Para flyers propios solo se requiere categoría e imagen
  const esFlyer = data.tipo_aviso === 'flyer';
  if (!data.categoria) return ok({ success: false, message: 'Selecciona una categoría.' });
  if (!esFlyer && (!data.titulo || !data.descripcion))
    return ok({ success: false, message: 'Faltan campos obligatorios.' });

  // Subir imagen si viene
  let imageUrl = '';
  if (data.imageBase64 && data.imageMimeType) {
    imageUrl = _subirImagen(data.imageBase64, data.imageMimeType);
  }

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Clasificados');
  const id    = Utilities.getUuid();

  sheet.appendRow([
    id,
    new Date().toISOString(),
    auth.user.email,
    auth.user.nombre + ' ' + auth.user.apellido,
    (data.categoria    || '').trim(),
    (data.titulo       || '').trim(),
    (data.descripcion  || '').trim(),
    (data.precio       || '').trim(),
    imageUrl,
    'pendiente',
    data.tipo_aviso || 'sintralci',
  ]);

  return ok({ success: true, message: '¡Tu clasificado fue enviado! La junta lo revisará pronto.' });
}

function handleGetMisClasificados(data) {
  const auth = _getUserByToken(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  const rows  = _getSheetRows('Clasificados');
  const mine  = rows.filter(r => (r[2] || '').toLowerCase() === auth.user.email.toLowerCase());
  return ok({ success: true, clasificados: mine.map(_rowToClasificado).reverse() });
}

function handleGetClasificados(data) {
  // Público: solo devuelve aprobados. Si es admin, devuelve todos.
  const rows = _getSheetRows('Clasificados');
  let list   = rows.map(_rowToClasificado);

  // Si viene token válido y es junta → todos; si no → solo aprobados
  if (data.token) {
    const auth = _getUserByToken(data.token);
    if (auth.valid && auth.user.rol === 'junta') {
      return ok({ success: true, clasificados: list.reverse() });
    }
  }
  list = list.filter(c => c.estado === 'aprobado');
  return ok({ success: true, clasificados: list.reverse() });
}

function handleUpdateClasificadoEstado(data) {
  const auth = _requireJunta(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  const valid = ['pendiente','aprobado','rechazado'];
  if (!valid.includes(data.estado))
    return ok({ success: false, message: 'Estado inválido' });

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Clasificados');
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] !== data.id) continue;
    sheet.getRange(i + 1, 10).setValue(data.estado);
    return ok({ success: true });
  }
  return ok({ success: false, message: 'Clasificado no encontrado' });
}


// ════════════════════════════════════════════════════════════════
//  PQRS
// ════════════════════════════════════════════════════════════════

function handleSubmitPQRS(data) {
  const auth = _getUserByToken(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  if (!data.tipo || !data.asunto || !data.descripcion)
    return ok({ success: false, message: 'Faltan campos obligatorios' });

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('PQRS');
  const id    = Utilities.getUuid();

  sheet.appendRow([
    id,
    new Date().toISOString(),
    auth.user.email,
    auth.user.nombre + ' ' + auth.user.apellido,
    auth.user.telefono || '',
    (data.tipo        || '').trim(),
    (data.asunto      || '').trim(),
    (data.descripcion || '').trim(),
    'abierto',
    '',   // respuesta
    '',   // fecha_respuesta
    '',   // respondido_por
  ]);

  return ok({ success: true, message: 'Tu PQRS fue registrada. Te responderemos pronto.' });
}

function handleGetMisPQRS(data) {
  const auth = _getUserByToken(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  const rows = _getSheetRows('PQRS');
  const mine = rows.filter(r => (r[2] || '').toLowerCase() === auth.user.email.toLowerCase());
  return ok({ success: true, pqrs: mine.map(_rowToPQRS).reverse() });
}

function handleGetAllPQRS(data) {
  const auth = _requireJunta(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  const rows = _getSheetRows('PQRS');
  return ok({ success: true, pqrs: rows.map(_rowToPQRS).reverse() });
}

function handleResponderPQRS(data) {
  const auth = _requireJunta(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  if (!data.respuesta)
    return ok({ success: false, message: 'La respuesta no puede estar vacía' });

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('PQRS');
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] !== data.id) continue;
    const nuevoEstado = data.estado || 'en_tramite';
    sheet.getRange(i + 1, 9).setValue(nuevoEstado);
    sheet.getRange(i + 1, 10).setValue((data.respuesta || '').trim());
    sheet.getRange(i + 1, 11).setValue(new Date().toISOString());
    sheet.getRange(i + 1, 12).setValue(auth.user.nombre + ' ' + auth.user.apellido);
    return ok({ success: true });
  }
  return ok({ success: false, message: 'PQRS no encontrada' });
}


// ════════════════════════════════════════════════════════════════
//  NOTICIAS
// ════════════════════════════════════════════════════════════════

function handleGetNoticias(data) {
  // Cualquier usuario autenticado puede ver noticias visibles
  const auth = _getUserByToken(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  const rows = _getSheetRows('Noticias');
  let list   = rows.map(_rowToNoticia);

  // Si no es junta, solo las visibles
  if (auth.user.rol !== 'junta') list = list.filter(n => n.visible);
  return ok({ success: true, noticias: list.reverse() });
}

function handleCreateNoticia(data) {
  const auth = _requireJunta(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  if (!data.titulo || !data.contenido)
    return ok({ success: false, message: 'Título y contenido son obligatorios' });

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Noticias');
  const id    = Utilities.getUuid();

  sheet.appendRow([
    id,
    new Date().toISOString(),
    (data.titulo    || '').trim(),
    (data.contenido || '').trim(),
    auth.user.nombre + ' ' + auth.user.apellido,
    data.visible !== false,
  ]);

  return ok({ success: true, id });
}

function handleUpdateNoticia(data) {
  const auth = _requireJunta(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Noticias');
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] !== data.id) continue;
    if (data.titulo    !== undefined) sheet.getRange(i+1, 3).setValue(data.titulo);
    if (data.contenido !== undefined) sheet.getRange(i+1, 4).setValue(data.contenido);
    if (data.visible   !== undefined) sheet.getRange(i+1, 6).setValue(data.visible);
    return ok({ success: true });
  }
  return ok({ success: false, message: 'Noticia no encontrada' });
}

function handleDeleteNoticia(data) {
  const auth = _requireJunta(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Noticias');
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] !== data.id) continue;
    sheet.deleteRow(i + 1);
    return ok({ success: true });
  }
  return ok({ success: false, message: 'Noticia no encontrada' });
}


// ════════════════════════════════════════════════════════════════
//  AFILIADOS (admin)
// ════════════════════════════════════════════════════════════════

function handleGetAfiliados(data) {
  const auth = _requireJunta(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  const rows = _getSheetRows('Usuarios');
  return ok({ success: true, afiliados: rows.map(_rowToUser) });
}

function handleCreateAfiliado(data) {
  const auth = _requireJunta(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  if (!data.email || !data.nombre || !data.apellido || !data.password)
    return ok({ success: false, message: 'Email, nombre, apellido y contraseña son obligatorios' });

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Usuarios');
  const rows  = sheet.getDataRange().getValues();

  // Verificar que el email no exista
  const emailLower = data.email.trim().toLowerCase();
  for (let i = 1; i < rows.length; i++) {
    if ((rows[i][1] || '').toLowerCase() === emailLower)
      return ok({ success: false, message: 'Ya existe un usuario con ese email' });
  }

  const nuevoId = _crearUsuario(sheet, {
    nombre:       data.nombre,
    apellido:     data.apellido,
    email:        data.email,
    password:     data.password,
    cargo:        data.cargo || '',
    num_afiliado: data.num_afiliado || '',
    fecha_ingreso:data.fecha_ingreso || new Date().toISOString().split('T')[0],
    rol:          data.rol || 'afiliado',
    activo:       true,
  });

  return ok({ success: true, id: nuevoId });
}

function handleUpdateAfiliado(data) {
  const auth = _requireJunta(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Usuarios');
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] !== data.id) continue;
    if (data.nombre        !== undefined) sheet.getRange(i+1,  3).setValue(data.nombre);
    if (data.apellido      !== undefined) sheet.getRange(i+1,  4).setValue(data.apellido);
    if (data.telefono      !== undefined) sheet.getRange(i+1,  5).setValue(data.telefono);
    if (data.cargo         !== undefined) sheet.getRange(i+1,  6).setValue(data.cargo);
    if (data.num_afiliado  !== undefined) sheet.getRange(i+1,  7).setValue(data.num_afiliado);
    if (data.fecha_ingreso !== undefined) sheet.getRange(i+1,  8).setValue(data.fecha_ingreso);
    if (data.rol           !== undefined) sheet.getRange(i+1,  9).setValue(data.rol);
    if (data.activo        !== undefined) sheet.getRange(i+1, 10).setValue(data.activo);
    const updated = sheet.getRange(i+1, 1, 1, rows[i].length).getValues()[0];
    return ok({ success: true, user: _rowToUser(updated) });
  }
  return ok({ success: false, message: 'Usuario no encontrado' });
}

function handleResetPassword(data) {
  const auth = _requireJunta(data.token);
  if (!auth.valid) return ok({ success: false, message: auth.message });

  if (!data.id || !data.newPassword)
    return ok({ success: false, message: 'ID y nueva contraseña son requeridos' });

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Usuarios');
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] !== data.id) continue;
    sheet.getRange(i+1, 11).setValue(_hash(data.newPassword));
    // Invalidar token activo
    sheet.getRange(i+1, 12).setValue('');
    sheet.getRange(i+1, 13).setValue('');
    return ok({ success: true });
  }
  return ok({ success: false, message: 'Usuario no encontrado' });
}


// ════════════════════════════════════════════════════════════════
//  HELPERS INTERNOS
// ════════════════════════════════════════════════════════════════

/** Crea un usuario en la hoja y devuelve su ID. */
function _crearUsuario(sheet, u) {
  const id = Utilities.getUuid();
  sheet.appendRow([
    id,
    (u.email        || '').trim().toLowerCase(),
    (u.nombre       || '').trim(),
    (u.apellido     || '').trim(),
    (u.telefono     || '').trim(),
    (u.cargo        || '').trim(),
    (u.num_afiliado || '').trim(),
    u.fecha_ingreso || new Date().toISOString().split('T')[0],
    u.rol    || 'afiliado',
    u.activo !== false,
    _hash(u.password || ''),
    '',   // Token
    '',   // Token_Expiry
  ]);
  return id;
}

/** Busca un usuario por su token, valida expiración. */
function _getUserByToken(token) {
  if (!token) return { valid: false, message: 'Sesión no válida. Inicia sesión nuevamente.' };

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Usuarios');
  const rows  = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[11] !== token) continue;   // columna 12 = Token

    // Verificar expiración
    const expiry = row[12] ? new Date(row[12]) : null;
    if (!expiry || expiry < new Date())
      return { valid: false, message: 'Tu sesión ha expirado. Inicia sesión nuevamente.' };

    // Verificar cuenta activa
    if (!row[9])
      return { valid: false, message: 'Tu cuenta está inactiva.' };

    return { valid: true, user: _rowToUser(row) };
  }
  return { valid: false, message: 'Sesión no válida. Inicia sesión nuevamente.' };
}

/** Valida token y exige rol junta. */
function _requireJunta(token) {
  const result = _getUserByToken(token);
  if (!result.valid) return result;
  if (result.user.rol !== 'junta')
    return { valid: false, message: 'No tienes permisos para esta acción.' };
  return result;
}

/** Devuelve todas las filas de una hoja (sin encabezado). */
function _getSheetRows(sheetName) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const data  = sheet.getDataRange().getValues();
  return data.slice(1);   // quita encabezado
}

/** Convierte fila de Usuarios en objeto usuario (sin datos sensibles). */
function _rowToUser(row) {
  return {
    id:           row[0]  || '',
    email:        row[1]  || '',
    nombre:       row[2]  || '',
    apellido:     row[3]  || '',
    telefono:     row[4]  || '',
    cargo:        row[5]  || '',
    num_afiliado: row[6]  || '',
    fecha_ingreso:row[7]  || '',
    rol:          row[8]  || 'afiliado',
    activo:       row[9]  === true || row[9] === 'TRUE' || row[9] === 'true',
    // NO incluye password_hash, token, token_expiry
  };
}

/** Convierte fila de Clasificados en objeto. */
function _rowToClasificado(row) {
  return {
    id:              row[0] || '',
    fecha:           row[1] ? new Date(row[1]).toISOString() : '',
    email_afiliado:  row[2] || '',
    nombre_afiliado: row[3] || '',
    categoria:       row[4] || '',
    titulo:          row[5] || '',
    descripcion:     row[6] || '',
    precio:          row[7] || '',
    url_imagen:      row[8] || '',
    estado:          row[9] || 'pendiente',
    tipo_aviso:      row[10] || 'sintralci',
  };
}

/** Convierte fila de PQRS en objeto. */
function _rowToPQRS(row) {
  return {
    id:              row[0]  || '',
    fecha:           row[1]  ? new Date(row[1]).toISOString() : '',
    email_afiliado:  row[2]  || '',
    nombre_afiliado: row[3]  || '',
    telefono:        row[4]  || '',
    tipo:            row[5]  || '',
    asunto:          row[6]  || '',
    descripcion:     row[7]  || '',
    estado:          row[8]  || 'abierto',
    respuesta:       row[9]  || '',
    fecha_respuesta: row[10] ? new Date(row[10]).toISOString() : '',
    respondido_por:  row[11] || '',
  };
}

/** Convierte fila de Noticias en objeto. */
function _rowToNoticia(row) {
  return {
    id:       row[0] || '',
    fecha:    row[1] ? new Date(row[1]).toISOString() : '',
    titulo:   row[2] || '',
    contenido:row[3] || '',
    autor:    row[4] || '',
    visible:  row[5] === true || row[5] === 'TRUE' || row[5] === 'true',
  };
}

/** Sube imagen base64 a Drive y devuelve URL incrustable.
 *  Usa el endpoint /thumbnail, que es el que hoy sí funciona dentro de
 *  etiquetas <img>. El antiguo uc?export=view dejó de servir (Google
 *  redirige a una pantalla de advertencia) y por eso las fotos no se veían. */
function _subirImagen(base64, mimeType) {
  try {
    const decoded = Utilities.base64Decode(base64);
    const blob    = Utilities.newBlob(decoded, mimeType, 'img_' + Date.now() + '.jpg');
    const folder  = DriveApp.getFolderById(FOLDER_ID);
    const file    = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1200';
  } catch (e) {
    console.warn('Error subiendo imagen: ' + e.message);
    return '';
  }
}

/** SHA-256 del texto dado (en hex). */
function _hash(text) {
  const bytes  = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(text),
    Utilities.Charset.UTF_8
  );
  return bytes.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
}

/** Pone encabezados con formato de color en la primera fila. */
function _setHeader(sheet, headers, bgColor) {
  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setBackground(bgColor)
    .setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
}

/** Devuelve respuesta JSON. */
function ok(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
