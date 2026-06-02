import { readFileSync } from 'fs';
import { join } from 'path';

export const loadSafetyWords = () => {
  const filePath = join(
    process.cwd(),
    'src/db/seed/safety-words.json',
  );

  const jsonData = readFileSync(filePath, 'utf-8');

  return JSON.parse(jsonData);
};