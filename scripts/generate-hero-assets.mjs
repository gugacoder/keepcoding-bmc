#!/usr/bin/env node
/**
 * generate-hero-assets.mjs
 * Generates hero images for KeepBiz and KeepSolo landing pages using DALL-E 3.
 * Saves PNGs to mocks/{app}/public/images/
 *
 * Usage: node scripts/generate-hero-assets.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const OPENAI_API_KEY =
  process.env.OPENAI_API_KEY ||
  'REDACTED_OPENAI_KEY';

const HEROES = [
  {
    filename: 'hero-keepbiz.png',
    dest: path.join(ROOT, 'mocks/keep-biz/public/images/hero-keepbiz.png'),
    size: '1792x1024',
    quality: 'hd',
    prompt:
      'A modern corporate office environment with a diverse team of professionals collaborating at sleek workstations. Translucent holographic AI agents represented as blue-glowing geometric digital assistants float beside computer screens, seamlessly integrated into the workflow. The space is open-plan with floor-to-ceiling windows showing a city skyline. Cool blue and silver-gray tones throughout. Wide landscape composition, photorealistic with subtle futuristic elements. No text, signs, or readable characters anywhere in the image.',
  },
  {
    filename: 'hero-keepsolo.png',
    dest: path.join(ROOT, 'mocks/keep-solo/public/images/hero-keepsolo.png'),
    size: '1792x1024',
    quality: 'hd',
    prompt:
      'A confident solo entrepreneur working from a bright, warm home office with a laptop on a wooden desk. Around them, friendly AI assistants represented as warm amber-glowing orbs and gentle light particles are autonomously handling tasks — some near a phone, others near a planner. The atmosphere is empowering and optimistic, with natural warm light streaming through windows. Warm color palette with amber, orange, and golden tones. Wide landscape composition, photorealistic. No text, signs, or readable characters anywhere in the image.',
  },
];

async function generateImage(prompt, size, quality) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size,
      quality,
      response_format: 'url',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

async function downloadToFile(url, destPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

async function main() {
  console.log('🎨 KeepCoding BMC — Hero Assets Generator (DALL-E 3 HD)');
  console.log('==========================================================\n');

  let allOk = true;

  for (const hero of HEROES) {
    console.log(`→ Generating ${hero.filename} (${hero.size}, quality=${hero.quality})...`);
    try {
      const url = await generateImage(hero.prompt, hero.size, hero.quality);
      console.log(`  ✓ Image generated. Downloading...`);
      const bytes = await downloadToFile(url, hero.dest);
      console.log(`  ✓ Saved to ${hero.dest} (${(bytes / 1024).toFixed(0)} KB)\n`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}\n`);
      allOk = false;
    }
  }

  if (allOk) {
    console.log('✅ All hero assets generated successfully!');
  } else {
    console.log('⚠️  Some assets failed. Landing pages will use CSS gradient fallback.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
