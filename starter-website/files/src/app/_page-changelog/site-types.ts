// The website kit's shared vocabulary: only the declarations this template uses, copied word for word.
export const VOCAB_VERSION = 1;

export type ChangeKind = 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
export type ChangelogEntry = { version: string; date: string; title?: string; changes: { kind: ChangeKind; text: string }[] };
