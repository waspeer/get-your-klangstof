import fs from 'fs';
import Handlebars from 'handlebars';

export function createFactoryFromFile<T extends Record<string, any>>(path: string) {
  const template = fs.readFileSync(path, 'utf-8');

  return Handlebars.compile<T>(template);
}
