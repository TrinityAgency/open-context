import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { RESERVED_SLUGS } from './blog-paths';
import { isVisible, sortPosts, tagCounts } from './collection';
import {
  BlogContentError,
  ID,
  authorsFile,
  categoriesFile,
  parseWith,
  parseYaml,
  postFrontMatter,
  splitFrontMatter,
} from './front-matter';
import { compileMdx, runMdx, type CompiledMdx, type Heading, type MdxContent, type MdxOptions } from './mdx';
import { countWords, readingMinutes } from './reading-time';
import type { Author, Category, Post } from './site-types';

export type BlogOptions = {
  /** The content folder, relative to the project root (`process.cwd()`) or absolute, e.g. `content/blog`. */
  dir: string;
  /** The clock that decides which scheduled posts are visible. Default: the time of the call. */
  now?: () => Date;
  /** Show drafts too (a preview build). Default false. */
  includeDrafts?: boolean;
  /** For readingMinutes. Default 200. */
  wordsPerMinute?: number;
  /** Extra remark and rehype plugins for every post body. */
  mdx?: MdxOptions;
};
export type LoadedPost = { post: Post; Content: MdxContent; headings: Heading[] };
export type PostFilter = { category?: string; authorId?: string; tag?: string };
export type Blog = {
  /** The visible posts, newest first, filtered. */
  getPosts(filter?: PostFilter): Promise<Post[]>;
  /** One visible post with its compiled body; null for a missing, draft or scheduled slug. */
  getPost(slug: string): Promise<LoadedPost | null>;
  getAuthors(): Promise<Author[]>;
  getAuthor(id: string): Promise<Author | null>;
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | null>;
  /** The tags of the visible posts with their counts, most used first. */
  getTags(): Promise<{ tag: string; count: number }[]>;
};

type Source = { post: Post; file: string; body: string; bodyLine: number };
type Content = { posts: Source[]; authors: Author[]; categories: Category[] };

const isMissing = (error: unknown) =>
  typeof error === 'object' && error !== null && (error as { code?: unknown }).code === 'ENOENT';

async function readOptional(file: string): Promise<string | null> {
  try {
    return await readFile(file, 'utf8');
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
}

async function postFileNames(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => !entry.isDirectory() && entry.name.endsWith('.mdx'))
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    if (isMissing(error)) return [];
    throw error;
  }
}

async function readList<T extends { id: string }>(
  file: string,
  parse: (data: unknown, file: string) => T[],
  what: string,
): Promise<T[]> {
  const text = await readOptional(file);
  if (text === null) return [];
  const list = parse(parseYaml(text, file, what), file);
  const seen = new Set<string>();
  for (const item of list) {
    if (seen.has(item.id)) throw new BlogContentError(file, undefined, `id "${item.id}" appears twice`);
    seen.add(item.id);
  }
  return list;
}

/**
 * The blog in a content folder: `posts/<slug>.mdx`, `authors.yaml`, `categories.yaml`. Every call reads the files
 * again, so `next dev` shows edits; every post is validated on every call, drafts too, so one broken file stops the
 * build with `<file>[:<line>]: <field>: <problem>`. Use it on the server only (it reads files).
 */
export function createBlog(options: BlogOptions): Blog {
  const root = resolve(process.cwd(), options.dir);
  const now = options.now ?? (() => new Date());
  const includeDrafts = options.includeDrafts ?? false;

  // Every body is compiled (not run) when the folder is read, drafts and scheduled posts too, so a broken one stops
  // this build rather than the first build after its date. Each file is compiled once per content.
  const compiled = new Map<string, { key: string; result: Promise<CompiledMdx> }>();
  const compileSource = (source: Source): Promise<CompiledMdx> => {
    const key = `${source.bodyLine}\n${source.body}`;
    const cached = compiled.get(source.file);
    if (cached?.key === key) return cached.result;
    const result = compileMdx(source.body, source.file, source.bodyLine, options.mdx);
    compiled.set(source.file, { key, result });
    return result;
  };

  async function load(): Promise<Content> {
    const [authors, categories, names] = await Promise.all([
      readList(join(root, 'authors.yaml'), (data, file) => parseWith(authorsFile, data, file, 'authors'), 'authors'),
      readList(join(root, 'categories.yaml'), (data, file) => parseWith(categoriesFile, data, file, 'categories'), 'categories'),
      postFileNames(join(root, 'posts')),
    ]);
    const authorIds = new Set(authors.map((author) => author.id));
    const categoryIds = new Set(categories.map((category) => category.id));
    const posts = await Promise.all(
      names.map(async (name): Promise<Source> => {
        const file = join(root, 'posts', name);
        const slug = name.slice(0, -'.mdx'.length);
        if (!ID.test(slug)) {
          throw new BlogContentError(file, undefined, `slug "${slug}": a file name is lowercase letters and digits, joined by single hyphens`);
        }
        if ((RESERVED_SLUGS as readonly string[]).includes(slug)) {
          throw new BlogContentError(file, undefined, `slug "${slug}" is reserved for the blog's own routes (${RESERVED_SLUGS.join(', ')})`);
        }
        const { data, body, bodyLine } = splitFrontMatter(await readFile(file, 'utf8'), file);
        const front = parseWith(postFrontMatter, data, file);
        for (const id of front.authorIds) {
          if (!authorIds.has(id)) throw new BlogContentError(file, undefined, `authorIds: unknown author "${id}" (not in authors.yaml)`);
        }
        if (!categoryIds.has(front.category)) {
          throw new BlogContentError(file, undefined, `category: unknown category "${front.category}" (not in categories.yaml)`);
        }
        const post: Post = { slug, ...front, readingMinutes: readingMinutes(countWords(body), options.wordsPerMinute) };
        return { post, file, body, bodyLine };
      }),
    );
    const files = new Set(posts.map((source) => source.file));
    for (const file of compiled.keys()) if (!files.has(file)) compiled.delete(file);
    // The first broken body in file order stops the read.
    const checked = await Promise.allSettled(posts.map(compileSource));
    const failed = checked.find((outcome): outcome is PromiseRejectedResult => outcome.status === 'rejected');
    if (failed) throw failed.reason;
    return { posts, authors, categories };
  }

  const visible = (posts: Source[]) => {
    const at = now();
    return posts.filter((source) => isVisible(source.post, at, includeDrafts));
  };

  return {
    async getPosts(filter = {}) {
      const { posts } = await load();
      return sortPosts(visible(posts).map((source) => source.post)).filter(
        (post) =>
          (filter.category === undefined || post.category === filter.category) &&
          (filter.authorId === undefined || post.authorIds.includes(filter.authorId)) &&
          (filter.tag === undefined || post.tags.includes(filter.tag)),
      );
    },
    async getPost(slug) {
      const { posts } = await load();
      const source = visible(posts).find((candidate) => candidate.post.slug === slug);
      if (!source) return null;
      const { code, headings } = await compileSource(source);
      return { post: source.post, Content: await runMdx(code), headings };
    },
    async getAuthors() {
      return (await load()).authors;
    },
    async getAuthor(id) {
      return (await load()).authors.find((author) => author.id === id) ?? null;
    },
    async getCategories() {
      return (await load()).categories;
    },
    async getCategory(id) {
      return (await load()).categories.find((category) => category.id === id) ?? null;
    },
    async getTags() {
      const { posts } = await load();
      return tagCounts(visible(posts).map((source) => source.post));
    },
  };
}
