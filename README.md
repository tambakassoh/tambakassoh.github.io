# tambakassoh.github.io

Home page listing all study-lab courses. Published at https://tambakassoh.github.io/

To add a course, open `index.html` and add one line to the `COURSES` list with the course's repository name.

## App (installable web app)
- `manifest.webmanifest` – app name, colors (SUNY Cortland red #B00B00) and icons
- `sw.js` – service worker: makes the site installable and keeps visited labs available offline
- `icons/` – app icons (open book)

When you change the service worker, raise `VERSION` in `sw.js` (e.g. `study-labs-v2`) so phones replace their old saved copy.
