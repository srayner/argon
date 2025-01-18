type OrderBy = {
  [key: string]: "asc" | "desc" | { [nestedKey: string]: "asc" | "desc" };
};

const parseSortParams = (sortString: string): OrderBy[] => {
  if (!sortString.trim()) {
    return [];
  }

  const sortParams = sortString.split(",");

  return sortParams.reduce((orderBy, param) => {
    const direction = param.startsWith("-") ? "desc" : "asc";
    const field = param.startsWith("-") ? param.substring(1) : param;

    const keys = field.split(".");
    const sortObject: any = keys.reduceRight((acc, key, index) => {
      return index === keys.length - 1 ? { [key]: direction } : { [key]: acc };
    }, {});

    orderBy.push(sortObject);

    return orderBy;
  }, [] as OrderBy[]);
};

export default parseSortParams;
