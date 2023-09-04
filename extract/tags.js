#!/usr/bin/node

const fs = require("fs");

class Tags {}

const [, , language, path] = process.argv;
const TENANT_NAME = process.env.TENANT;

fetch(`https://api.crystallize.com/${TENANT_NAME}/catalogue`, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=UTF-8" },
  body: JSON.stringify({
    variables: { language },
    query: /* GraphQL */ `
      query ($language: String!) {
        topics(language: $language) {
          name
          children {
            name
          }
        }
      }
    `,
  }),
}).then(async (response) => {
  const data = await response.json();
  parseContent(data);
});

function parseContent(raw) {
  if (!raw.data?.topics) {
    console.warn("No topics");
    return;
  }
  const topics = {};
  raw.data.topics.forEach(
    (topic) =>
      (topics[topic.name] = topic.children.map((children) => children.name))
  );
  fs.writeFileSync(`out/tags.md`, JSON.stringify(topics), function (err) {
    if (err) {
      return console.log("error");
    }
  });
}
