# Лабораторна робота I: AI-агент для автоматизації розробки та CI/CD

## Автор

- **ПІП:** Леньо Маркіян Олегович
- **Група:** КІ-405
- **Варіант:** 15 → 3
- **Технології:** JavaScript, npm scripts, Jest

## Опис

Цей репозиторій містить AI-агента `build-engineer` для GitHub Copilot, який генерує, збирає, тестує та перевіряє кросплатформний проєкт Hello World на JavaScript (npm scripts + Jest), а також налаштовує GitHub Actions для Windows, Linux і macOS.

## Запуск агента

### Вимоги

- VS Code із GitHub Copilot Chat;
- Node.js LTS;
- Git.

### Запуск

1. Створи гілку `feature/...` від `develop`.
2. Відкрий корінь репозиторію у VS Code.
3. Відкрий Copilot Chat у режимі **Local**.
4. Вибери агента `build-engineer`.
5. Виконай `/init` і вибери саме команду з описом **«Послідовно виконати повний сценарій…»**.
6. Переглянь згенеровані файли перед створенням коміту.

Окрему перевірку запускай командою `/check`.

## Збірка і запуск проєкту

На Linux/macOS виконай:

```text
bash ci.sh
```

На Windows виконай:

```text
ci.bat
```

Після успішної збірки готовий файл доступний за шляхом `dist/hello`. На Windows використовуй `dist\hello.cmd`.

## Структура репозиторію

- `.github/agents` — manifest custom agent `build-engineer`.
- `.github/skills` — Skills для створення проєкту, складання, тестування та GitHub Actions.
- `.github/prompts` — команди для запуску окремих етапів і повного сценарію.
- `.github/workflows` — конфігурація GitHub Actions CI.
- `src` — вихідний код JavaScript-проєкту.
- `tests` — юніт-тести Jest.
- `scripts` — Node.js-скрипти складання.
- `docs` — документація про використання та архітектуру агента.
- `ci.sh` — локальна CI-перевірка для Linux/macOS.
- `ci.bat` — локальна CI-перевірка для Windows.

## Документація

- [`docs/usage.md`](docs/usage.md) — повна інструкція, локальна перевірка та запуск зібраного проєкту.
- [`docs/architecture.md`](docs/architecture.md) — архітектура агента та взаємодія його складових.



