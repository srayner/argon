import { testGrid } from "./helpers/grid";
import { openDetail } from "./helpers/navigation";

testGrid({
  name: "stock",
  open: (page) => openDetail(page, "locations", "tool chest"),
  scope: "stock-grid",
});

testGrid({
  name: "child locations",
  open: (page) => openDetail(page, "locations", "Garage"),
  scope: "child-locations-grid",
});
