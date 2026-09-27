// Génère les textures du site (tuiles PNG raccordables), sans image externe.
//   node scripts/generate-textures.mjs
// - public/textures/kraft.png : fibres et points du papier kraft (alpha, posé sur la couleur kraft)
// - public/textures/ink.png   : grain d'encre irrégulier, utilisé en masque pour les tampons
import sharp from "sharp";
import fs from "node:fs/promises";

await fs.mkdir("public/textures", { recursive: true });

function rng(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

async function kraft() {
  const S = 256;
  const px = new Float32Array(S * S * 2); // [darkAlpha, lightAlpha]
  const r = rng(11);
  const plot = (x, y, dark, a) => {
    const i = (((y % S) + S) % S) * S + (((x % S) + S) % S);
    px[i * 2 + (dark ? 0 : 1)] = Math.min(1, px[i * 2 + (dark ? 0 : 1)] + a);
  };
  // Pas de marbrure : sur une tuile de 256 px, elle se répète en motif visible.
  // Fibres : segments courts, légèrement courbes, majoritairement horizontaux (sens machine)
  for (let n = 0; n < 240; n++) {
    let x = r() * S, y = r() * S;
    const len = 5 + r() * 18;
    let ang = (r() - 0.5) * 0.7;
    const dark = r() < 0.55;
    const a = 0.05 + r() * 0.13;
    for (let t = 0; t < len; t++) {
      plot(Math.round(x), Math.round(y), dark, a);
      x += Math.cos(ang);
      y += Math.sin(ang);
      ang += (r() - 0.5) * 0.25;
    }
  }
  // Points (impuretés du papier recyclé)
  for (let n = 0; n < 700; n++) plot(Math.floor(r() * S), Math.floor(r() * S), r() < 0.7, 0.06 + r() * 0.22);

  const out = Buffer.alloc(S * S * 4);
  for (let i = 0; i < S * S; i++) {
    const d = px[i * 2], l = px[i * 2 + 1];
    if (d >= l) { out[i * 4] = 92; out[i * 4 + 1] = 62; out[i * 4 + 2] = 30; out[i * 4 + 3] = Math.round(d * 255); }
    else { out[i * 4] = 238; out[i * 4 + 1] = 214; out[i * 4 + 2] = 170; out[i * 4 + 3] = Math.round(l * 200); }
  }
  const info = await sharp(out, { raw: { width: S, height: S, channels: 4 } })
    .png({ compressionLevel: 9, palette: true, colors: 128, dither: 0.6 })
    .toFile("public/textures/kraft.png");
  console.log("kraft.png", info.size, "octets");
}

async function ink() {
  // Masque d'encre : blanc = encre présente, trous irréguliers = manque d'encre du tampon
  const S = 192;
  const out = Buffer.alloc(S * S * 4, 255);
  const r = rng(29);
  for (let n = 0; n < 2600; n++) {
    const cx = r() * S, cy = r() * S, rad = 0.4 + Math.pow(r(), 3) * 3.2;
    for (let y = Math.floor(cy - rad); y <= cy + rad; y++)
      for (let x = Math.floor(cx - rad); x <= cx + rad; x++) {
        if ((x - cx) ** 2 + (y - cy) ** 2 > rad * rad) continue;
        const i = (((y % S) + S) % S) * S + (((x % S) + S) % S);
        out[i * 4 + 3] = Math.min(out[i * 4 + 3], Math.round(60 + r() * 90));
      }
  }
  const info = await sharp(out, { raw: { width: S, height: S, channels: 4 } })
    .png({ compressionLevel: 9, palette: true, colors: 16 })
    .toFile("public/textures/ink.png");
  console.log("ink.png", info.size, "octets");
}

await kraft();
await ink();
