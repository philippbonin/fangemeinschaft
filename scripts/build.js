import { execSync } from 'child_process';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

// Generate timestamp in YYYYMMDDHHMMSS format
const timestamp = new Date().toISOString()
  .replace(/[-:T.Z]/g, '')
  .slice(0, 14);

// Set environment variable
process.env.BUILD_TIMESTAMP = timestamp;
console.log(`Building with timestamp: ${timestamp}`);

// Adjectives and nouns for fallback name generation
const adjectives = ['swift', 'bright', 'calm', 'wise', 'bold', 'brave', 'kind', 'pure', 'warm', 'cool'];
const nouns = ['star', 'moon', 'sun', 'wind', 'wave', 'leaf', 'tree', 'bird', 'lake', 'rose'];

function generateFallbackName() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}_${noun}`;
}

function getBuildNameSync() {
  try {
    // Use synchronous fallback for Docker builds
    return generateFallbackName();
  } catch (error) {
    console.warn('Using fallback build name');
    return generateFallbackName();
  }
}

async function saveBuildInfo(buildName) {
  const buildInfo = {
    timestamp,
    buildName,
    createdAt: new Date().toISOString()
  };

  // Save to dist/client directory
  const distClientDir = path.join(process.cwd(), 'dist', 'client');
  
  // Ensure directory exists
  await fs.mkdir(distClientDir, { recursive: true });
  
  // Write build info
  await fs.writeFile(
    path.join(distClientDir, 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  );

  console.log('Build info saved to dist/client/build-info.json');
}

// Main build process
async function build() {
  try {
    const buildName = getBuildNameSync();
    console.log(`Using build name: ${buildName}`);
    
    // Export build name for other processes
    process.env.BUILD_NAME = buildName;
    
    // Save build info
    await saveBuildInfo(buildName);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();