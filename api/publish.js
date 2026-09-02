/* ===========================================================================
   /api/publish — función serverless (Vercel)
   ---------------------------------------------------------------------------
   Guarda los cambios del panel /admin commiteándolos al repo de GitHub.
   Vercel detecta el push y redepliega el sitio (~1 min).

   Variables de entorno necesarias (Vercel → Project → Settings → Environment
   Variables):
     ADMIN_PASSWORD   contraseña del panel
     GITHUB_TOKEN     Personal Access Token con permiso de escritura al repo
     GITHUB_REPO      "joaquinnhoz1/ArquitecturaGR"
     GITHUB_BRANCH    "main"   (opcional, default main)
   =========================================================================== */

const GH_API = "https://api.github.com";

function json(res, status, body) {
  res.status(status).setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
}

async function gh(path, token, opts = {}) {
  const r = await fetch(GH_API + path, {
    ...opts,
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/vnd.github+json",
      "User-Agent": "estudio-gr-admin",
      ...(opts.headers || {}),
    },
  });
  const text = await r.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!r.ok) {
    const msg = (data && data.message) || r.statusText;
    throw new Error("GitHub " + r.status + ": " + msg);
  }
  return data;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const BRANCH = process.env.GITHUB_BRANCH || "main";

  if (!ADMIN_PASSWORD) return json(res, 500, { error: "Falta ADMIN_PASSWORD en el servidor." });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // pequeño retardo anti fuerza bruta
  await new Promise((r) => setTimeout(r, 350));

  if (!body.password || body.password !== ADMIN_PASSWORD) {
    return json(res, 401, { error: "Contraseña incorrecta." });
  }

  // Sólo verificar la contraseña (pantalla de login)
  if (body.action === "login") return json(res, 200, { ok: true });

  if (body.action !== "publish") return json(res, 400, { error: "Acción desconocida." });
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return json(res, 500, { error: "Falta GITHUB_TOKEN o GITHUB_REPO en el servidor." });
  }

  const content = body.content;
  const images = Array.isArray(body.images) ? body.images : [];
  if (!content || typeof content !== "object") {
    return json(res, 400, { error: "Contenido inválido." });
  }

  // límite defensivo de payload (~9 MB de imágenes por publicación)
  const totalBytes = images.reduce((n, im) => n + (im.dataBase64 ? im.dataBase64.length : 0), 0);
  if (totalBytes > 12 * 1024 * 1024) {
    return json(res, 413, { error: "Demasiadas imágenes en una sola publicación. Publicá por partes." });
  }

  try {
    const files = [];

    // content.json
    files.push({
      path: "content.json",
      contentBase64: Buffer.from(JSON.stringify(content, null, 2) + "\n", "utf8").toString("base64"),
    });

    // imágenes nuevas
    for (const im of images) {
      if (!im || !im.path || !im.dataBase64) continue;
      if (!/^(uploads)\/[A-Za-z0-9/_.-]+\.(webp|png|jpg|jpeg)$/.test(im.path)) {
        return json(res, 400, { error: "Ruta de imagen inválida: " + im.path });
      }
      files.push({ path: im.path, contentBase64: im.dataBase64 });
    }

    // --- commit atómico vía Git Data API -------------------------------
    const ref = await gh(`/repos/${GITHUB_REPO}/git/ref/heads/${BRANCH}`, GITHUB_TOKEN);
    const baseCommitSha = ref.object.sha;
    const baseCommit = await gh(`/repos/${GITHUB_REPO}/git/commits/${baseCommitSha}`, GITHUB_TOKEN);
    const baseTreeSha = baseCommit.tree.sha;

    const treeItems = [];
    for (const f of files) {
      const blob = await gh(`/repos/${GITHUB_REPO}/git/blobs`, GITHUB_TOKEN, {
        method: "POST",
        body: JSON.stringify({ content: f.contentBase64, encoding: "base64" }),
      });
      treeItems.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
    }

    const newTree = await gh(`/repos/${GITHUB_REPO}/git/trees`, GITHUB_TOKEN, {
      method: "POST",
      body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
    });

    const msg =
      "content: actualización desde el panel /admin (" +
      new Date().toISOString().slice(0, 16).replace("T", " ") +
      ")";
    const newCommit = await gh(`/repos/${GITHUB_REPO}/git/commits`, GITHUB_TOKEN, {
      method: "POST",
      body: JSON.stringify({ message: msg, tree: newTree.sha, parents: [baseCommitSha] }),
    });

    await gh(`/repos/${GITHUB_REPO}/git/refs/heads/${BRANCH}`, GITHUB_TOKEN, {
      method: "PATCH",
      body: JSON.stringify({ sha: newCommit.sha, force: false }),
    });

    return json(res, 200, {
      ok: true,
      commit: newCommit.sha.slice(0, 7),
      files: files.map((f) => f.path),
    });
  } catch (e) {
    return json(res, 502, { error: String(e.message || e) });
  }
};
