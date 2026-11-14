// The website kit's shared vocabulary: only the declarations this template uses, copied word for word.
export const VOCAB_VERSION = 1;

export type ConsentCategory = { id: string; label: string; description: string; required: boolean };
export type ConsentState = { version: string; decidedAt: string; granted: string[] };
