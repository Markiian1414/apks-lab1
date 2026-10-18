# Архітектура агента Build Engineer

## 1. Проблеми, які вирішує агент

Агент Build Engineer автоматизує повний життєвий цикл навчального JavaScript-проєкту Hello World:

- відтворюване створення початкової структури проєкту;
- налаштування npm scripts і кросплатформного складання;
- створення та запуск юніт-тестів Jest;
- підготовка CI для Ubuntu, Windows і macOS без ручного дублювання команд;
- перевірка структури, конфігурації, build-артефактів, тестів і workflow;
- явне повідомлення про помилки без маскування `FAIL` або хибного оголошення успіху.

Результатом має бути проєкт, у якому `npm run build` створює `dist/hello` і `dist/hello.cmd`, тест `BasicAddition` проходить, а GitHub Actions використовує ті самі `ci.sh` і `ci.bat`, що й локальна перевірка.

## 2. Складові агента

### Manifest

[`.github/agents/build-engineer.agent.md`](../.github/agents/build-engineer.agent.md) — manifest custom agent. Він визначає роль інженера зі складання та CI/CD, область відповідальності, правила роботи з файлами, заборонені дії, критерії успішного завершення та поведінку при помилці.

### Skills

Skills містять спеціалізовані багатоетапні інструкції:

1. [`project-scaffold`](../.github/skills/project-scaffold/SKILL.md) — створює або безпечно доповнює базовий JavaScript-проєкт Hello World: `src/index.js`, `package.json`, `README.md`, `.gitignore` і каталоги `src/`, `tests/`, `docs/`. Перевіряє `hello()` та запуск `npm start`.
2. [`build-and-test`](../.github/skills/build-and-test/SKILL.md) — налаштовує scripts `build`, `test`, `start`, Jest, `scripts/build.js`, `src/math.js`, тест `BasicAddition`, `jest.config.js`, `ci.sh` і `ci.bat`. Перевіряє складання та відсутність build-артефактів під контролем Git.
3. [`github-actions`](../.github/skills/github-actions/SKILL.md) — готує `.github/workflows/ci.yml` із matrix для Ubuntu, Windows і macOS. Workflow викликає лише `ci.sh` або `ci.bat`, завантажує `dist/` і не містить прямих npm-команд, секретів або токенів.

### Commands

У `.github/prompts/` розміщено шість prompt-команд для GitHub Copilot у VS Code:

1. [`git-init`](../.github/prompts/git-init.prompt.md) — перевіряє наявність Git-репозиторію, гілку та `.gitignore`; не виконує `git init` без дозволу.
2. [`create-project`](../.github/prompts/create-project.prompt.md) — викликає `project-scaffold` і створює початковий Hello World.
3. [`create-build`](../.github/prompts/create-build.prompt.md) — викликає `build-and-test`, налаштовує складання, Jest і локальні CI-скрипти.
4. [`create-actions`](../.github/prompts/create-actions.prompt.md) — викликає `github-actions` і створює workflow.
5. [`check`](../.github/prompts/check.prompt.md) — виконує read-only комплексну перевірку та формує таблицю `PASS`/`FAIL`.
6. [`init`](../.github/prompts/init.prompt.md) — оркеструє повний сценарій у фіксованому порядку.

### Оркестратор `init`

`init` не реалізує окрему build-логіку. Він перевіряє передумови, читає кожен prompt і послідовно виконує:

`git-init → create-project → create-build → create-actions → check`.

Після кожного кроку оркестратор перевіряє результат і зупиняється на першій помилці.

## 3. Взаємодія складових

| Рівень | Викликає або використовує | Результат і файли |
|---|---|---|
| Manifest `build-engineer` | Визначає роль, правила, Skills і Commands | Єдині обмеження агента та критерії успіху |
| `project-scaffold` Skill | Викликається командою `create-project` | `src/index.js`, `package.json`, `README.md`, `.gitignore`, `src/`, `tests/`, `docs/` |
| `build-and-test` Skill | Викликається командою `create-build` | npm scripts, `scripts/build.js`, `src/math.js`, `tests/basic.test.js`, `jest.config.js`, `ci.sh`, `ci.bat` |
| `github-actions` Skill | Викликається командою `create-actions` | `.github/workflows/ci.yml` |
| Commands | `git-init`, `create-project`, `create-build`, `create-actions`, `check` | Керують окремими етапами, перевірками та передачею результатів |
| Orchestrator `init` | Послідовно викликає всі п’ять робочих команд | Повний сценарій від Git-підготовки до фінального вердикту |

`init` очікує наявність усіх п’яти prompt-файлів і трьох Skills до початку виконання. Manifest описує доступні компоненти, але фактична послідовність визначена `init`.

## 4. Дані між етапами

Передача результатів є послідовною:

1. `git-init` створює або доповнює `.gitignore` і підтверджує готовність Git-репозиторію.
2. `create-project` на основі `project-scaffold` створює `src/index.js` і `package.json`, а також документацію та базові каталоги.
3. `create-build` використовує `src/index.js` і `package.json`, додає `scripts/build.js`, `src/math.js`, тест `tests/basic.test.js`, `jest.config.js`, `ci.sh` і `ci.bat`.
4. `create-actions` використовує `ci.sh` і `ci.bat` та створює `.github/workflows/ci.yml` для трьох операційних систем.
5. `check` перевіряє всі попередні результати, запускає build і Jest, контролює Git-ігнорування та повертає фінальний вердикт.

Схема потоку:

```text
.gitignore
    ↓
src/index.js + package.json
    ↓
scripts/build.js + src/math.js + tests/basic.test.js
    + jest.config.js + ci.sh + ci.bat
    ↓
.github/workflows/ci.yml
    ↓
вердикт check: PASS або FAIL
```

`dist/hello` і `dist/hello.cmd` є похідними build-артефактами: вони створюються під час складання, але не повинні потрапляти під контроль Git.

## 5. Обробка помилок оркестратором

Перед запуском `init` перевіряються корінь Git-репозиторію, Node.js, npm, п’ять prompt-файлів і три Skills. Якщо передумова не виконана, сценарій не починається.

Після кожного кроку:

- перевіряється фактичний результат;
- фіксуються крок, команда та точна причина помилки;
- виконання зупиняється на першому `FAIL`;
- наступні команди не запускаються;
- `FAIL` не замінюється успішним результатом.

Повний сценарій може мати вердикт `PASS` лише тоді, коли всі етапи завершилися успішно, а команда `check` явно повернула `PASS`.

## 6. Відповідність файлів ролям

| Файл або шлях | Роль |
|---|---|
| [`.github/agents/build-engineer.agent.md`](../.github/agents/build-engineer.agent.md) | Manifest custom agent: роль, межі, Skills, Commands, критерії успіху та заборони |
| [`.github/skills/*/SKILL.md`](../.github/skills/) | Skills зі спеціалізованими процедурами генерації, build/test і CI |
| [`.github/prompts/*.prompt.md`](../.github/prompts/) | Commands для GitHub Copilot у VS Code |
| `ci.sh` / `ci.bat` | Кросплатформні скрипти складання й тестування, які використовуються локально та в CI |
| `.github/workflows/ci.yml` | GitHub Actions CI для Ubuntu, Windows і macOS |
| `package.json` | npm scripts, метадані проєкту та devDependency Jest |
| `scripts/build.js` | Node.js-скрипт генерації `dist/hello` і `dist/hello.cmd` |
| `tests/basic.test.js` | Jest-тест арифметики з назвою `BasicAddition` |

## 7. Відхилення від методички

Проєкт реалізовано на JavaScript із npm scripts і Jest (варіант 3), а не на CMake. Тому замість `CMakeLists.txt` використовуються:

- `package.json` — метадані та сценарії npm;
- `jest.config.js` — конфігурація Jest;
- `scripts/build.js` — кросплатформна логіка складання.

Каталог результату складання називається `dist/`, а не `build/`, оскільки `dist/` є типовим каталогом результатів для JavaScript-проєктів. Каталоги `dist/`, `build/`, `coverage/` і `node_modules/` не повинні відстежуватися Git.

## 8. Обмеження агента

- Не видаляє файли та не перезаписує наявні файли без потреби.
- Працює ідемпотентно: не дублює scripts, залежності, тести, workflow-кроки або правила `.gitignore`.
- Не комітить автоматично та не виконує `git push`, зокрема `git push --force`.
- Не виконує `git reset --hard` і не переписує історію Git.
- Не змінює захист гілок.
- Не читає, не публікує та не комітить секрети, токени, паролі або ключі.
- Не підміняє вивід тестів, не пропускає тести й не маскує `FAIL`.
- Зупиняється при відсутніх передумовах або першій помилці та повідомляє точну причину.
- Не оголошує успіх без проходження всіх перевірок і фінального `PASS` від `check`.
