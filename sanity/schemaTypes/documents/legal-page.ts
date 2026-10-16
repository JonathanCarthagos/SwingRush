import { BillIcon, DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const PRIVACY_POLICY_ID = "privacyPolicy";
export const TERMS_OF_USE_ID = "termsOfUse";

function legalBodyField() {
  return defineField({
    name: "body",
    title: "Body",
    type: "array",
    group: "content",
    description:
      "The page copy. Use Section heading for each titled block. The page title stays in the title field.",
    of: [
      defineArrayMember({
        type: "block",
        styles: [
          { title: "Paragraph", value: "normal" },
          { title: "Section heading", value: "h2" },
          { title: "Subsection", value: "h3" },
        ],
        lists: [
          { title: "Bullet", value: "bullet" },
          { title: "Numbered", value: "number" },
        ],
        marks: {
          decorators: [
            { title: "Bold", value: "strong" },
            { title: "Italic", value: "em" },
          ],
          annotations: [
            {
              name: "link",
              type: "object",
              title: "Link",
              fields: [
                defineField({
                  name: "href",
                  title: "URL",
                  type: "url",
                  validation: (rule) =>
                    rule.uri({
                      allowRelative: true,
                      scheme: ["http", "https", "mailto", "tel"],
                    }),
                }),
              ],
            },
          ],
        },
      }),
    ],
    validation: (rule) => rule.required().min(1),
  });
}

function legalPageType({
  name,
  title,
  icon,
}: {
  name: string;
  title: string;
  icon: typeof DocumentTextIcon;
}) {
  return defineType({
    name,
    title,
    type: "document",
    icon,
    groups: [
      { name: "content", title: "Content", default: true },
      { name: "seo", title: "SEO" },
    ],
    fields: [
      defineField({
        name: "title",
        title: "Page title (H1)",
        type: "string",
        group: "content",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "lastPublished",
        title: "Last published",
        type: "date",
        group: "content",
        description: "Shown under the title as “Last Published”.",
        validation: (rule) => rule.required(),
      }),
      legalBodyField(),
      defineField({
        name: "seo",
        title: "SEO",
        type: "seo",
        group: "seo",
      }),
    ],
    preview: {
      select: { subtitle: "seo.title" },
      prepare: ({ subtitle }) => ({ title, subtitle }),
    },
  });
}

export const privacyPolicy = legalPageType({
  name: "privacyPolicy",
  title: "Privacy Policy",
  icon: DocumentTextIcon,
});

export const termsOfUse = legalPageType({
  name: "termsOfUse",
  title: "Terms of Use",
  icon: BillIcon,
});
