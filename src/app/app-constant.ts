export const NODE_ENVS = [
  'production',
  'staging',
  'development',
  'test',
  'local',
] as const;
export type NodeEnv = (typeof NODE_ENVS)[number];
