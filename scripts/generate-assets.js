#!/usr/bin/env node
/**
 * generate-assets.js
 * Generates visual assets (thumbnails + agent avatars) using OpenAI DALL-E API.
 * Saves to public/assets/ in both KeepBiz and KeepSolo apps.
 *
 * Usage: node scripts/generate-assets.js
 * Requires: OPENAI_API_KEY env var or hardcoded key below
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY not set. Add it to .env at the repo root.');
  process.exit(1);
}

const OUTPUT_DIRS = [
  path.join(__dirname, '../mocks/keep-biz/public/assets'),
  path.join(__dirname, '../mocks/keep-solo/public/assets'),
];

// ── Asset definitions ─────────────────────────────────────────────────────────

const THUMBNAILS = [
  {
    filename: 'thumbnail-verao.png',
    prompt:
      'Vibrant summer product launch social media post image, tropical beach setting, warm sunlight, colorful fashion items, professional marketing photography style, 4:3 ratio, clean composition with space for text overlay',
  },
  {
    filename: 'thumbnail-behind-the-scenes.png',
    prompt:
      'Behind the scenes office team working, candid authentic moment, modern startup workspace, warm natural lighting, people collaborating around a table, professional yet casual atmosphere, lifestyle photography',
  },
  {
    filename: 'thumbnail-black-friday.png',
    prompt:
      'Black Friday sale campaign banner image, bold dark background with golden and red accents, shopping bags and products, urgency and excitement visual design, commercial photography style, dramatic lighting',
  },
  {
    filename: 'thumbnail-produto.png',
    prompt:
      'Premium product Instagram advertisement, minimalist clean white background, luxury product photography, soft shadows, elegant composition, high-end brand aesthetic, commercial studio photography',
  },
];

const AVATARS = [
  {
    filename: 'avatar-invoice-hunter.png',
    prompt:
      'Professional AI agent avatar, financial analyst theme, blue and gold color scheme, abstract geometric face or robot with briefcase and financial charts motif, flat design style, circular composition',
  },
  {
    filename: 'avatar-lead-nurturer.png',
    prompt:
      'AI agent avatar representing a marketing specialist, friendly and approachable robot character, green and teal color palette, connections and network nodes in background, flat modern illustration style',
  },
  {
    filename: 'avatar-schedule-keeper.png',
    prompt:
      'AI agent avatar for scheduling and HR coordination, organized robot character holding a calendar, purple and lavender color scheme, clock and calendar motifs, clean flat illustration',
  },
  {
    filename: 'avatar-content-drafter.png',
    prompt:
      'AI agent avatar for content creation, creative robot with a pen or quill, orange and coral colors, writing and creativity motifs like stars and text bubbles, playful flat design',
  },
  {
    filename: 'avatar-generic.png',
    prompt:
      'Generic AI personal assistant avatar, friendly neutral robot face, blue gradient background, simple clean design, approachable expression, flat modern illustration, circular frame',
  },
];

// ── DALL-E API helpers ────────────────────────────────────────────────────────

async function generateImage(prompt, size = '1024x1024', model = 'dall-e-3') {
  const body = JSON.stringify({
    model,
    prompt,
    n: 1,
    size,
    response_format: 'url',
  });

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

async function downloadImage(url, destPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download image: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
}

function ensureDirs() {
  for (const dir of OUTPUT_DIRS) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function saveToAllApps(filename, buffer) {
  for (const dir of OUTPUT_DIRS) {
    fs.writeFileSync(path.join(dir, filename), buffer);
    console.log(`  ✓ Saved to ${path.join(dir, filename)}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🎨 KeepBiz/KeepSolo Asset Generator');
  console.log('=====================================\n');

  ensureDirs();

  // Generate thumbnails (DALL-E 3, 1024x1024)
  console.log('📸 Generating content thumbnails (DALL-E 3, 1024x1024)...\n');
  for (const thumb of THUMBNAILS) {
    console.log(`→ ${thumb.filename}`);
    try {
      const url = await generateImage(thumb.prompt, '1024x1024', 'dall-e-3');
      const response = await fetch(url);
      const buffer = Buffer.from(await response.arrayBuffer());
      saveToAllApps(thumb.filename, buffer);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
    // Small delay to respect rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log('\n🤖 Generating agent avatars (DALL-E 3, 1024x1024)...\n');
  for (const avatar of AVATARS) {
    console.log(`→ ${avatar.filename}`);
    try {
      // DALL-E 3 only supports 1024x1024 — generate at 1024 and use CSS to display at 512
      const url = await generateImage(avatar.prompt, '1024x1024', 'dall-e-3');
      const response = await fetch(url);
      const buffer = Buffer.from(await response.arrayBuffer());
      saveToAllApps(avatar.filename, buffer);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log('\n✅ Asset generation complete!');
  console.log('Assets saved to:');
  for (const dir of OUTPUT_DIRS) {
    console.log(`  ${dir}`);
  }
  console.log('\nGenerated files:');
  const allFiles = [...THUMBNAILS.map((t) => t.filename), ...AVATARS.map((a) => a.filename)];
  allFiles.forEach((f) => console.log(`  - ${f}`));
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
