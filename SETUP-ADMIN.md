# Panel de contenido — `/admin`

Editás todo el contenido del sitio desde **`https://arquitectura-gr.vercel.app/admin.html`**
(textos, servicios, método, proyectos, fotos, datos de contacto).
Al tocar **Publicar cambios**, una función en Vercel guarda todo en GitHub y el
sitio se actualiza solo en ~1 minuto.

---

## Configuración inicial (una sola vez, ~5 min)

Hay que cargar 4 variables en Vercel. **Sin esto, el panel no puede publicar.**

### 1. Crear un token de GitHub

1. Entrá a <https://github.com/settings/personal-access-tokens/new> (Fine-grained token).
2. **Token name:** `panel-arquitectura-gr`
3. **Expiration:** 1 año (o "No expiration").
4. **Repository access** → *Only select repositories* → elegí **`ArquitecturaGR`**.
5. **Permissions** → *Repository permissions* → **Contents** → **Read and write**.
6. *Generate token* y **copiá el token** (empieza con `github_pat_...`). No se vuelve a mostrar.

### 2. Cargar las variables en Vercel

1. Entrá a <https://vercel.com/joaquin-hozs-projects/arquitectura-gr/settings/environment-variables>
2. Agregá estas 4 (Environment: **Production, Preview y Development** en todas):

   | Name | Value |
   |------|-------|
   | `ADMIN_PASSWORD` | la contraseña del panel (elegí una fuerte; podés usar `123456` pero **no es recomendable**) |
   | `GITHUB_TOKEN` | el token del paso 1 (`github_pat_...`) |
   | `GITHUB_REPO` | `joaquinnhoz1/ArquitecturaGR` |
   | `GITHUB_BRANCH` | `main` |

3. Después de guardar, andá a **Deployments** → último deploy → **⋯ → Redeploy**
   (las variables nuevas se aplican en el próximo deploy).

### 3. Listo

Entrá a `https://arquitectura-gr.vercel.app/admin.html`, poné la contraseña
(`ADMIN_PASSWORD`) y ya podés editar.

---

## Cómo funciona / notas

- **Seguridad:** la contraseña se valida en el servidor (variable `ADMIN_PASSWORD`),
  no queda en el código del sitio. El token de GitHub tampoco: vive sólo en Vercel.
  Aun así, **poné una contraseña que no sea `123456`** — quien la tenga puede editar el sitio.
- **Publicar:** cada vez que publicás se hace un commit en el repo
  (`content: actualización desde el panel /admin`). Podés ver el historial en GitHub
  y revertir cualquier cambio.
- **Imágenes:** se redimensionan y comprimen solas en el navegador antes de subir
  (webp). Se guardan en `uploads/portfolio/`.
- **Proyectos sin fotos:** dejalos como *ocultos* (checkbox "Visible en el sitio")
  hasta que tengas las imágenes.
- **Textos con formato:** en los títulos podés usar `<em>palabra</em>` para cursiva
  y `<br>` para saltos de línea.
- **`content.json`** es el archivo donde vive todo el contenido editable. `data.js`
  quedó sólo como respaldo por si `content.json` no cargara.

## Si algo falla al publicar

| Mensaje | Causa |
|---------|-------|
| "Contraseña incorrecta" | `ADMIN_PASSWORD` no coincide (¿redeployaste después de cargarla?) |
| "Falta GITHUB_TOKEN o GITHUB_REPO" | faltan variables en Vercel |
| "GitHub 401 / 403" | el token venció o no tiene permiso *Contents: Read and write* sobre `ArquitecturaGR` |
| "GitHub 409" | hubo otro commit al mismo tiempo; volvé a publicar |
