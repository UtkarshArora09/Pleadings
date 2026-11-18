import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const loaderCode = `
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = ${JSON.stringify(process.cwd())};

function tryResolve(basePath) {
  const candidates = [
    basePath,
    basePath + '.ts',
    basePath + '.tsx',
    basePath + '.js',
    basePath + '.mjs',
    basePath + '.json',
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) {
      return pathToFileURL(c).href;
    }
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/headers' || specifier === 'next/server') {
    const resolved = tryResolve(path.join(root, 'node_modules', specifier));
    if (resolved) return { url: resolved, shortCircuit: true };
  }
  if (specifier.startsWith('@/content/')) {
    const resolved = tryResolve(path.join(root, 'content', specifier.slice('@/content/'.length)));
    if (resolved) return { url: resolved, shortCircuit: true };
  }
  if (specifier.startsWith('@/')) {
    const resolved = tryResolve(path.join(root, 'src', specifier.slice(2)));
    if (resolved) return { url: resolved, shortCircuit: true };
  }
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.startsWith('file:')) {
    const parentDir = path.dirname(fileURLToPath(context.parentURL));
    const resolved = tryResolve(path.resolve(parentDir, specifier));
    if (resolved) return { url: resolved, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
`;

register(`data:text/javascript;base64,${Buffer.from(loaderCode, 'utf8').toString('base64')}`, pathToFileURL(path.resolve('./')));
