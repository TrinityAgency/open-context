# design/export/

Put your claude.ai design system's export here, unchanged, in the importer layout:

```
design/export/
  export.json
  project/
    tokens.json            colours (with themes), type, spacing, radius, shadow
    components/bundle.css  the component styles
    components/<Name>/preview.html
    fonts/                 optional
    assets/                optional (SVGs are copied to public/brand)
```

`design-sync.config.json` points `source` at `design/export/project` and `contract` at `design/oc-map.json`, the map
from the design's tokens to the design tokens every part reads (copy
`src/design-system/design-tokens/oc-map.example.json` there and fill it in). Then run `pnpm design:sync`. To take a
new version of the design: replace the export here, run `pnpm design:sync`, then `pnpm design:diff`. Change the
design in Claude Design, never here: this folder is a copy of the export.
