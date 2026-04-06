## Plan de Internacionalización

### Fase A — Infraestructura i18n
1. Reescribir `src/i18n/types.ts` con todas las claves necesarias para las páginas actuales (Home, About, Contact, Terms, Privacy, Cookies, Help, VisaDetail, Header, Footer)
2. Actualizar `src/i18n/index.ts` para integrar el selector de idioma con rutas (`/en/`, `/es/`, `/fr/`, `/de/`, `/it/`)
3. Añadir selector de idioma al Header

### Fase B — Archivos de traducción
4. Crear los 5 archivos de idioma (es.ts, en.ts, fr.ts, it.ts, de.ts) con TODAS las traducciones

### Fase C — Adaptar páginas
5. Actualizar todas las páginas para usar `useTranslations()` en lugar de texto hardcoded:
   - Header.tsx, Footer.tsx
   - Index.tsx (Home)
   - About.tsx, Contact.tsx
   - Terms.tsx, Privacy.tsx, Cookies.tsx
   - Help.tsx
   - VisaDetail.tsx
6. Actualizar App.tsx con rutas prefijadas por idioma

### Resultado
- Español como idioma por defecto (sin prefijo)
- Resto de idiomas con prefijo: `/en/`, `/fr/`, `/de/`, `/it/`
- Selector de idioma con banderas en el Header
