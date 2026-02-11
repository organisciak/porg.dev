import type { ProcessedVocabulary, VocabType, TypeProperty } from "./schema-vocab-types";
import vocabularyData from "$lib/generated/schema-vocabulary.json";

const vocab = vocabularyData as unknown as ProcessedVocabulary;

export function getType(name: string): VocabType | undefined {
  return vocab.types[name];
}

export function getTypeProperties(name: string): TypeProperty[] {
  const type = vocab.types[name];
  if (!type) return [];

  const props: TypeProperty[] = [];
  const seen = new Set<string>();

  // Walk hierarchy from the type itself up to Thing
  for (const ancestor of [...type.hierarchy].reverse()) {
    const propNames = vocab.domainIndex[ancestor] ?? [];
    for (const propName of propNames) {
      if (seen.has(propName)) continue;
      seen.add(propName);
      const prop = vocab.properties[propName];
      if (!prop) continue;
      props.push({
        name: propName,
        description: prop.description,
        rangeTypes: prop.rangeTypes,
        inheritedFrom: ancestor === name ? null : ancestor,
        url: prop.url,
      });
    }
  }

  // Sort: own properties first, then inherited, alphabetically within each group
  props.sort((a, b) => {
    if (a.inheritedFrom === null && b.inheritedFrom !== null) return -1;
    if (a.inheritedFrom !== null && b.inheritedFrom === null) return 1;
    return a.name.localeCompare(b.name);
  });

  return props;
}

export function getAllTypeNames(): string[] {
  return Object.keys(vocab.types).sort();
}

export function searchTypes(query: string, limit = 15): VocabType[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: Array<{ type: VocabType; score: number }> = [];

  for (const type of Object.values(vocab.types)) {
    const nameLower = type.name.toLowerCase();
    if (nameLower === q) {
      results.push({ type, score: 0 });
    } else if (nameLower.startsWith(q)) {
      results.push({ type, score: 1 });
    } else if (nameLower.includes(q)) {
      results.push({ type, score: 2 });
    } else if (type.description.toLowerCase().includes(q)) {
      results.push({ type, score: 3 });
    }
  }

  results.sort((a, b) => a.score - b.score || a.type.name.localeCompare(b.type.name));
  return results.slice(0, limit).map((r) => r.type);
}

export function getPopularTypes(): VocabType[] {
  const names = [
    "Person", "Organization", "Book", "Dataset", "Event",
    "Recipe", "Movie", "LocalBusiness", "Course", "WebPage",
    "Place", "VideoObject", "SoftwareApplication", "Article", "Product",
  ];
  return names.map((n) => vocab.types[n]).filter(Boolean);
}

export function getDataTypes(): string[] {
  return vocab.dataTypes;
}

export function getThingProperties(): TypeProperty[] {
  return getTypeProperties("Thing");
}

export { vocab };
