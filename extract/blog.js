#!/usr/bin/node

const fs = require("fs");

class Page {}

const [, , language, path] = process.argv;
const TENANT_NAME = process.env.TENANT;

fetch(`https://api.crystallize.com/${TENANT_NAME}/catalogue`, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=UTF-8" },
  body: JSON.stringify({
    variables: { language, path },
    query: /* GraphQL */ `
      query ($language: String!, $path: String!) {
        catalogue(language: $language, path: $path) {
          name
          children {
            ... on Document {
              name
              shape {
                name
              }
              translationKey: component(id: "clef") {
                content {
                  ... on SingleLineContent {
                    text
                  }
                }
              }
              url: component(id: "url") {
                content {
                  ... on SingleLineContent {
                    text
                  }
                }
              }
              title: component(id: "titre") {
                content {
                  ... on SingleLineContent {
                    text
                  }
                }
              }
              keywords: component(id: "meta-keyword") {
                content {
                  ... on SingleLineContent {
                    text
                  }
                }
              }
              description: component(id: "meta-description") {
                content {
                  ... on SingleLineContent {
                    text
                  }
                }
              }
              topics {
                name
                path
                parent {
                  name
                }
              }
              components {
                type
                id
                __typename
                name
                content {
                  ... on ParagraphCollectionContent {
                    paragraphs {
                      title {
                        text
                      }
                      body {
                        html
                      }
                      images {
                        url
                        altText
                      }
                    }
                  }
                  ... on SingleLineContent {
                    text
                  }
                  ... on DatetimeContent {
                    datetime
                  }
                }
              }
            }
          }
        }
      }
    `,
  }),
}).then(async (response) => {
  const data = await response.json();
  parseContent(data);
});

// parser et parcourir le json
// pour chaque page générer un fichier md
// avec les données en frontmatter json

function parseContent(raw) {
  if (!raw.data?.catalogue?.children) {
    console.warn("No blog data");
    return;
  }
  raw.data.catalogue.children.forEach((item) => {
    // Ignore no-pageblog content
    if (item.shape.name !== "pageBlog") {
      return;
    }

    const page = new Page();
    page.name = item.title.content.text;
    page.layout = item.translationKey.content.text;
    page.translationKey = item.translationKey.content.text;

    item.components.forEach((component) => {
      component.id = component.id.replace(/-/gi, "_");
      switch (component.type) {
        case "paragraphCollection":
          let i = 0;
          page.content = [];
          component.content.paragraphs.forEach((p) => {
            const newParagraph = {};
            if (p.title != null) {
              newParagraph.title = p.title.text;
            }
            if (!!p.body?.html && p.body.html.length > 0) {
              newParagraph.html = p.body.html;
            }
            if (!!p.images && p.images.length > 0) {
              p.images.forEach((i) => {
                if (!i.altText) delete i.altText;
              });
              newParagraph.images = p.images.filter((i) => !!i.url);
            }
            page.content.push(newParagraph);
          });
          break;
        case "singleLine":
          page[component.id] = component.content?.text;
          break;
        case "datetime":
          page[component.id] = component.content.datetime;
          break;
      }
      if (!!item.topics && Object.keys(item.topics).length > 0) {
        page.topics = {};
        item.topics.forEach((topic) => {
          if (!page["topics"][topic.parent.name])
            page["topics"][topic.parent.name] = {};
          page["topics"][topic.parent.name][topic.name] = topic.path;
        });
        page.tags = item.topics.map((t) => t.name);
      }
      //page.blocks.push(block);
    });
    //page.blocks.sort(compare);

    fs.writeFileSync(
      `out/blogPages/${page.translationKey}.md`,
      JSON.stringify(page),
      function (err) {
        if (err) {
          return console.log("error");
        }
      }
    );
  });
}

function compare(a, b) {
  if (a.weight < b.weight) {
    return -1;
  }
  if (a.weight > b.weight) {
    return 1;
  }
  return 0;
}
