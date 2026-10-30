# design/export/

Put your Claude Design export here, unchanged, in the importer layout:

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

`design-sync.config.json` points `source` at `design/export/project`; set its `prefix` to the class prefix the
export's `bundle.css` uses (for example `ds-` when its classes read `.ds-button`). Then run `pnpm design:sync`.
To take a new version of the design: replace the export here, run `pnpm design:sync`, then `pnpm design:diff`.
Change the design in Claude Design, never here: this folder is a copy of the export.
