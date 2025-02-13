import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

function executeGitCommand(command) {
    return execSync(command).toString('utf8').trim();
}

const branch = executeGitCommand('git rev-parse --abbrev-ref HEAD');
const commit = executeGitCommand('git rev-parse --short=25 HEAD');

// Generate timestamp in YYYYMMDDHHMMSS format
const timestamp = new Date().toISOString()
  .replace(/[-:T.Z]/g, '')
  .slice(0, 14);

// Set environment variable
process.env.BUILD_TIMESTAMP = timestamp;

// Adjectives and nouns for fallback name generation
const adjectives = ['swift', 'bright', 'calm', 'wise', 'bold', 'brave', 'kind', 'pure', 'warm', 'cool'];
const nouns = ['star', 'moon', 'sun', 'wind', 'wave', 'leaf', 'tree', 'bird', 'lake', 'rose'];

function generateFallbackName() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}_${noun}`;
}

async function getBuildName() {
  try {
    // Fetch both adjective and noun from API Ninjas
    const [adjResponse, nounResponse] = await Promise.all([
      fetch('https://api.api-ninjas.com/v1/randomword?type=adjective', {
        headers: {
          'X-Api-Key': 'eyRZ1Bo/gNuI/XW0QX7zuw==MSuNRz3TT908wovV'
        }
      }),
      fetch('https://api.api-ninjas.com/v1/randomword?type=noun', {
        headers: {
          'X-Api-Key': 'eyRZ1Bo/gNuI/XW0QX7zuw==MSuNRz3TT908wovV'
        }
      })
    ]);
    
    if (!adjResponse.ok || !nounResponse.ok) {
      throw new Error('Failed to fetch random words');
    }
    
    const [adjData, nounData] = await Promise.all([
      adjResponse.json(),
      nounResponse.json()
    ]);

    return `${adjData.word}_${nounData.word}`.toLowerCase();
  } catch (error) {
    console.warn('Failed to fetch build name from API, using fallback:', error);
    return generateFallbackName();
  }
}

async function saveBuildInfo(buildName) {
  const buildInfo = {
    timestamp,
    buildName,
    branch,
    commit,
    environment: "prod"
  };

  // Define output directory based on environment
  const outputDir = path.join(process.cwd());

  // Ensure directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Define file path
  const filePath = path.join(outputDir, 'build-info.json');

  try {
    // 🔹 Check if directory is writable
    try {
      await fs.access(outputDir, fs.constants.W_OK);
    } catch {
      throw new Error(`Directory is not writable: ${outputDir}`);
    }

    // 🔹 Write the file
    await fs.writeFile(filePath, JSON.stringify(buildInfo, null, 2));
    console.log(`Build info saved to ${filePath}`);
  } catch (error) {
    console.error("Error writing file:", error.message);
  }
}

async function build() {
  try {
    // Get build name
    const buildName = await getBuildName();
    console.log(`Using build name: ${buildName}`);
    
    // Save build info
    await saveBuildInfo(buildName);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
