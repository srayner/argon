import { testGrid } from "./helpers/grid";
import { openDetail } from "./helpers/navigation";

testGrid({
  name: "properties",
  open: (page) => openDetail(page, "categories", "Screws"),
  scope: "properties-grid",
});

testGrid({
  name: "child categories",
  open: (page) => openDetail(page, "categories", "Mechanical"),
  scope: "child-categories-grid",
});
