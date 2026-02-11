import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputFile = path.join(__dirname, "../src/lib/generated/schema-vocabulary.json");

const SCHEMA_URL = "https://schema.org/version/latest/schemaorg-current-https.jsonld";

function unwrap(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function getId(ref) {
  if (typeof ref === "string") return ref;
  return ref?.["@id"] ?? "";
}

function stripPrefix(id) {
  return id
    .replace("https://schema.org/", "")
    .replace("http://schema.org/", "")
    .replace(/^schema:/, "");
}

async function generate() {
  console.log("Fetching schema.org vocabulary...");
  const resp = await fetch(SCHEMA_URL);
  if (!resp.ok) throw new Error(`Failed to fetch: ${resp.status}`);
  const data = await resp.json();
  const graph = data["@graph"];
  console.log(`Parsed ${graph.length} graph nodes`);

  const types = {};
  const properties = {};
  const dataTypeNames = new Set();

  // First pass: classify nodes
  for (const node of graph) {
    const id = stripPrefix(getId(node["@id"]));
    if (!id || id.includes(":")) continue; // skip external refs

    const nodeTypes = unwrap(node["@type"]).map(stripPrefix);

    if (nodeTypes.includes("DataType") || nodeTypes.includes("rdfs:Datatype")) {
      dataTypeNames.add(id);
      continue;
    }

    if (nodeTypes.includes("rdfs:Class") || nodeTypes.includes("Class")) {
      const parents = unwrap(node["rdfs:subClassOf"]).map((r) => stripPrefix(getId(r)));
      const comment = node["rdfs:comment"];
      const description =
        typeof comment === "string"
          ? comment
          : comment?.["@value"] ?? "";
      const isPending = unwrap(node["schema:isPartOf"]).some(
        (p) => getId(p).includes("pending")
      );
      const superseded = unwrap(node["schema:supersededBy"]);

      // Also classify DataType subtypes
      const allParents = unwrap(node["rdfs:subClassOf"]).map((r) => getId(r));
      if (allParents.some((p) => p.includes("DataType"))) {
        dataTypeNames.add(id);
        continue;
      }

      if (superseded.length > 0) continue; // skip superseded types

      types[id] = {
        name: id,
        description: cleanHtml(description),
        parents: parents.filter((p) => p && p !== "Intangible" ? true : true).filter(Boolean),
        hierarchy: [],
        children: [],
        isPending,
        url: `https://schema.org/${id}`,
      };
    }

    if (nodeTypes.includes("rdf:Property") || nodeTypes.includes("Property")) {
      const domainIncludes = unwrap(node["schema:domainIncludes"] ?? node["domainIncludes"]).map(
        (r) => stripPrefix(getId(r))
      );
      const rangeIncludes = unwrap(node["schema:rangeIncludes"] ?? node["rangeIncludes"]).map(
        (r) => stripPrefix(getId(r))
      );
      const comment = node["rdfs:comment"];
      const description =
        typeof comment === "string"
          ? comment
          : comment?.["@value"] ?? "";
      const isPending = unwrap(node["schema:isPartOf"]).some(
        (p) => getId(p).includes("pending")
      );
      const superseded = unwrap(node["schema:supersededBy"]);
      if (superseded.length > 0) continue;

      properties[id] = {
        name: id,
        description: cleanHtml(description),
        domainTypes: domainIncludes,
        rangeTypes: rangeIncludes,
        isPending,
        url: `https://schema.org/${id}`,
      };
    }
  }

  // Add common DataTypes that might be referenced but not classified
  for (const dt of ["Boolean", "Date", "DateTime", "Number", "Text", "Time", "URL", "Integer", "Float"]) {
    dataTypeNames.add(dt);
  }

  console.log(`Found ${Object.keys(types).length} types, ${Object.keys(properties).length} properties, ${dataTypeNames.size} data types`);

  // Build children lists
  for (const [name, type] of Object.entries(types)) {
    for (const parent of type.parents) {
      if (types[parent]) {
        types[parent].children.push(name);
      }
    }
  }

  // Sort children alphabetically
  for (const type of Object.values(types)) {
    type.children.sort();
  }

  // Build hierarchy (BFS upward)
  function getHierarchy(typeName) {
    if (!types[typeName]) return [typeName];
    const visited = new Set();
    let current = typeName;
    const chain = [current];
    visited.add(current);
    // Walk up first parent chain
    while (types[current]?.parents.length > 0) {
      const parent = types[current].parents.find((p) => types[p] && !visited.has(p));
      if (!parent) break;
      visited.add(parent);
      chain.unshift(parent);
      current = parent;
    }
    return chain;
  }

  for (const [name, type] of Object.entries(types)) {
    type.hierarchy = getHierarchy(name);
  }

  // Build domainIndex: for each type, which properties are directly defined on it
  const domainIndex = {};
  for (const [propName, prop] of Object.entries(properties)) {
    for (const typeName of prop.domainTypes) {
      if (!domainIndex[typeName]) domainIndex[typeName] = [];
      domainIndex[typeName].push(propName);
    }
  }
  // Sort each type's properties alphabetically
  for (const props of Object.values(domainIndex)) {
    props.sort();
  }

  const vocabulary = {
    generatedAt: new Date().toISOString(),
    types,
    properties,
    domainIndex,
    dataTypes: [...dataTypeNames].sort(),
  };

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify(vocabulary));
  const sizeMB = (fs.statSync(outputFile).size / 1024 / 1024).toFixed(2);
  console.log(`Written to ${outputFile} (${sizeMB} MB)`);
  console.log(`Types: ${Object.keys(types).length}, Properties: ${Object.keys(properties).length}`);
}

function cleanHtml(str) {
  return str
    .replace(/<[^>]+>/g, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

generate().catch((err) => {
  console.error("Failed to generate schema vocabulary:", err);
  process.exit(1);
});
