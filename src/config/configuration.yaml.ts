import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const DEFAULT_CONFIG = 'default.yaml';
const YAML_CONFIG = `${process.env.NODE_ENV}.yaml`;

export default () => {
  const defaultConfig = yaml.load(
    readFileSync(join(__dirname, DEFAULT_CONFIG), 'utf8'),
  ) as Record<string, any>;
  const environmentConfig = yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG), 'utf8'),
  ) as Record<string, any>;
  return { ...defaultConfig, ...environmentConfig, ...process.env };
};
