import { expect, Locator, Page } from "@playwright/test";

export type SortDirection = "asc" | "desc";

const isNumber = (value: string) => /^-?\d+(\.\d+)?$/.test(value);

// Compares values the way the database sorts them: case insensitive, empty
// first, and numbers by value only when the whole column is numeric.
function compare(a: string, b: string, numeric: boolean): number {
  if (a === "" || b === "") {
    return a === b ? 0 : a === "" ? -1 : 1;
  }
  if (numeric) {
    return Number(a) - Number(b);
  }
  return a.localeCompare(b, "en", { sensitivity: "base" });
}

export function isSorted(values: string[], direction: SortDirection): boolean {
  const sign = direction === "asc" ? 1 : -1;
  const numeric = values.every((value) => value === "" || isNumber(value));
  return values.every(
    (value, i) => i === 0 || sign * compare(values[i - 1], value, numeric) <= 0
  );
}

// True if the values are different enough to show whether they are sorted.
export function canProveSorting(values: string[]): boolean {
  const filled = values.filter((value) => value !== "");
  return new Set(filled.map((value) => value.toLowerCase())).size >= 2;
}

export async function getColumnValues(page: Page, columnId: string): Promise<string[]> {
  const rows = await page
    .locator(".ag-center-cols-container .ag-row")
    .evaluateAll(
      (elements, id) =>
        elements.map((row) => ({
          index: Number(row.getAttribute("row-index")),
          text: row.querySelector<HTMLElement>(`[col-id="${id}"]`)?.innerText ?? "",
        })),
      columnId
    );

  return rows.sort((a, b) => a.index - b.index).map((row) => row.text.trim());
}

async function clickHeaderAndWaitForData(
  page: Page,
  header: Locator,
  endpoint: string,
  sort: string
) {
  const [response] = await Promise.all([
    page.waitForResponse((r) => {
      const url = new URL(r.url());
      return url.pathname === endpoint && url.searchParams.get("sort") === sort;
    }),
    header.click(),
  ]);
  return response;
}

// Sorts every column of a list page both ways and checks each result.
export async function checkEveryColumnCanBeSorted(
  page: Page,
  { path, endpoint }: { path: string; endpoint: string }
) {
  await page.goto(path);

  const headers = page.getByRole("columnheader");
  const columnCount = await headers.count();
  expect(columnCount).toBeGreaterThan(0);

  for (let i = 0; i < columnCount; i++) {
    const header = headers.nth(i);
    const columnName = (await header.innerText()).trim();
    const columnId = (await header.getAttribute("col-id"))!;

    // First click sorts ascending, second click sorts descending.
    const clicks: { direction: SortDirection; sort: string }[] = [
      { direction: "asc", sort: columnId },
      { direction: "desc", sort: `-${columnId}` },
    ];

    for (const { direction, sort } of clicks) {
      const label = `${columnName} ${direction}`;

      const response = await clickHeaderAndWaitForData(page, header, endpoint, sort);
      expect(response.status(), label).toBe(200);

      // Wait for the grid to show the sorted rows, then check them.
      await expect(async () => {
        const values = await getColumnValues(page, columnId);
        expect(
          canProveSorting(values),
          `${label}: needs two different values to prove sorting, got ${JSON.stringify(values)}`
        ).toBe(true);
        expect(isSorted(values, direction), `${label}: ${JSON.stringify(values)}`).toBe(true);
      }).toPass({ timeout: 5000 });
    }
  }
}
