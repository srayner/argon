import { testGrid } from "./helpers/grid";
import { openDetail } from "./helpers/navigation";

testGrid({
  name: "stock locations",
  open: (page) => openDetail(page, "products", "Two-Part Epoxy"),
  scope: "stock-locations-panel",
});
