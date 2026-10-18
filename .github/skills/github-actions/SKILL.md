---
name: github-actions
description: "Застосовуйте для створення кросплатформного GitHub Actions workflow для JavaScript-проєкту з перевіркою через ci.sh і ci.bat на Ubuntu, Windows і macOS."
---

# Призначення і коли застосовувати

Цей Skill призначений для налаштування GitHub Actions workflow для JavaScript-проєкту Hello World. Застосовуй його, коли потрібно перевіряти складання і тести на Ubuntu, Windows та macOS через наявні кросплатформні CI-скрипти.

## Входи

Skill очікує, що в корені проєкту вже існують:

- `ci.sh`;
- `ci.bat`.

Ці файли створює Skill `build-and-test`. Під час запуску цього Skill перевір їх наявність. Якщо `ci.sh` або `ci.bat` відсутній, зупинись і повідом, що спочатку потрібно виконати команду `create-build`.

## Виходи

Підготуй файл `.github/workflows/ci.yml` з такими властивостями:

- тригери `push` і `pull_request` лише для гілок `develop` і `main`;
- одна job із `strategy.matrix.os`, що містить:
  - `ubuntu-latest`;
  - `windows-latest`;
  - `macos-latest`;
- крок `actions/checkout`;
- крок `actions/setup-node` із Node LTS;
- запуск `bash ci.sh` на Linux і macOS;
- запуск `ci.bat` на Windows;
- умови запуску скриптів через `runner.os`;
- крок `actions/upload-artifact` із каталогом `dist/`;
- ім’я артефакту має містити операційну систему, наприклад `${{ matrix.os }}`;
- мінімальні дозволи `permissions: contents: read`;
- відсутність секретів і токенів.

Workflow має містити лише orchestration CI. Уся логіка складання і тестування повинна залишатися в `ci.sh` та `ci.bat`; у `ci.yml` не можна додавати прямі команди `npm`.

## Ідемпотентність

Перед змінами перевір, чи існує `.github/workflows/ci.yml`. Якщо файл уже існує:

- збережи його коректний наявний вміст;
- доповнюй лише відсутні необхідні тригери, matrix, кроки або дозволи;
- не дублюй job, matrix, тригери, checkout, setup-node, запуск CI-скриптів чи upload-artifact;
- не перезаписуй файл без потреби;
- якщо безпечне доповнення неможливе, зупинись і повідом точну причину.

Якщо каталоги `.github/` або `.github/workflows/` відсутні, створи лише їх як батьківські каталоги для `ci.yml`.

## Перевірки

Після підготовки перевір:

1. `ci.yml` є валідним YAML;
2. workflow має тригери `push` і `pull_request` для `develop` і `main`;
3. є одна job із matrix, що містить `ubuntu-latest`, `windows-latest` і `macos-latest`;
4. присутні `actions/checkout`, `actions/setup-node` і `actions/upload-artifact`;
5. Linux/macOS запускають `bash ci.sh`, а Windows запускає `ci.bat` через умову `runner.os`;
6. workflow завантажує каталог `dist/`, а ім’я артефакту містить ОС;
7. у workflow немає рядків або команд із `npm`;
8. у workflow немає секретів, токенів або зайвих дозволів;
9. `ci.sh` і `ci.bat` існують перед запуском workflow.

## Типовий сценарій помилки і реакція

Якщо відсутній `ci.sh` або `ci.bat`, негайно зупинись і повідом, що спочатку потрібно виконати `create-build`. Не створюй CI-скрипти в межах цього Skill.

Якщо `ci.yml` має невалідний YAML, помилкові умови або неповний matrix, зупинись, покажи точну причину та виправ лише workflow. Не оголошуй перевірку успішною, доки YAML і структура workflow не пройшли перевірки.

Якщо знайдено прямі `npm`-команди, секрети, токени або зайві дозволи, зупинись і повідом про порушення. Не маскуй помилку і не додавай обхідних рішень.

## Приклад входу та очікуваного результату

**Вхід:**

```text
У корені проєкту є ci.sh і ci.bat.
Дія: налаштувати GitHub Actions для Ubuntu, Windows і macOS.
```

**Очікуваний результат:**

```text
.github/workflows/ci.yml
```

Workflow має одну job із matrix для трьох ОС, запускає відповідний `ci.sh` або `ci.bat`, завантажує `dist/` як артефакт із назвою, що містить ОС, і не містить прямих npm-команд, секретів чи токенів.
