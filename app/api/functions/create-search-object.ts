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
  const searchConditions = fields.map((field) => ({
    [field]: {
      contains: searchTerm,
    } as Prisma.StringFilter,
  }));

  return {
    OR: searchConditions,
  };
}

export default createSearchObject;
