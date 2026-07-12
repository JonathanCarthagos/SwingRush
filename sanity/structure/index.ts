import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Cities")
        .child(
          S.documentTypeList("cityPage")
            .title("City Pages")
            .filter('_type == "cityPage"'),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "cityPage",
      ),
    ]);
