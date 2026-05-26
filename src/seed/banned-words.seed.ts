import { readFileSync } from 'fs';
import { join } from 'path';

export const loadBannedWords = () => {
  const filePath = join(
    process.cwd(),
    'src/db/seed/banned-words.json',
  );

  const jsonData = readFileSync(filePath, 'utf-8');

  return JSON.parse(jsonData);
};