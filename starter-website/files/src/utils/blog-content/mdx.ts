import { compile, run, type CompileOptions } from '@mdx-js/mdx';
import type { ComponentType } from 'react';
import * as runtime from 'react/jsx-runtime';
import { BlogContentError, isLocalSrc } from './front-matter';

export type Heading = { id: string; text: string; depth: 2 | 3 };
/** Element name → the component that renders it, e.g. `{ h2: MyHeading }` (see mdxComponents). */
export type MdxComponents = Record<string, ComponentType<never>>;
/** A compiled post body. */
export type MdxContent = ComponentType<{ components?: MdxComponents }>;
/** Extra remark and rehype plugins, passed to the MDX compiler after the blog's own rules. */
export type MdxOptions = {
  remarkPlugins?: CompileOptions['remarkPlugins'];
  rehypePlugins?: CompileOptions['rehypePlugins'];
};

/** The id of a heading: lowercase letters, digits and hyphens; spaces become `-`; nothing left gives `section`. */
export function headingId(text: string): string {
  const id = text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
  return id || 'section';
}

// The few mdast fields the rules read (mdast types are not a peer of this template).
type MdExpression = { type: string; value?: string; data?: { estree?: unknown } };
type MdAttribute = { type: string; name?: string; value?: unknown };
type MdNode = {
  type: string;
  name?: string | null;
  depth?: number;
  url?: string;
  identifier?: string;
  value?: unknown;
  attributes?: MdAttribute[];
  children?: MdNode[];
  position?: { start: { line: number } };
  data?: { hProperties?: Record<string, unknown>; estree?: unknown };
};

// Attributes (compared in lower case) whose value is an address the browser fetches as the page loads. `href` does
// too on every HTML or SVG element but a link (`a`, `area`): SVG `image` and `use`, for example.
const LOAD_ATTRIBUTES = new Set(['src', 'srcset', 'poster', 'data', 'background', 'xlinkhref', 'xlink:href']);
const LINK_ELEMENTS = new Set(['a', 'area']);
// HTML elements a post never needs: each loads or runs something by itself.
const REFUSED_ELEMENTS = new Set(['script', 'style', 'link', 'meta', 'base', 'object', 'embed']);

function textOf(node: MdNode): string {
  if ((node.type === 'text' || node.type === 'inlineCode') && typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

// Every address in an attribute value: a srcset lists `<url> <descriptor>` candidates.
function addressesOf(name: string, value: string): string[] {
  if (name !== 'srcset') return [value];
  return value.split(',').map((candidate) => candidate.trim().split(/\s+/)[0] ?? '');
}

// An `href` may also point into the post itself (`#id`, an SVG symbol).
const isLocalAddress = (name: string, value: string) =>
  isLocalSrc(value) || ((name === 'href' || name.endsWith('href')) && value.trim().startsWith('#'));

// Whether an expression's syntax tree (estree) holds JSX: an element written inside `{ }` escapes the checks below.
function hasJsx(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(hasJsx);
  const { type } = value as { type?: unknown };
  if (type === 'JSXElement' || type === 'JSXFragment') return true;
  return Object.entries(value).some(([key, child]) => key !== 'loc' && key !== 'range' && hasJsx(child));
}

/**
 * The blog's rules, run on every post: h2 and h3 get ids (repeats get -1, -2, …) and are listed on the file's data;
 * ESM, spread attributes, JSX inside `{ }` and anything that would load from another host stop the build at the
 * offending line.
 */
function remarkBlogRules({ file, bodyLine }: { file: string; bodyLine: number }) {
  return (tree: MdNode, vfile: { data: object }) => {
    const headings: Heading[] = [];
    const used = new Set<string>();
    const definitions = new Map<string, string>();
    const imageReferences: MdNode[] = [];
    const refuse = (node: MdNode, what: string): never => {
      throw new BlogContentError(file, bodyLine + (node.position?.start.line ?? 1) - 1, what);
    };
    const walk = (node: MdNode) => {
      if (node.type === 'mdxjsEsm') refuse(node, 'import and export are not allowed in a post');
      if (node.type === 'image' && !isLocalSrc(node.url ?? '')) {
        refuse(node, `image ${node.url}: images come from this site (/…) or a data:image/ URI`);
      }
      if (node.type === 'definition' && node.identifier) definitions.set(node.identifier, node.url ?? '');
      if (node.type === 'imageReference') imageReferences.push(node);
      if ((node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') && hasJsx(node.data?.estree)) {
        refuse(node, 'JSX inside { } is not checked: write the element directly');
      }
      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        const element = node.name ?? '';
        const html = element === element.toLowerCase();
        if (html && REFUSED_ELEMENTS.has(element)) {
          refuse(node, `<${element}> is not allowed in a post: it loads or runs something by itself`);
        }
        for (const attribute of node.attributes ?? []) {
          if (attribute.type === 'mdxJsxExpressionAttribute') refuse(node, 'spread attributes are not allowed in a post');
          const name = (attribute.name ?? '').toLowerCase();
          const expression = typeof attribute.value === 'object' && attribute.value !== null ? (attribute.value as MdExpression) : null;
          const text = typeof attribute.value === 'string' ? attribute.value : (expression?.value ?? '');
          if (expression && hasJsx(expression.data?.estree)) refuse(node, `${attribute.name}: JSX inside { } is not checked`);
          if (name === 'srcdoc') refuse(node, `${attribute.name}: an inline document is not allowed in a post`);
          if (name === 'style' && /(?:url|image-set)\s*\(/i.test(text)) {
            refuse(node, 'style: url() and image-set() load files; use an image instead');
          }
          const loads = LOAD_ATTRIBUTES.has(name) || (name === 'href' && html && !LINK_ELEMENTS.has(element));
          if (!loads) continue;
          if (typeof attribute.value !== 'string') {
            refuse(node, `${attribute.name}: write the address as text, not as an expression`);
          } else if (!addressesOf(name, attribute.value).every((address) => isLocalAddress(name, address))) {
            refuse(node, `${attribute.name} ${attribute.value}: images and media come from this site (/…)`);
          }
        }
      }
      const depth = node.depth;
      if (node.type === 'heading' && (depth === 2 || depth === 3)) {
        const text = textOf(node);
        const base = headingId(text);
        let id = base;
        for (let n = 1; used.has(id); n += 1) id = `${base}-${n}`;
        used.add(id);
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
        headings.push({ id, text, depth });
      }
      node.children?.forEach(walk);
    };
    walk(tree);
    for (const reference of imageReferences) {
      const url = definitions.get(reference.identifier ?? '');
      if (url !== undefined && !isLocalSrc(url)) {
        refuse(reference, `image ${url}: images come from this site (/…) or a data:image/ URI`);
      }
    }
    Object.assign(vfile.data, { headings });
  };
}

/** A post body compiled but not yet run: the code `runMdx` turns into a component, and the body's headings. */
export type CompiledMdx = { code: string; headings: Heading[] };

/**
 * Compiles a post body (MDX) without running it: every rule is checked and the headings are listed. `file` and
 * `bodyLine` place every error in the source file: a refused element, or an MDX syntax error, stops the build as
 * `<file>:<line>: …`.
 */
export async function compileMdx(body: string, file: string, bodyLine: number, options: MdxOptions = {}): Promise<CompiledMdx> {
  let compiled;
  try {
    compiled = await compile(
      { value: body, path: file },
      {
        outputFormat: 'function-body',
        remarkPlugins: [[remarkBlogRules, { file, bodyLine }], ...(options.remarkPlugins ?? [])],
        rehypePlugins: options.rehypePlugins ?? [],
      },
    );
  } catch (error) {
    if (error instanceof BlogContentError) throw error;
    // An MDX syntax error is a VFileMessage. Its place in the body is a point or a range, or (for an unclosed tag)
    // only written at the end of the reason: `… (3:1-3:6)`.
    const { place, reason } = error as { place?: { line?: unknown; start?: { line?: unknown } }; reason?: unknown };
    const text = typeof reason === 'string' ? reason : String(error);
    const written = / \((\d+):\d+(?:-\d+:\d+)?\)$/.exec(text);
    const line = place?.start?.line ?? place?.line ?? (written ? Number(written[1]) : undefined);
    const at = typeof line === 'number' ? bodyLine + line - 1 : undefined;
    throw new BlogContentError(file, at, `mdx: ${written ? text.slice(0, written.index) : text}`);
  }
  return { code: String(compiled), headings: (compiled.data as { headings?: Heading[] }).headings ?? [] };
}

/** Runs a compiled body (on the server): the component that renders it. */
export async function runMdx(code: string): Promise<MdxContent> {
  const { default: Content } = await run(code, { ...runtime });
  return Content as unknown as MdxContent;
}

/**
 * Compiles a post body (MDX) into a component, on the server: compileMdx, then runMdx. `file` and `bodyLine` place
 * every error in the source file: a refused element, or an MDX syntax error, stops the build as `<file>:<line>: …`.
 */
export async function compilePost(
  body: string,
  file: string,
  bodyLine: number,
  options: MdxOptions = {},
): Promise<{ Content: MdxContent; headings: Heading[] }> {
  const { code, headings } = await compileMdx(body, file, bodyLine, options);
  return { Content: await runMdx(code), headings };
}
