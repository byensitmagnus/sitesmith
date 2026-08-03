import { defineConfig } from 'astro/config';

// Ingen adapter, ingen integrationer, ingen islands. Siden er statisk og prisen regnes
// i browseren, så der er ikke noget at koble på. Stylesheetet holdes som en rigtig fil
// og lægges aldrig inline, så tokens findes ét sted hele vejen igennem buildet.
export default defineConfig({
  build: { inlineStylesheets: 'never' },
  // Dev-værktøjslinjen lægger sin egen knap ind i DOM'en, og så måler verify og gate
  // på en side der ikke er den der udgives.
  devToolbar: { enabled: false },
});
