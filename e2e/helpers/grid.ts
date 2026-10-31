import { expect, Locator, Page, test } from "@playwright/test";

export type SortDirection = "asc" | "desc";

type SortOptions = {
  // Client grids use AG Grid's comparator, which, unlike the database, is case sensitive.
  caseSensitive?: boolean;
};

const NUMBER = /^£?(-?\d+(\.\d+)?)$/;
const isNumber = (value: string) => NUMBER.test(value);
const toNumber = (value: string) => Number(value.match(NUMBER)![1]);

function compare(a: string, b: string, numeric: boolean, caseSensitive: boolean): number {
  if (a === "" || b === "") {
    return a === b ? 0 : a === "" ? -1 : 1;
  }
  if (numeric) {
    return toNumber(a) - toNumber(b);
  }
  if (caseSensitive) {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  return a.localeCompare(b, "en", { sensitivity: "base" });
}

export function isSorted(
  values: string[],
  direction: SortDirection,
  { caseSensitive = false }: SortOptions = {}
): boolean {
  const sign = direction === "asc" ? 1 : -1;
  const numeric = values.every((value) => value === "" || isNumber(value));
  return values.every(
    (value, i) =>
      i === 0 || sign * compare(values[i - 1], value, numeric, caseSensitive) <= 0
  );
}

// True if the values are different enough to show whether they are sorted.
export function canProveSorting(values: string[]): boolean {
  const filled = values.filter((value) => value !== "");
  return new Set(filled.map((value) => value.toLowerCase())).size >= 2;
}

export async function getColumnValues(grid: Page | Locator, columnId: string): Promise<string[]> {
  const rows = await grid
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

type GridOptions = {
  name?: string;
  open: string | ((page: Page) => Promise<void>);
  endpoint?: string;
  scope?: string;
};

async function checkEveryColumnCanBeSorted(page: Page, { open, endpoint, scope }: GridOptions) {
  if (typeof open === "string") {
    await page.goto(open);
  } else {
    await open(page);
  }

  const grid = scope ? page.locator(`[data-e2e="${scope}"]`) : page;
  const headers = grid.locator('[role="columnheader"].ag-header-cell-sortable');
  await expect(headers.first()).toBeVisible();
  const columnCount = await headers.count();

  for (let i = 0; i < columnCount; i++) {
    const header = headers.nth(i);
    const columnName = (await header.innerText()).trim();
    const columnId = (await header.getAttribute("col-id"))!;

    // First click sorts ascending, second click sorts descending.
    const clicks: { direction: SortDirection; sort: string; ariaSort: string }[] = [
      { direction: "asc", sort: columnId, ariaSort: "ascending" },
      { direction: "desc", sort: `-${columnId}`, ariaSort: "descending" },
    ];

    for (const { direction, sort, ariaSort } of clicks) {
      const label = `${columnName} ${direction}`;

      if (endpoint) {
        const response = await clickHeaderAndWaitForData(page, header, endpoint, sort);
        expect(response.status(), label).toBe(200);
      } else {
        await header.click();
        await expect(header, label).toHaveAttribute("aria-sort", ariaSort);
      }

      // Wait for the grid to show the sorted rows, then check them.
      await expect(async () => {
        const values = await getColumnValues(grid, columnId);
        expect(
          canProveSorting(values),
          `${label}: needs two different values to prove sorting, got ${JSON.stringify(values)}`
        ).toBe(true);
        expect(
          isSorted(values, direction, { caseSensitive: !endpoint }),
          `${label}: ${JSON.stringify(values)}`
        ).toBe(true);
      }).toPass({ timeout: 5000 });
    }
  }
}

export function testGrid(options: GridOptions) {
  const where = typeof options.open === "string" ? options.open : "page";
  const title = options.name ? `${options.name} grid` : `grid on ${where}`;

  test.describe(title, () => {
    test("every column can be sorted", async ({ page }) => {
      await checkEveryColumnCanBeSorted(page, options);
    });
  });
}
