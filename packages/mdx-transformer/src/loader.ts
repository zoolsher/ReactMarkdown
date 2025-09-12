// import { createProcessor } from '@mdx-js/mdx'

import type { LoaderDefinition } from "@rspack/core";

const mdxLoader: LoaderDefinition<{}> = async function mdxLoader(
  source: string,
) {
  this.cacheable?.();
  const callback = this.async();

  // const processor = createProcessor({
  //   format: 'mdx',
  //   development: true,
  // });

  // const result = processor.parse(source);

  // const code = mdxASTToMdJSXRender(result.children, {
  //   headers: [],
  // })

  // this.emitFile('foo.md', code)

  // callback(null, `
  //   export default ${JSON.stringify(code)}
  //   `);
  callback(null, source);
};

export default mdxLoader;
export const raw = false;

// function mdxJSXattributeToString(attributes) {
//   return "{" + attributes.map(({ name, value }) => {
//     return `${name}: ${value}`
//   }).join(', ') + "}"
// }

// function mdxASTToMdJSXRender(astNodes:RootContent[], context) {
//   const result = [];
//   for (const node of astNodes) {
//     switch (node.type) {
//       case 'mdxjsEsm':
//         context.headers.push(node.value)
//         break;
//       case 'mdxJsxFlowElement':
//         const name = isLowerCase(node.name[0]) ? `'${node.name}'` : node.name
//         result.push(`_jsx(${name}, ${mdxJSXattributeToString(node.attributes)}, ${mdxASTToMdJSXRender(node.children, context)})`);
//         break;
//       case 'heading':
//         let res = "#".repeat(node.depth) + " " + mdxASTToMdJSXRender(node.children, context)
//         result.push(res)
//         break;
//       case 'paragraph':
//         result.push(mdxASTToMdJSXRender(node.children, context));
//         break;
//       case 'text':
//         result.push(node.value);
//         break;
//       default:
//         result.push(node.value);
//     }
//   }
//   return result.join('\r\n + \r\n');
// }

// function isLowerCase(char: string) {
//   return char >= 'a' && char <= 'z';
// }
