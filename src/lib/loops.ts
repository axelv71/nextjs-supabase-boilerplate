import { LoopsClient } from 'loops';
import { config } from '@/config';

export const loops = new LoopsClient(config.env.loops.key);
