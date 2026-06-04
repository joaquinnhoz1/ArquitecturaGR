/* ===========================================================================
   ESTUDIO GR — Tweaks
   Aplica paleta, tipografía, variantes de hero/galería y movimiento al sitio.
   El sitio principal es vanilla; acá sólo escribimos atributos y variables CSS
   en :root y el resto del CSS reacciona.
   =========================================================================== */
const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakSlider, TweakToggle } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "arena",
  "titleFont": "cormorant",
  "hero": "inferior",
  "folio": "grid",
  "doors": true,
  "motion": 7
}/*EDITMODE-END*/;

const GR_PALETTES = [
  { name: "arena",     cols: ["#b07b54", "#e4d9c1", "#1d1b16"] },
  { name: "editorial", cols: ["#6b705c", "#e6e6e3", "#16160f"] },
  { name: "salvia",    cols: ["#5d6b4a", "#dfe4d4", "#1c2118"] },
];
const PALETTE_LABEL = { arena: "Arena (cálida)", editorial: "Editorial (gris/olivo)", salvia: "Salvia (verde)" };

const FONT_STACK = {
  cormorant: '"Cormorant Garamond", Georgia, serif',
  playfair: '"Playfair Display", Georgia, serif',
};

function applyTweaks(t) {
  const root = document.documentElement;
  root.dataset.palette = t.palette;
  root.dataset.display = t.titleFont;
  root.style.setProperty("--font-display", FONT_STACK[t.titleFont] || FONT_STACK.cormorant);
  root.dataset.hero = t.hero;
  root.dataset.folio = t.folio;
  root.dataset.doors = t.doors ? "on" : "off";
  const m = 0.3 + (Number(t.motion) / 10) * 1.0; // 0.3 → 1.3
  root.style.setProperty("--motion", m.toFixed(3));
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => { applyTweaks(t); }, [t]);

  const curPalette = (GR_PALETTES.find((p) => p.name === t.palette) || GR_PALETTES[0]).cols;
  const onPalette = (cols) => {
    const found = GR_PALETTES.find((p) => JSON.stringify(p.cols) === JSON.stringify(cols));
    if (found) setTweak("palette", found.name);
  };

  return (
    <TweaksPanel title="Estudio GR — Tweaks">
      <TweakSection label="Paleta" />
      <TweakColor
        label={PALETTE_LABEL[t.palette] || "Paleta"}
        value={curPalette}
        options={GR_PALETTES.map((p) => p.cols)}
        onChange={onPalette}
      />

      <TweakSection label="Tipografía de títulos" />
      <TweakRadio
        label="Familia"
        value={t.titleFont}
        options={[{ value: "cormorant", label: "Cormorant" }, { value: "playfair", label: "Playfair" }]}
        onChange={(v) => setTweak("titleFont", v)}
      />

      <TweakSection label="Hero / Exterior" />
      <TweakRadio
        label="Composición"
        value={t.hero}
        options={[
          { value: "inferior", label: "Inferior" },
          { value: "centro", label: "Centro" },
          { value: "editorial", label: "Editorial" },
        ]}
        onChange={(v) => setTweak("hero", v)}
      />

      <TweakSection label="Portfolio" />
      <TweakRadio
        label="Galería"
        value={t.folio}
        options={[
          { value: "grid", label: "Grid" },
          { value: "completo", label: "Inmersivo" },
          { value: "editorial", label: "Editorial" },
        ]}
        onChange={(v) => setTweak("folio", v)}
      />

      <TweakSection label="Movimiento" />
      <TweakSlider
        label="Intensidad de scroll"
        value={t.motion}
        min={0}
        max={10}
        step={1}
        onChange={(v) => setTweak("motion", v)}
      />
      <TweakToggle
        label="Efecto de puertas al ingresar"
        value={t.doors}
        onChange={(v) => setTweak("doors", v)}
      />
    </TweaksPanel>
  );
}

// aplicar de inmediato (antes del primer render) para evitar parpadeo
applyTweaks(TWEAK_DEFAULTS);

const mount = document.createElement("div");
mount.id = "tweaks-root";
document.body.appendChild(mount);
ReactDOM.createRoot(mount).render(<App />);
