# Руководство по миграции Voice Clock v0.2.0

## Изменения в версии 0.2.0

### Обновленные зависимости
- **React**: 16.13.1 → 18.3.1
- **Electron**: 10.1.1 → 33.2.1
- **node-sass** → **sass**: 1.82.0
- Удалены: Redux, React Router, Bootstrap (неиспользуемые зависимости)

### Исправленные критические проблемы

#### 1. Безопасность Electron
**Было:**
```javascript
webPreferences: {
    nodeIntegration: true,
    enableRemoteModule: true,
    webSecurity: false,
}
```

**Стало:**
```javascript
webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: false,
}
```

#### 2. Утечка памяти в App.js
**Было:** `setInterval` без cleanup
**Стало:** Правильный `useEffect` с возвратом cleanup функции

#### 3. React 18 API
**Было:** `ReactDOM.render()`
**Стало:** `createRoot().render()`

### Поддержка macOS

Добавлена полная поддержка:
- **Intel (x64)** и **Apple Silicon (arm64)**
- Форматы: DMG и ZIP
- Правильные entitlements для macOS
- Исправлен путь к electron в electron-reload

## Инструкции по установке

### 1. Очистка старых зависимостей

```bash
# Удалите старые файлы
rm -rf node_modules
rm -f yarn.lock package-lock.json

# Очистите кеш (опционально)
npm cache clean --force
```

### 2. Установка зависимостей

```bash
# Используйте npm или yarn
npm install
# или
yarn install
```

### 3. Запуск в режиме разработки

```bash
# Запуск React + Electron
npm run electron-dev
# или
yarn electron-dev
```

### 4. Сборка для продакшена

**Только для macOS:**
```bash
npm run electron-pack-mac
```

**Для всех платформ:**
```bash
npm run release
```

## Что может потребовать внимания

### TimeReader компонент
Проверьте работу Web Speech API - возможны изменения в современных версиях Chrome/Electron.

### Иконки
Убедитесь, что файлы иконок находятся в:
- `assets/icon.icns` (macOS)
- `assets/icon.ico` (Windows)
- `assets/icons/` (Linux)

## Команды для разработки

```bash
# Только React dev server
npm start

# Electron + React (рекомендуется)
npm run electron-dev

# Сборка React приложения
npm run build

# Запуск Electron с собранным приложением
npm run electron
```

## Возможные проблемы и решения

### Ошибка "Module not found: sass-loader"
```bash
npm install sass --save-dev
```

### Ошибка при запуске electron-reload на macOS
Путь к electron исправлен в `electron.js` - должно работать автоматически.

### Проблемы с DevTools
DevTools теперь устанавливаются только в dev-режиме и обрабатывают ошибки.

## Дополнительная информация

Проект теперь полностью совместим с:
- **macOS** (Intel + Apple Silicon)
- **Windows** (x64)
- **Linux** (AppImage, deb)
