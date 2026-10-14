#!/usr/bin/env node
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`Agentic Video Studio

Usage: npx --yes github:pagalvin/agentic-video-studio [Studio options]

Opens the Agentic Software Development video in Remotion Studio.
Press Play in the browser to watch. Press Ctrl+C here to stop.

Options:
  --port=3000  Choose the local preview port
  --no-open    Print the URL without opening a browser
  --help       Show this message

Requires Node.js 22.12.0+ and internet access for the first installation.`);
} else {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const require = createRequire(import.meta.url);
  const cli = path.join(path.dirname(require.resolve('@remotion/cli/package.json')), 'remotion-cli.js');

  // npx runs from the caller's directory, not the downloaded package.
  process.chdir(root);
  process.argv = [process.execPath, cli, 'studio', 'src/index.ts', ...args];
  console.log('Opening the video preview. Press Play in Studio; Ctrl+C stops the server.');
  await import(pathToFileURL(cli).href);
}
