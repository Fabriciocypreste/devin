#!/usr/bin/env node

/**
 * Download Assets Script
 * 
 * This script downloads images from TMDB CDN and saves them locally
 * to make the app work offline and load faster.
 * 
 * Usage: node scripts/download-assets.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vsztquvvnwlxdwyeoffh.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'poster');

// Stats
let stats = {
  total: 0,
  downloaded: 0,
  skipped: 0,
  failed: 0
};

/**
 * Ensure output directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

/**
 * Download a single file
 */
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    // Check if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Skipped (already exists): ${path.basename(filepath)}`);
      stats.skipped++;
      resolve(true);
      return;
    }

    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          stats.downloaded++;
          resolve(true);
        });
      } else {
        fs.unlink(filepath, () => {});
        console.error(`❌ Failed (${response.statusCode}): ${url}`);
        stats.failed++;
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      console.error(`❌ Error downloading ${url}:`, err.message);
      stats.failed++;
      reject(err);
    });
  });
}

/**
 * Fetch content from Supabase
 */
async function fetchContent() {
  console.log('📡 Fetching content from Supabase...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/content?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.length} items from database`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching content:', error);
    return [];
  }
}

/**
 * Update database with local paths
 */
async function updateDatabase(id, localPosterPath, localBackdropPath) {
  try {
    const updates = {};
    if (localPosterPath) updates.local_poster_path = localPosterPath;
    if (localBackdropPath) updates.local_backdrop_path = localBackdropPath;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/content?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      console.warn(`⚠️  Failed to update database for ID ${id}`);
    }
  } catch (error) {
    console.error(`❌ Error updating database for ID ${id}:`, error.message);
  }
}

/**
 * Process a single content item
 */
async function processItem(item) {
  const downloads = [];
  let localPosterPath = null;
  let localBackdropPath = null;

  // Download poster
  if (item.poster_path) {
    const posterUrl = item.poster_path.startsWith('http') 
      ? item.poster_path 
      : `${TMDB_IMAGE_BASE}${item.poster_path}`;
    
    const posterFilename = `${item.id}_poster${path.extname(item.poster_path || '.jpg')}`;
    const posterPath = path.join(OUTPUT_DIR, posterFilename);
    
    downloads.push(
      downloadFile(posterUrl, posterPath)
        .then(() => {
          localPosterPath = `/poster/${posterFilename}`;
        })
        .catch(() => {})
    );
  }

  // Download backdrop
  if (item.backdrop_path) {
    const backdropUrl = item.backdrop_path.startsWith('http')
      ? item.backdrop_path
      : `${TMDB_IMAGE_BASE}${item.backdrop_path}`;
    
    const backdropFilename = `${item.id}_backdrop${path.extname(item.backdrop_path || '.jpg')}`;
    const backdropPath = path.join(OUTPUT_DIR, backdropFilename);
    
    downloads.push(
      downloadFile(backdropUrl, backdropPath)
        .then(() => {
          localBackdropPath = `/poster/${backdropFilename}`;
        })
        .catch(() => {})
    );
  }

  // Wait for all downloads to complete
  await Promise.allSettled(downloads);

  // Update database if any downloads succeeded
  if (localPosterPath || localBackdropPath) {
    await updateDatabase(item.id, localPosterPath, localBackdropPath);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🖼️  RedFlix Asset Downloader');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log();

  // Check for required environment variables
  if (!SUPABASE_ANON_KEY) {
    console.error('❌ VITE_SUPABASE_ANON_KEY environment variable is required');
    console.error('   Set it in your .env file');
    process.exit(1);
  }

  // Ensure output directory exists
  ensureDir(OUTPUT_DIR);

  // Fetch content
  const content = await fetchContent();
  
  if (content.length === 0) {
    console.log('⚠️  No content found in database');
    return;
  }

  stats.total = content.length;

  console.log();
  console.log('📥 Starting downloads...');
  console.log();

  // Process items with concurrency limit
  const BATCH_SIZE = 5;
  for (let i = 0; i < content.length; i += BATCH_SIZE) {
    const batch = content.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(item => processItem(item)));
    
    // Progress update
    const progress = Math.min(i + BATCH_SIZE, content.length);
    console.log(`\n📊 Progress: ${progress}/${content.length} (${Math.round(progress / content.length * 100)}%)\n`);
  }

  // Print summary
  console.log();
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Total items:      ${stats.total}`);
  console.log(`Downloaded:       ${stats.downloaded}`);
  console.log(`Skipped:          ${stats.skipped}`);
  console.log(`Failed:           ${stats.failed}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log();
  console.log('✅ Asset download complete!');
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
