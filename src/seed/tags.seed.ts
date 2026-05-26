import { readFileSync } from 'fs';
import { join } from 'path';

export const loadTags = () => {
  const filePath = join(
    process.cwd(),
    'src/db/seed/tags.json',
  );

  const jsonData = readFileSync(filePath,'utf-8',);

  return JSON.parse(jsonData);
};