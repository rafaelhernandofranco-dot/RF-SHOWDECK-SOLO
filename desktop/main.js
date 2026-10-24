// RF ShowKeys Solo para computadora: abre la app en su propia ventana (sin navegador).
// Funciona sin internet despues de la primera vez (la app queda guardada) y se actualiza sola.
const { app, BrowserWindow, shell, Menu } = require ('electron');
const URL_APP = 'https://rafaelhernandofranco-dot.github.io/RF-SHOWDECK-SOLO/';

app.commandLine.appendSwitch ('autoplay-policy', 'no-user-gesture-required');
if (!app.requestSingleInstanceLock()) app.quit();

let win = null;
function isApp (u) { return u.startsWith (URL_APP); }
function create ()
{
  win = new BrowserWindow ({
    width: 1280, height: 820, minWidth: 900, minHeight: 600, backgroundColor: '#0b1118', title: 'RF ShowKeys Solo',
    autoHideMenuBar: true, webPreferences: { contextIsolation: true, sandbox: true, backgroundThrottling: false }
  });
  win.loadURL (URL_APP);
  // Spotify y otros enlaces: se abren fuera (app de Spotify o navegador)
  win.webContents.setWindowOpenHandler (({ url }) => { if (!isApp (url)) shell.openExternal (url); return { action: 'deny' }; });
  win.webContents.on ('will-navigate', (e, url) => { if (!isApp (url)) { e.preventDefault(); shell.openExternal (url); } });
  // sin internet y sin copia guardada: mensaje claro
  win.webContents.on ('did-fail-load', (e, code, desc, url, main) =>
  {
    if (!main) return;
    win.loadURL ('data:text/html;charset=utf-8,' + encodeURIComponent (
      '<body style="background:#0b1118;color:#d8e2f0;font:16px system-ui;display:flex;flex-direction:column;align-items:center;justify-content:center;height:90vh;text-align:center">' +
      '<h2>RF ShowKeys Solo necesita internet la primera vez</h2><p style="color:#8aa0bd">Conéctate una vez para descargarla; después funciona sin internet.</p>' +
      '<button onclick="location.href=\'' + URL_APP + '\'" style="font:600 16px system-ui;padding:12px 20px;border-radius:10px;border:0;background:#5cc8ff">Reintentar</button></body>'));
  });
  win.on ('closed', () => { win = null; });
}
app.on ('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then (() =>
{
  if (process.platform === 'darwin')
    Menu.setApplicationMenu (Menu.buildFromTemplate ([{ role: 'appMenu' }, { role: 'editMenu' }, { role: 'viewMenu' }, { role: 'windowMenu' }]));
  else Menu.setApplicationMenu (null);
  create();
  app.on ('activate', () => { if (!win) create(); });
});
app.on ('window-all-closed', () => app.quit());
