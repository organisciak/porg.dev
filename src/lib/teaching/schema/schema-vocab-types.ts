export interface VocabType {
  name: string;
  description: string;
  parents: string[];
  hierarchy: string[];
  children: string[];
  isPending: boolean;
  url: string;
}

export interface VocabProperty {
  name: string;
  description: string;
  domainTypes: string[];
  rangeTypes: string[];
  isPending: boolean;
  url: string;
}

export interface TypeProperty {
  name: string;
  description: string;
  rangeTypes: string[];
  inheritedFrom: string | null;
  url: string;
}

export interface ProcessedVocabulary {
  generatedAt: string;
  types: Record<string, VocabType>;
  properties: Record<string, VocabProperty>;
  domainIndex: Record<string, string[]>;
  dataTypes: string[];
}
