/**
 * Merges two arrays of objects, removes duplicates based on a unique key,
 * and sorts the result by a specified sort field.
 *
 * @param originalData - The original array of data
 * @param newData - The new array of data to merge
 * @param keyField - The field to deduplicate by (e.g., "id", "locationId")
 * @param sortField - The field to sort the merged data by (e.g., "name", "date")
 * @returns The merged, deduplicated, and sorted array
 */
export const mergeArraysNoDuplicates = <T>(
  originalData: T[],
  newData: T[],
  keyField: keyof T, // The field to deduplicate by
  sortField: keyof T // The field to sort by
): T[] => {
  // Merge both arrays into one
  const mergedData = [...originalData, ...newData];
  console.log(mergedData);

  // Remove duplicates based on the keyField
  const uniqueData = mergedData.filter(
    (value, index, self) =>
      index === self.findIndex((item) => item[keyField] === value[keyField])
  );

  // Sort the merged data by the specified sortField
  uniqueData.sort((a, b) => {
    if (a[keyField] === null || a[keyField] === "") return -1;
    if (b[keyField] === null || b[keyField] === "") return 1;

    if (a[sortField] < b[sortField]) return -1;
    if (a[sortField] > b[sortField]) return 1;

    return 0;
  });

  return uniqueData;
};
