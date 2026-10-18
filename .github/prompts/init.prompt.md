---
agent: build-engineer
description: "Послідовно виконати повний сценарій генерації, складання, тестування та перевірки JavaScript-проєкту Hello World."
---

# Призначення

Цей prompt є оркестратором повного сценарію генерації проєкту. Він послідовно запускає підготовку Git, створення початкового проєкту, налаштування складання і тестів, створення GitHub Actions workflow та фінальну перевірку.

## Передумови

Перед початком перевір:

- поточний каталог є коренем Git-репозиторію;
- встановлено Node.js і npm;
- існують усі п'ять prompt-файлів:
  - `.github/prompts/git-init.prompt.md`;
  - `.github/prompts/create-project.prompt.md`;
  - `.github/prompts/create-build.prompt.md`;
  - `.github/prompts/create-actions.prompt.md`;
  - `.github/prompts/check.prompt.md`;
- існують усі три Skills:
  - `.github/skills/project-scaffold/SKILL.md`;
  - `.github/skills/build-and-test/SKILL.md`;
  - `.github/skills/github-actions/SKILL.md`.

Перевір усі передумови до початку першого кроку. Якщо чогось бракує, зупинись і повідом, який саме ресурс або інструмент відсутній. Не починай часткове виконання сценарію.

## Порядок дій

Не пропускай і не змінюй порядок кроків. Для кожного кроку спочатку прочитай відповідний prompt-файл, а потім виконай усі його інструкції:

1. `git-init` — `.github/prompts/git-init.prompt.md`;
2. `create-project` — `.github/prompts/create-project.prompt.md`;
3. `create-build` — `.github/prompts/create-build.prompt.md`;
4. `create-actions` — `.github/prompts/create-actions.prompt.md`;
5. `check` — `.github/prompts/check.prompt.md`.

## Передача результатів між кроками

Передавай і перевіряй результати послідовно:

| Крок | Створює або готує | Наступний крок очікує |
|---|---|---|
| `git-init` | `.gitignore` і підтверджений стан Git | `create-project` очікує підготовлений репозиторій |
| `create-project` | `src/index.js`, `package.json`, `README.md`, `.gitignore`, каталоги `src/`, `tests/`, `docs/` | `create-build` очікує `src/index.js` і `package.json` |
| `create-build` | scripts у `package.json`, `scripts/build.js`, `src/math.js`, `tests/basic.test.js`, `jest.config.js`, `ci.sh`, `ci.bat` | `create-actions` очікує `ci.sh` і `ci.bat` |
| `create-actions` | `.github/workflows/ci.yml` | `check` очікує workflow та всі попередні ресурси |
| `check` | фінальний вердикт перевірки | сценарій завершується лише з вердиктом `PASS` |

Build-артефакти `dist/hello` і `dist/hello.cmd` можуть бути створені під час `create-build` або `check`, але не повинні комітитися.

## Обробка помилок

Після кожного кроку перевір результат перед переходом до наступного. При першій помилці негайно зупинись:

- покажи назву кроку;
- покажи команду або перевірку, яка завершилася невдало;
- покажи точну причину;
- не виконуй наступні кроки;
- не маскуй `FAIL` і не замінюй його успішним результатом;
- не оголошуй увесь сценарій успішним без фінального вердикту `PASS` від `check`.

Якщо `check` повертає `FAIL`, фінальний вердикт сценарію також має бути `FAIL`.

## Фінальний звіт

Після завершення сформуй таблицю:

| Крок | Статус | Створені файли |
|---|---|---|
| `git-init` | PASS/FAIL | перелік фактично створених або підготовлених файлів |
| `create-project` | PASS/FAIL | перелік фактично створених файлів |
| `create-build` | PASS/FAIL | перелік конфігурацій, скриптів і тестів |
| `create-actions` | PASS/FAIL | `.github/workflows/ci.yml` |
| `check` | PASS/FAIL | результат фінальної перевірки |

Додай вердикт, отриманий від `check`. Загальний вердикт `PASS` можливий лише тоді, коли всі кроки успішні, а `check` повернув `PASS`.

## Ідемпотентність

Повторний запуск не повинен руйнувати вже створений проєкт або дублювати конфігурації. Кожна команда має виконуватися відповідно до власних правил ідемпотентності: зберігати наявні файли, не дублювати налаштування та безпечно доповнювати лише відсутні елементи.

## Заборонено

- видаляти файли;
- автоматично створювати коміти;
- виконувати `git push`;
- виконувати `git reset --hard`;
- змінювати захист гілок;
- працювати із секретами або токенами.
