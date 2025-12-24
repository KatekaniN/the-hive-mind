
export type BeeType = 'frontend' | 'backend' | 'logic' | 'debug' | 'growth' | 'collab';

export interface Bee {
  id: string;
  type: BeeType;
  label: string;
  description: string;
  personality: string;
}

export interface NodeItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  tags: string[];
  x: number;
  y: number;
  color: string;
  type: 'project' | 'philosophy' | 'goal' | 'experiment';
  projectLink?: string;
  githubLink?: string;
}

export interface AppState {
  selectedNodeId: string | null;
  isMenuOpen: boolean;
  activeBeeType: BeeType | null;
}
