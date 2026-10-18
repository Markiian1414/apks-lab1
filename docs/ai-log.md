# Журнал роботи з AI

Я працював у VS Code з інструментом GitHub Copilot Chat і агентом `build-engineer`.

| Етап | Запит | Результат |
|---|---|---|
| 1 | Створити README і `.gitignore` | README і `.gitignore` створено. |
| 2 | Створити manifest `build-engineer.agent.md` | Manifest створено. |
| 3 | Створити skill `project-scaffold` | Skill створено. |
| 4 | Створити skill `build-and-test` | Skill створено. |
| 5 | Створити skill `github-actions` | Skill створено після уточнення передумов. |
| 6 | Створити шість commands: `git-init`, `create-project`, `create-build`, `create-actions`, `check`, `init` | Шість commands створено. |
| 7 | Створити `docs/architecture.md` і `docs/usage.md` | Документацію створено. |
| 8 | Запустити `/init` на гілці `feature/hello-js` | Згенеровано проєкт, build, тест, CI-скрипти та workflow. |
| 9 | Виконати ручний перегляд, виправлення і повторну перевірку | Виправлення виконано, перевірку повторено. |

## Помилки та виправлення

- Copilot відмовився створювати skill `github-actions`, бо не знайшов `ci.sh` і `ci.bat`, неправильно прочитавши мою умову про передумови. Я уточнив, що умова стосується запуску skill, і файл створився.
- VS Code показав, що атрибут `mode` у prompt-файлі застарів. Я замінив його на `agent: build-engineer`.
- Перший `/init` запустив вбудовану команду Copilot, яка створила `.github/copilot-instructions.md`, а не мій оркестратор. Причина була в тому, що в чаті був режим Copilot замість Local, а prompt-команди не показувались. Я видалив файл, перемкнувся на Local, вибрав агента `build-engineer` і команду з описом сценарію.
- Агент згенерував у `package.json` дубльований ключ `devDependencies` (`jest ^30.2.0` і `^30.5.2`). Я виправив це через Copilot і додав у skill `build-and-test` вимогу одного ключа та перевірку кількості входжень.
- Через Copilot я додав `shell: cmd` для Windows-кроку в `ci.yml` і файл `.gitattributes` (LF для `.sh`, CRLF для `.bat`) як запобіжні заходи. Також я додав ці вимоги в skill `github-actions` і команду `git-init`.
- Команда `check` хибно видала `FAIL` на перевірці manifest через кодування кирилиці в PowerShell-regex. Я переніс перевірку на `node -e`.

## Прийняті рішення

- Я обрав проєкт на JavaScript (npm scripts + Jest) за варіантом 3.
- Я обрав каталог результату збірки `dist/` замість `build/`.
- Я визначив, що CI викликає лише `ci.sh` і `ci.bat`.
- Я визначив, що перевірка під час `/init` виконується командою `check`.

## Підсумок перевірок

Команда `check` повернула 12 із 12 `PASS`.

GitHub Actions пройшли на `ubuntu-latest`, `windows-latest` і `macos-latest`. Створено три артефакти.

Посилання на PR: (додам пізніше)

Посилання на запуск Actions: (додам пізніше)
