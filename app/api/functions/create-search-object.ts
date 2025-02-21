import { Prisma } from "@prisma/client";

/**
 * Utility function to create a search object for Prisma queries.
 *
 * @param fields - Array of field names to search in.
 * @param searchTerm - The search term to look for.
 *
 * @returns Prisma search object.
 */
function createSearchObject(fields: string[], searchTerm: string) {
  if (!searchTerm.trim() || fields.length === 0) {
    return {}; // Avoid unnecessary queries
  }

  const searchConditions: any[] = [];
  const relationMap: Record<string, any[]> = {}; // Store related fields

  for (const field of fields) {
    const parts = field.split(".");

    if (parts.length === 1) {
      // Direct field
      searchConditions.push({
        [field]: {
          contains: searchTerm,
        } as Prisma.StringFilter,
      });
    } else {
      // Related field
      const relation = parts[0]; // First part is the relation name
      const relatedField = parts.slice(1).join("."); // Remaining parts form the nested field

      if (!relationMap[relation]) {
        relationMap[relation] = [];
      }

      relationMap[relation].push({
        [relatedField]: {
          contains: searchTerm,
        } as Prisma.StringFilter,
      });
    }
  }

  // Convert relationMap into proper Prisma OR conditions
  const relatedSearchConditions = Object.entries(relationMap).map(
    ([relation, conditions]) => ({
      [relation]: { OR: conditions },
    })
  );

  return {
    OR: [...searchConditions, ...relatedSearchConditions],
  };
}

export default createSearchObject;
