// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";

// src/lib/getToc.ts
import { remark } from "remark";
import remarkMdx from "remark-mdx";

// src/lib/remark/remarkTocHeadings.ts
import { slug } from "github-slugger";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
function remarkTocHeadings(options2) {
  return (tree) => visit(tree, "heading", (node) => {
    const textContent = toString(node);
    options2.exportRef.push({
      value: textContent,
      url: "#" + slug(textContent),
      depth: node.depth
    });
  });
}

// src/lib/getToc.ts
async function getToc(markdown) {
  const toc = [];
  remark().use(remarkMdx).use(remarkTocHeadings, { exportRef: toc }).processSync(markdown);
  return toc;
}

// src/lib/mdxOptions.mjs
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";

// src/lib/rehype/rehypePrettyCode.mjs
var options = {
  theme: "github-dark",
  keepBackground: false,
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className.push("highlighted");
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ["word"];
  }
};

// src/lib/remark/remarkAdmonitions.mjs
import { visit as visit2 } from "unist-util-visit";
function remarkAdmonitions() {
  return (tree) => {
    visit2(tree, (node) => {
      if (node.type === "textDirective" || node.type === "leafDirective" || node.type === "containerDirective") {
        if (!["info", "success", "warn", "danger"].includes(node.name))
          return;
        const status = node.name;
        node.type = "mdxJsxFlowElement";
        node.name = "Message";
        node.attributes = [
          { type: "mdxJsxAttribute", name: "status", value: status }
        ];
      }
    });
  };
}

// src/lib/remark/remarkImgToJsx.mjs
import fs from "fs";
import sizeOf from "image-size";
import { visit as visit3 } from "unist-util-visit";
function remarkImgToJsx() {
  return (tree) => {
    visit3(
      tree,
      // only visit p tags that contain an img element
      (node) => node.type === "paragraph" && node.children.some((n) => n.type === "image"),
      (node) => {
        const imageNode = node.children.find((n) => n.type === "image");
        if (fs.existsSync(`${process.cwd()}/public${imageNode.url}`)) {
          const dimensions = sizeOf(`${process.cwd()}/public${imageNode.url}`);
          imageNode.type = "mdxJsxFlowElement", imageNode.name = "Image", imageNode.attributes = [
            { type: "mdxJsxAttribute", name: "alt", value: imageNode.alt },
            { type: "mdxJsxAttribute", name: "src", value: imageNode.url },
            {
              type: "mdxJsxAttribute",
              name: "width",
              value: dimensions.width
            },
            {
              type: "mdxJsxAttribute",
              name: "height",
              value: dimensions.height
            }
          ];
          node.type = "div";
          node.children = [imageNode];
        }
      }
    );
  };
}

// src/lib/mdxOptions.mjs
var mdxOptions = {
  remarkPlugins: [
    remarkGfm,
    remarkDirective,
    remarkAdmonitions,
    remarkImgToJsx
  ],
  rehypePlugins: [
    rehypeExternalLinks,
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "append",
        properties: {
          ["aria-hidden"]: false,
          ["tab-index"]: false,
          ["class"]: "hash-link"
        }
      }
    ],
    [rehypePrettyCode, options]
  ]
};
var mdxOptions_default = mdxOptions;

// contentlayer.config.ts
var Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true
    },
    description: {
      type: "string"
    },
    date: {
      type: "date",
      required: true
    },
    tags: {
      type: "list",
      of: {
        type: "string"
      }
    },
    thumbImg: {
      type: "string"
    },
    thumbAlt: {
      type: "string"
    },
    author: {
      type: "string"
    }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("blog/", "")
    },
    toc: {
      type: "list",
      resolve: (doc) => getToc(doc.body.raw)
    }
  }
}));
var Docs = defineDocumentType(() => ({
  name: "Docs",
  filePathPattern: `docs/**/*.mdx`,
  contentType: "mdx",
  fields: {
    id: {
      type: "string"
    },
    title: {
      type: "string",
      required: true
    },
    description: {
      type: "string"
    }
  },
  computedFields: {
    id: {
      type: "string",
      resolve: (doc) => doc.id || doc._raw.flattenedPath.replace("docs/", "")
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("docs/", "")
    },
    toc: {
      type: "list",
      resolve: (doc) => getToc(doc.body.raw)
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  contentDirExclude: ["docs/_sidebar.js"],
  documentTypes: [Blog, Docs],
  mdx: mdxOptions_default
});
export {
  Blog,
  Docs,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-OQJ3CPL7.mjs.map
