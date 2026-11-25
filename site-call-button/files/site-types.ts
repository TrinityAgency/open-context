// The website kit's shared vocabulary: only the declarations this template uses, copied word for word.
export const VOCAB_VERSION = 1;

export type CallLink = { kind: 'phone'; number: string; label: string } | { kind: 'whatsapp' | 'signal' | 'telegram'; href: string; label: string };
