import { Prisma } from "@prisma/client";

const buildChildrenInclude = (depth: number): Prisma.CategoryInclude => {
  if (depth === 1) {
    return { children: true };
  }

  if (depth <= 0) {
    return {};
  }

  return {
    children: {
      include: buildChildrenInclude(depth - 1),
    },
  };
};

export default buildChildrenInclude;
