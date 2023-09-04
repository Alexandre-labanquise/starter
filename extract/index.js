#!/usr/bin/node
const fs = require("fs");

class Page {}
class Section {}
class Item {}

const [, , language, path] = process.argv;
const TENANT_NAME = process.env.TENANT;

// const BLOCK_ACTIONS = {
//   contentChunk: (component) => {
//     let result = {};
//     if (!["sujets", "postes", "dispo"].includes(component.id)) {
//       return result;
//     }

// 		for (const chunk of component.content.chunks) {
// 			let id = "";
//     	let text = "";
// 			result = {...result, ...chunk.reduce(( chunkEntry, innerChunk) => {
//         if (innerChunk.name === "id") id = innerChunk.content?.text;
//         if (innerChunk.name === "texte") text = innerChunk.content?.text;
// 				return chunkEntry
//       }, {});
// 		}
//       page[component.id][id] = text;
// 		}

//     return result;
//   },
// };

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
              components {
                type
                id
                __typename
                name
                content {
                  ... on ContentChunkContent {
                    chunks {
                      name
                      content {
                        ... on SingleLineContent {
                          text
                        }
                        ... on ParagraphCollectionContent {
                          paragraphs {
                            title {
                              text
                            }
                            images {
                              url
                              altText
                            }
                            body {
                              html
                            }
                          }
                        }
                        ... on RichTextContent {
                          html
                        }
                      }
                    }
                  }
                  ... on ParagraphCollectionContent {
                    paragraphs {
                      title {
                        text
                      }
                      images {
                        url
                        altText
                      }
                      body {
                        html
                      }
                    }
                  }
                  ... on SingleLineContent {
                    text
                  }
                  ... on ImageContent {
                    images {
                      url
                      altText
                    }
                  }
                  ... on RichTextContent {
                    html
                  }
                  ... on BooleanContent {
                    value
                  }
                  ... on NumericContent {
                    number
                  }
                  ... on PropertiesTableContent {
                    sections {
                      title
                      properties {
                        key
                        value
                      }
                    }
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

function parsePageElement(pageElement) {
  return pageElement.content.chunks.map(
    ([titleWithDescription, buttonLabel, buttonLink, quote]) => {
      return {
        titleWithDescriptions: titleWithDescription.content?.paragraphs.map(
          ({ title: { text: title }, images, body: { html } }) => ({
            title,
            images,
            content: html.join(""),
          })
        ),
        quote: quote.content.html.join(""),
        button: {
          label: buttonLabel.content?.text,
          link: buttonLink.content?.text,
        },
      };
    }
  );
}

function parseContent(raw) {
  raw["data"]["catalogue"]["children"].forEach((item) => {
    if (!item["shape"]) {
      return;
    }

    const page = new Page();
    page.name = item.title.content?.text;
    page.layout = item.translationKey.content?.text;
    page.translationKey = item.translationKey.content?.text;

    item.components.forEach((component) => {
      component.id = component.id.replace(/-/gi, "_");
      switch (component.type) {
        case "contentChunk":
          console.log(component);
          page[component.id] ??= [];

          if (component.id === "page_elements") {
            page[component.id].push(...parsePageElement(component));
          }

          if (["sujets", "postes", "dispo"].indexOf(component.id) > -1) {
            page[component.id] = {};
            let id = "";
            let text = "";
            component.content.chunks.forEach((c) => {
              c.forEach((cc) => {
                if (cc.name == "id") id = cc.content?.text;
                if (cc.name == "texte") text = cc.content?.text;
              });
              page[component.id][id] = text;
            });
          }

          break;
        case "paragraphCollection":
          if (!page[component.id]) {
            page[component.id] = [];
          }
          for (const {
            title: { text: title },
            body: { html: content },
            images,
          } of component.content.paragraphs) {
            page[component.id].push({
              title,
              content: content.join(""),
              images: images.map(({ url: src, altText: alt }, j) => ({
                src,
                alt,
              })),
            });
          }
          break;
        case "singleLine":
          page[component.id] = component.content?.text;
          break;
        case "images":
          if (!component.content?.images) {
            break;
          }
          page[component.id] = component.content?.images.map(
            ({ url: screen, altText: alt }) => ({ src, alt })
          );
          break;
        case "richText":
          page[component.id] = "";
          component.content?.html.forEach((html) => {
            page[component.id] = page[component.id] + html;
          });
          break;
        case "propertiesTable":
          componentlist = Array();
          component.content.sections.forEach((sec) => {
            const prop = new Item();
            sec.properties.forEach((p) => {
              prop[p.key] = p.value;
            });
            if (prop.title) {
              const section = new Section();
              section[sec.title] = prop;
              componentlist.push(section);
            }
          });
          if (componentlist.length > 0) {
            page[component.id] = componentlist;
          }
          break;
        case "boolean":
          page[component.id] = component.content.value;
          break;
        case "numeric":
          page[component.id] = component.content.number;
          break;
      }

      //page.blocks.push(block);
    });
    //page.blocks.sort(compare);

    fs.writeFileSync(
      `out/tmp/${page.translationKey}.md`,
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
