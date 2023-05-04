// aliasing for clarification
export type locale = string;

export const serializerDelimiter = '__';

// fields which can be directly translated
export const translatableFieldTypes = [
  "text", 
  "textarea", 
  "richText"
];
// fields which can be recursively traversed
export const traversableFieldTypes = [
  "group",
  "array",
  "blocks",
  "tabs",
  "collapsible",
  "row",
];
// all supported field types combined
export const supportedFieldTypes = [
  ...translatableFieldTypes,
  ...traversableFieldTypes,
];