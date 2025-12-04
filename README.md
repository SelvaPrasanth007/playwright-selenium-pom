# Playwright + Selenium POM Example

This repository contains two small example test projects demonstrating the Page Object Model (POM):

- `playwright/` — Playwright (TypeScript) with a `HomePage` POM and a sample test.
- `selenium/` — Selenium (Python) with a `HomePage` POM and a sample pytest test.

Quick start
-----------

Playwright (TypeScript)

1. Open a terminal and change to the Playwright folder:

```bash
cd ~/Desktop/playwright-selenium-pom/playwright
```

2. Install dependencies and run tests:

```bash
npm install
npx playwright install
npm test
```

Selenium (Python)

1. Create a virtualenv and install requirements:

```bash
cd ~/Desktop/playwright-selenium-pom/selenium
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Run the pytest tests (the Chrome driver will be downloaded by `webdriver-manager`):

```bash
pytest
```

Notes
-----
- Playwright tests use `@playwright/test` and are written in TypeScript. The POM is in `playwright/src/pages`.
- Selenium tests use `selenium` + `webdriver-manager` to simplify driver management. The POM is in `selenium/pom`.

If you want, I can run the tests here (if Node/Python and browsers are available) or commit this scaffold into a git repo on your machine. Which would you like next?
