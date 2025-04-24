const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// CommonJS 中 __dirname 是内置变量，可以直接使用
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../public/zzf.ico'), // 确认图标路径相对于 electron/main.js
    webPreferences: {
      nodeIntegration: true, // 注意安全风险，生产环境建议关闭或使用 preload
      contextIsolation: false // 同上
    }
  });

  // 开发环境下加载本地服务
  // 检查 NODE_ENV，或者你可以设置一个专门的开发环境变量
  const isDev = process.env.NODE_ENV === 'production'; // 或者使用 cross-env 设置一个如 ELECTRON_ENV=development
  console.log(`Is development environment? ${isDev}`); // 添加日志确认环境判断

  if (isDev) {
    const devUrl = 'http://localhost:1314'; // 确认 Vite 端口
    // 增加延时确保 Vite 服务器完全启动
    win.loadURL(devUrl)
    win.webContents.openDevTools();
  } else {
    // 生产环境下加载打包后的index.html
    const indexPath = path.resolve(__dirname, '../dist/index.html');
    console.log(`Loading production build from: ${indexPath}`);

    win.loadFile(indexPath).catch(err => {
      console.error('Failed to load index.html:', err);
      // 尝试使用相对路径
      const fallbackPath = './dist/index.html';
      console.log('Trying fallback path:', fallbackPath);
      win.loadFile(fallbackPath).catch(innerErr => {
        console.error('Fallback load failed:', innerErr);
      });
    });
    // 保留 DevTools 以便调试
    win.webContents.openDevTools();
  }

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`Page failed to load: ${validatedURL}`, errorDescription, `Error Code: ${errorCode}`);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}).catch(err => {
  console.error('App ready error:', err);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 移除顶部菜单栏
Menu.setApplicationMenu(null);