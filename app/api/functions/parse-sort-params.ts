type SortDirection = 'asc' | 'desc';

interface OrderBy {
  [field: string]: SortDirection;
}

function parseSortParams(sortString: string): OrderBy[] {
  const sortParams = sortString.split(",");
  return sortParams.map((param) => {
    const direction: SortDirection = param.startsWith("-") ? "desc" : "asc";
    const field: string = param.startsWith("-") ? param.substring(1) : param;
    return { [field]: direction };
  });
}

export default parseSortParams;
