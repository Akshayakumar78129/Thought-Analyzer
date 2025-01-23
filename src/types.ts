export interface ThoughtProcess {
  id: number;
  name: string;
}

export interface SubThought {
  id: number;
  name: string;
}

export interface ConversationMode {
  id: number;
  name: string;
}

export interface Iteration {
  id: number;
  subThought: SubThought;
  mode: ConversationMode;
}

export interface AnalysisStep {
  thought: ThoughtProcess | null;
  iterations: Iteration[];
}

export interface LogEntry {
  message: string;
  nodeType: string;
  iterationId?: number;
  timestamp: string;
  onComplete?: () => void;
} 