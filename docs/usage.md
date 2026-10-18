# Інструкція з використання агента

## 1. Вимоги

Для роботи потрібні:

- VS Code із розширеннями GitHub Copilot і GitHub Copilot Chat;
- обліковий запис GitHub зі студентським планом Copilot;
- Node.js LTS і npm;
- Git.

Переконайся, що Node.js, npm і Git доступні в PATH:

```text
node -v
npm -v
git --version
```

## 2. Запуск агента

1. Відкрий корінь Git-репозиторію у VS Code.
2. Відкрий GitHub Copilot Chat.
3. Перемкни Copilot Chat у режим **Local**.
4. Вибери агента `build-engineer`.
5. Виконай команду `/init`.

Після введення `/init` у меню може бути також вбудована команда **«Initialize Copilot instructions for this repository»**. Вибери саме команду з описом **«Послідовно виконати повний сценарій…»**.

Якщо в чаті вибрано режим Copilot замість Local, prompt-команди не показуються. Запасний варіант запуску: `Ctrl+Shift+P` → **Chat: Run Prompt…** → `init`.

Окремі команди запускаються так само:

- `/git-init`;
- `/create-project`;
- `/create-build`;
- `/create-actions`;
- `/check`.

## 3. Очікуваний результат запуску

Після успішного виконання повного сценарію мають бути створені або підготовлені:

- `.gitignore`;
- `src/index.js`;
- `package.json`;
- `README.md`;
- каталоги `src/`, `tests/`, `docs/`;
- `scripts/build.js`;
- `src/math.js`;
- `tests/basic.test.js`;
- `jest.config.js`;
- `ci.sh`;
- `ci.bat`;
- `.github/workflows/ci.yml`.

Під час складання також створюються `dist/hello` і `dist/hello.cmd`. Це build-артефакти, тому вони не повинні відстежуватися Git.

Фінальний результат вважається успішним лише за наявності вердикту `PASS` від команди `check`. Вердикт `FAIL` означає, що потрібно виправити вказану проблему та повторити перевірку.

## 4. Локальна перевірка без агента

Виконуй команди з кореня проєкту.

### Встановлення залежностей

Якщо є lock-файл, виконай:

```text
npm ci
```

Якщо lock-файлу немає, виконай:

```text
npm install
```

Команда має завершитися без помилок і встановити Jest.

### Складання

```text
npm run build
```

Очікуваний результат: команда завершується успішно та створює `dist/hello` і `dist/hello.cmd`.

### Юніт-тести

```text
npm test
```

Очікуваний результат: Jest завершується успішно, а тест із назвою `BasicAddition` має статус passed.

### Запуск build-артефакту

На Linux/macOS:

```text
./dist/hello
```

На Windows:

```text
dist\hello.cmd
```

Обидві команди мають вивести:

```text
Hello World
```

### Запуск CI-скрипта локально

На Linux/macOS:

```text
bash ci.sh
```

На Windows:

```text
ci.bat
```

Скрипт має успішно виконати встановлення залежностей, складання, Jest-тести та перевірку `dist/hello`. У виводі мають бути успішне складання, тест `BasicAddition` зі статусом passed і перевірка наявності build-артефакту.

## 5. Запуск зібраного проєкту

Для запуску через npm виконай:

```text
npm start
```

Очікуваний вивід:

```text
Hello World
```

Також можна запустити зібраний Unix-лаунчер:

```text
./dist/hello
```

Він має вивести `Hello World`.

## 6. GitHub Actions

Workflow розташований у `.github/workflows/ci.yml`. Він запускається після:

- `push` до гілок `develop` і `main`;
- `pull_request` до гілок `develop` і `main`.

Workflow перевіряє проєкт на Ubuntu, Windows і macOS. Після завершення запуску артефакти збірки можна знайти у GitHub:

1. відкрий вкладку **Actions** у репозиторії;
2. відкрий потрібний запуск workflow;
3. знайди секцію **Artifacts**;
4. завантаж артефакт, назва якого містить операційну систему.

## 7. Типові проблеми

### Node.js не встановлено

Якщо `node`, `npm` або `npm start` недоступні, встанови Node.js LTS разом із npm, перезапусти VS Code і повтори перевірку:

```text
node -v
npm -v
```

### Copilot не бачить prompt

Переконайся, що:

- відкрито саме корінь репозиторію;
- GitHub Copilot Chat працює в режимі **Local**;
- вибрано агента `build-engineer`;
- потрібний prompt-файл існує.

Якщо prompt-команди не показуються, переконайся, що не вибрано режим Copilot замість Local. Запусти prompt через `Ctrl+Shift+P` → **Chat: Run Prompt…** → `init`. Після `/init` обирай команду з описом **«Послідовно виконати повний сценарій…»**, а не вбудовану команду **«Initialize Copilot instructions for this repository»**.

### `dist/hello` не виконується на Linux/macOS

Надай Unix-лаунчеру право на виконання:

```text
chmod +x dist/hello
```

Після цього повтори:

```text
./dist/hello
```

Якщо проблема не зникає, повторно виконай `npm run build` і перевір повідомлення про помилку.
