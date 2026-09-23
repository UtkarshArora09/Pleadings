import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const possiblePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe',
];

let browserPath = null;
for (const p of possiblePaths) {
  if (p && fs.existsSync(p)) {
    browserPath = p;
    break;
  }
}

console.log('Browser path detected:', browserPath);
