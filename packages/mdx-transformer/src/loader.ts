import { createProcessor } from "@mdx-js/mdx";

import type { LoaderDefinition } from "@rspack/core";

type Root = ReturnType<ReturnType<typeof createProcessor>["parse"]>;
type RootContent = Root["children"][number];
type Paragraph = Extract<RootContent, { type: "paragraph" }>;
type Heading = Extract<RootContent, { type: "heading" }>;
type MdxjsEsm = Extract<RootContent, { type: "mdxjsEsm" }>;
type MdxJsxFlowElement = Extract<RootContent, { type: "mdxJsxFlowElement" }>;
type ParagraphChild = Paragraph["children"][number];
type HeadingChild = Heading["children"][number];
type FlowChild = MdxJsxFlowElement["children"][number];
type MdNode = RootContent | ParagraphChild | HeadingChild | FlowChild;
type Text = Extract<MdNode, { type: "text" }>;
type MdxAttribute = MdxJsxFlowElement["attributes"][number];
type JsxAttribute = Extract<MdxAttribute, { type: "mdxJsxAttribute" }>;
type JsxExpressionAttribute = Extract<
  MdxAttribute,
  { type: "mdxJsxExpressionAttribute" }
>;
type AttributeValueExpression = Extract<
  JsxAttribute["value"],
  { type: "mdxJsxAttributeValueExpression" }
>;

type RenderContext = {
  headers: string[];
};

const mdxLoader: LoaderDefinition<undefined> = async function mdxLoader(
  source: string,
) {
  this.cacheable?.();
  const callback = this.async();

  const code = process(source);

  this.emitFile("foo.md", code);

  callback(
    null,
    `
    export default ${JSON.stringify(code)}
    `,
  );
};

function process(source: string): string {
  const processor = createProcessor({
    format: "mdx",
    development: true,
  });

  const result = processor.parse(source) as Root;

  const code = mdxASTToMdJSXRender(result.children as ReadonlyArray<MdNode>, {
    headers: [],
  });

  return code;
}

export default mdxLoader;
export const raw = false;

function mdxJSXattributeToString(
  attributes: ReadonlyArray<MdxAttribute>,
): string {
  if (attributes.length === 0) {
    return "{}";
  }

  const parts = attributes.map((attribute) => {
    if (isMdxJsxExpressionAttribute(attribute)) {
      return `...(${attribute.value.trim()})`;
    }

    const { name, value } = attribute;

    if (value == null) {
      return `${name}: true`;
    }

    if (typeof value === "string") {
      return `${name}: ${JSON.stringify(value)}`;
    }

    return `${name}: ${formatAttributeExpression(value)}`;
  });

  return `{ ${parts.join(", ")} }`;
}

function mdxASTToMdJSXRender(
  astNodes: ReadonlyArray<MdNode>,
  context: RenderContext,
): string {
  const result: string[] = [];
  for (const node of astNodes) {
    if (isMdxjsEsm(node)) {
      context.headers.push(node.value);
      continue;
    }

    if (isMdxJsxFlowElement(node)) {
      const nodeName = node.name ?? "";
      const initial = nodeName.charAt(0);
      const componentName =
        nodeName.length === 0
          ? "Fragment"
          : isLowerCase(initial)
            ? `'${nodeName}'`
            : nodeName;

      result.push(
        `_jsx(${componentName}, ${mdxJSXattributeToString(node.attributes)}, ${mdxASTToMdJSXRender(node.children as ReadonlyArray<MdNode>, context)})`,
      );
      continue;
    }

    if (isHeading(node)) {
      const heading =
        "#".repeat(node.depth) +
        " " +
        mdxASTToMdJSXRender(node.children as ReadonlyArray<MdNode>, context);
      result.push(heading);
      continue;
    }

    if (isParagraph(node)) {
      result.push(
        mdxASTToMdJSXRender(node.children as ReadonlyArray<MdNode>, context),
      );
      continue;
    }

    if (isText(node)) {
      result.push(node.value);
      continue;
    }

    if (hasStringValue(node)) {
      result.push(node.value);
      continue;
    }

    if (hasChildren(node)) {
      result.push(
        mdxASTToMdJSXRender(node.children as ReadonlyArray<MdNode>, context),
      );
    }
  }
  return result.join("\r\n + \r\n");
}

function isLowerCase(char: string) {
  return char >= "a" && char <= "z";
}

function isMdxJsxExpressionAttribute(
  attribute: MdxAttribute,
): attribute is JsxExpressionAttribute {
  return attribute.type === "mdxJsxExpressionAttribute";
}

function formatAttributeExpression(value: AttributeValueExpression): string {
  return value.value.trim();
}

function isMdxjsEsm(node: MdNode): node is MdxjsEsm {
  return node.type === "mdxjsEsm";
}

function isMdxJsxFlowElement(node: MdNode): node is MdxJsxFlowElement {
  return node.type === "mdxJsxFlowElement";
}

function isHeading(node: MdNode): node is Heading {
  return node.type === "heading";
}

function isParagraph(node: MdNode): node is Paragraph {
  return node.type === "paragraph";
}

function isText(node: MdNode): node is Text {
  return node.type === "text";
}

function hasStringValue(node: MdNode): node is MdNode & { value: string } {
  return typeof (node as { value?: unknown }).value === "string";
}

function hasChildren(
  node: MdNode,
): node is MdNode & { children: ReadonlyArray<MdNode> } {
  return Array.isArray((node as { children?: unknown }).children);
}
