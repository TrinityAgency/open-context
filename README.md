# Open Context

354 standalone templates for Next.js, React and agent tooling, each installed with one command.

Browse, search and preview them at **[open-context.com](https://open-context.com)**; every command and option is explained at [open-context.com/cli](https://open-context.com/cli).

## Quick start

```bash
npx @trinity369/use <template>
```

## Commands

| Command | Does |
|---|---|
| `npx @trinity369/use <template>` | install a template into its default folder |
| `npx @trinity369/use <a> <b> ...` | install several templates in one run |
| `npx @trinity369/use search <words>` | find templates by slug, tag or description |
| `npx @trinity369/use info <template>` | description, type, files, dependencies, parts, proof |
| `npx @trinity369/use --list --category <NAME>` | list one category (`--type <type>` filters by type) |
| `--json` | the same data as one JSON document, for list, search and info |
| `--dry-run` | print what would be written, write nothing |
| `--dir <path>` | install into another folder |
| `--no-overwrite` | keep files that already exist |

## Templates (354)

### AGENTIC (40)

| Template | Type | Description |
|---|---|---|
| `agent-codemod` | agent | Automated codemod and migration agent |
| `agent-docs-writer` | agent | Documentation generation agent — reads code, produces structured docs with examples |
| `agent-ontologist` | agent | Data-model agent — owns every schema, migration, view, trigger and grant, and proves each law bites with a scratch-database battery and mutants |
| `agent-refactor` | agent | Automated code refactoring agent — identifies patterns, applies transformations, validates results |
| `agent-translator` | agent | Multi-language translation agent — context-aware translation with tone preservation and i18n support |
| `agentic-layer` | pipe | Production-ready Claude Code agentic layer with commands, skills, agents, and hooks — zero project-specific dependencies |
| `auth-seed` | skill | Autonomous auth composer -- discovers security requirements, selects auth modules, installs them, and wires the auth context + session management. Delivers a working authentication system. |
| `commerce-seed` | skill | Autonomous storefront composer — discovers business model, selects components, installs the purchase flow, and wires cart state + product types. Delivers a working e-commerce frontend. |
| `context-engineer` | skill | Inspect, diagnose, and optimize agent context for maximum signal density. Identifies context-bloat, context-rot, and context-overfit across three layers: static context files, context bundles, and knowledge graph. |
| `context-graph` | starter | Full-stack knowledge graph with hybrid search (vector + graph), RAG document ingestion, React visualization, and CLI + MCP integration. Powered by PostgreSQL + Apache AGE, Qdrant, Redis, and FastAPI. |
| `context-seed` | skill | Autonomous project seeder — reads a PRD, maps requirements to packages, installs them in dependency order, delegates design system composition to design-system-seed, and delivers a scaffolded project. |
| `dashboard-seed` | skill | Autonomous dashboard composer — discovers data model and user roles, selects widgets, installs layout + components, and wires navigation. Delivers a working dashboard shell with the right widgets for your domain. |
| `design-system-seed` | skill | Design system composition engine — maps brand identity to a cohesive design system from 12 atomic primitives. Generates install plan, brand overrides, and the glue layer that turns packages into one system. |
| `pipe-content-pipeline` | pipe | Content creation pipeline — multi-stage workflow for research, drafting, editing, and publishing content |
| `pipe-onboarding-automation` | pipe | Automated employee/user onboarding pipeline with configurable steps per role |
| `pipe-plan-build-review` | pipe | Full agentic pipeline: plan, build, review, fix. Each phase runs as a focused Claude agent with restricted tools and file visibility via .claudeignore. |
| `pipe-security-audit` | pipe | Security audit pipeline — OWASP checks, dependency scanning, secrets detection, and report generation |
| `prd-architect` | skill | Write and iterate on AI-optimized Product Requirements Documents with full lifecycle support |
| `prd-discovery` | skill | Product discovery skill — structured brainstorming sessions that produce PRD-ready discovery canvases. Phase-gated conversation with meta-cognitive monitoring, conversation excerpts, pre-decided client protocol, discovery off-ramp, and multi-PRD detection. |
| `site-seed` | skill | Skill that asks what a website is for, picks and installs the website kit starter that fits, then walks the owner through facts, language, design, legal text and release |
| `skill-accessibility` | skill | WCAG compliance and accessibility audit skill |
| `skill-api-design` | skill | REST and GraphQL API design best practices — resource modeling, versioning, error handling, pagination |
| `skill-copywriter` | skill | Content creation skill — SEO-aware copy, blog posts, headlines, marketing content |
| `skill-data-analysis` | skill | Data analysis skill — statistical analysis, data visualization, pattern recognition, reporting |
| `skill-database` | skill | Database ontologist skill — PostgreSQL schema as constitution: enums, named CHECKs, explicit FK policy, law-naming triggers, re-runnable migrations with grants, scratch-DB batteries proven by mutants, query and index patterns. Pairs with agent-ontologist. |
| `skill-design-system` | skill | Agent skill for building, maintaining, and iterating on design system components. Covers token management, component creation, Storybook stories, and documentation. |
| `skill-devops` | skill | Infrastructure and deployment skill |
| `skill-graph-engineering` | skill | Maintainer's skill for a Postgres + Apache AGE + Qdrant knowledge graph: rebuild-gate-flip projections, tokenizer-true chunking, bound Cypher, rank fusion, retrieval gates, AGE dialect traps |
| `skill-i18n` | skill | Internationalization and localization skill — next-intl, message extraction, RTL support, locale routing |
| `skill-legal-review` | skill | Legal review skill — contract analysis, clause identification, risk flagging, compliance checks |
| `skill-monitor` | skill | System and process monitoring skill |
| `skill-plan` | skill | Planning skill — analyze requirements, explore codebase, and produce structured implementation plans |
| `skill-prd-architect` | skill | Write and iterate on AI-optimized Product Requirements Documents with full lifecycle support |
| `skill-react-perf` | skill | React performance optimization and profiling — memoization, code splitting, bundle analysis, rendering patterns |
| `skill-review` | skill | Automated code review with risk tiers and checklist |
| `skill-security` | skill | Security review skill — OWASP checklist, auth patterns, input validation |
| `skill-seo` | skill | Technical SEO audit and optimization skill — meta tags, structured data, Core Web Vitals, Open Graph |
| `skill-testing` | skill | Testing skill — Vitest patterns, Playwright E2E, coverage strategies, and test best practices |
| `swarm-layer` | pipe | Thermodynamic field coordination: task fields, agent spawning, autonomous hooks, context bundles, PRD intake. Requires agentic-layer template and PostgreSQL. |
| `swarm-sdk` | pipe | TypeScript Agent SDK worker for thermodynamic field coordination. Includes billing switch, PRD intake, eventbus, and context bundles. Requires swarm-layer template. |

### ANIMATION (16)

| Template | Type | Description |
|---|---|---|
| `animation-3d-card-tilt` | animation | 3D card tilt effect — interactive perspective transform on mouse hover with glare highlight |
| `animation-confetti` | animation | Canvas-based confetti particle celebration animation. Fire confetti bursts on demand with configurable colors, particle count, spread, and gravity. |
| `animation-cursor-follow` | animation | Cursor-following elements with spring physics. Wrap any content to make it magnetically track the mouse pointer with configurable spring stiffness and damping. |
| `animation-liquid-button` | animation | Liquid morphing button with SVG turbulence-driven distortion on hover. Supports primary, secondary, and ghost variants with configurable intensity. |
| `animation-magnetic-button` | animation | Button that magnetically attracts toward the cursor when hovering nearby. Uses spring physics for natural-feeling attraction and release. |
| `animation-noise-grain` | animation | Film grain and noise overlay effect using HTML Canvas |
| `animation-number-counter` | animation | Animated number counting with easing — counts from start to end value with configurable duration, formatting, and viewport trigger |
| `animation-page-transition` | animation | Page transition wrapper with multiple animation presets -- fade, slide, scale, and flip. Drop-in wrapper for route transitions in React apps. |
| `animation-scroll-reveal` | animation | Scroll-triggered reveal animations with multiple presets — fade up, slide in, scale, blur, and stagger groups. Uses Intersection Observer for performance. |
| `animation-skeleton-loading` | animation | Skeleton loading placeholders with shimmer animation. Includes presets for text, avatar, card, and table rows — plus a custom skeleton builder. |
| `animation-text-reveal` | animation | Character and word staggered text reveal animation with multiple presets — fade, blur, scale, and rotate effects |
| `animation-typing-effect` | animation | Typewriter text animation with blinking cursor. Supports multiple strings, configurable typing/deleting speed, pause duration, and loop control. |
| `animation-webgl-background` | animation | Interactive WebGL shader background with animated gradients |
| `hex-grid` | utility | Hexagonal grid with cube coordinates, both orientations, hit testing, rings, spirals, line drawing, and smart cover/resize. Derived from IVM principles. |
| `ivm-grid` | utility | IVM (Isotropic Vector Matrix) triangle tessellation with tri-cube coordinates, D3 symmetry, cover/resize, and hit testing. The mathematical foundation for hexagonal and other grids. |
| `trinity-signature` | component | Animated triangle signature easter-egg for client sites |

### AUTH (29)

| Template | Type | Description |
|---|---|---|
| `auth-2fa-setup` | module | 2FA setup flow — QR scan, recovery codes, and verification |
| `auth-age-verification` | component | Age verification gate with date picker and localStorage persistence |
| `auth-api-key-manager` | component | API key management UI — create keys with scoped permissions, copy to clipboard, rotate, and revoke with confirmation |
| `auth-audit-log` | component | Authentication audit log viewer — filterable event timeline with user details, IP addresses, and risk indicators |
| `auth-biometric` | component | Biometric authentication UI using WebAuthn API with fingerprint/face recognition |
| `auth-connected-accounts` | component | OAuth provider management settings panel with connect/disconnect, lockout protection, and connection timestamps |
| `auth-consent-screen` | page | OAuth authorization consent screen with scope display and risk indicators |
| `auth-device-trust` | component | Trusted devices list with browser, OS, location info and device revocation |
| `auth-email-verification` | module | Email verification flow with resend countdown, optional code input, expiry timer, and success/expired states |
| `auth-impersonation-banner` | component | Sticky admin impersonation banner with user info and stop button |
| `auth-invite-flow` | module | Team member invitation flow — bulk email invite with role selection, pending invites list, and resend/revoke actions |
| `auth-ip-allowlist` | component | IP allowlist management with CIDR validation, per-entry toggles, and enforcement control |
| `auth-lockout-screen` | page | Account locked page after too many failed login attempts with countdown timer, animated lock icon, and alternative unlock methods |
| `auth-login-form` | component | Centered card login form with email, password, show/hide toggle, remember me, and OAuth buttons |
| `auth-magic-link` | module | Passwordless magic link sign-in flow with email entry, check-email confirmation, resend countdown, and expired link handling |
| `auth-mfa-recovery` | component | MFA recovery codes display with copy, download, print, and regenerate actions |
| `auth-oauth-buttons` | component | Branded Google, Apple, GitHub, and Microsoft OAuth sign-in buttons with loading states and multiple variants |
| `auth-onboarding` | module | Multi-step onboarding wizard with progress bar -- welcome, profile setup, preferences, and completion |
| `auth-org-switcher` | component | Organization and workspace switcher dropdown with search, avatars, and create new org option |
| `auth-passkey-webauthn` | module | WebAuthn passkey registration and login — fingerprint, face ID, and security key support with fallback options |
| `auth-password-change` | component | In-app password change form with current password verification, strength meter, and confirmation |
| `auth-password-reset` | module | Multi-step password reset flow — email request, 6-digit code verification, new password with requirements checklist |
| `auth-profile-security` | page | Security settings dashboard with password status, 2FA setup, active sessions, trusted devices, and recent security events |
| `auth-rate-limit-ui` | component | Rate limiting feedback component with attempt counter, countdown timer, and progressive warnings |
| `auth-rbac-permissions` | module | Role and permission management with interactive matrix editor, role creation dialog, and delete confirmation |
| `auth-session-manager` | component | Active sessions list with device info, last active time, and revoke controls |
| `auth-signup-form` | component | Registration form with validation, password strength meter, terms checkbox, and OAuth buttons |
| `auth-sso-saml` | module | SAML SSO integration module for enterprise Next.js applications |
| `auth-team-roles` | component | Team member management with role badges, role change dropdown, member removal, search/filter, and pending invites section |

### BENTO (4)

| Template | Type | Description |
|---|---|---|
| `bento-features` | component | Visual feature showcase in bento grid layout with badges and configurable spans |
| `bento-grid-base` | component | Configurable bento grid layout with CSS grid — base component for bento-style sections |
| `bento-saas` | component | SaaS landing page bento grid with hero, features, integrations, testimonial, and stats cards |
| `bento-stats` | component | Dashboard-style metrics in bento grid layout with trend indicators and badges |

### BLOG (13)

| Template | Type | Description |
|---|---|---|
| `blog-author-page` | page | Author page: name, portrait, bio, website link and that author's posts |
| `blog-card` | component | Post preview card: image, category, title link, excerpt, date, reading time and authors, as a server component |
| `blog-category-page` | page | Blog category page: that category's posts with its description and static pagination |
| `blog-comments-giscus` | component | Blog comments powered by GitHub Discussions via Giscus — zero database needed |
| `blog-content` | utility | Typed post collection from MDX files: validated front matter, authors and categories, drafts and scheduled posts hidden, headings and reading time |
| `blog-index-page` | page | Blog listing: post cards with a category filter and static pagination, from MDX files |
| `blog-newsletter-cta` | component | Newsletter signup, inline or sticky: a form on a server action with validation and a honeypot; double opt-in stays with the provider |
| `blog-post-page` | page | Blog post: MDX body, table of contents, reading progress, related posts, share links, breadcrumbs and Article data |
| `blog-reading-mode` | component | Distraction-free reading mode toggle — hides nav, widens content, adjusts typography |
| `blog-rss-sitemap` | utility | RSS 2.0 and Atom feeds and sitemap entries for blog posts, as pure functions for route handlers |
| `blog-search-results` | page | Blog search results page with query highlighting, filters, and pagination |
| `blog-share-buttons` | component | Share links for X, LinkedIn, Facebook, Bluesky, WhatsApp and email, plus native share and copy link where the browser has them; no third-party script |
| `blog-tag-cloud` | component | Interactive tag cloud with weighted sizing, color scaling, and staggered animations |

### COMPONENTS (32)

| Template | Type | Description |
|---|---|---|
| `component-accordion` | component | Disclosure list on native details, keyboard complete without JavaScript |
| `component-barcode-scanner` | component | Camera-based barcode and QR code scanner using BarcodeDetector API |
| `component-breadcrumbs` | component | Breadcrumb trail with overflow that emits its BreadcrumbList data |
| `component-code-block` | component | Syntax-highlighted code block with copy button, line numbers, and language badge |
| `component-color-picker` | component | HSL/RGB color picker with saturation canvas, presets, and EyeDropper API |
| `component-command-palette` | component | Cmd+K command palette with search, keyboard navigation, grouped results, and shortcut display |
| `component-copy-button` | component | Click-to-copy button with animated checkmark confirmation |
| `component-countdown-timer` | component | Countdown timer with days, hours, minutes, seconds — supports target date and duration modes |
| `component-diff-viewer` | component | Side-by-side and inline text diff viewer with built-in diff algorithm |
| `component-emoji-picker` | component | Emoji picker with search, categories, recent emojis, and keyboard navigation |
| `component-form-builder` | module | Multi-step form system with per-step Zod validation, field type rendering, and step progress indicator |
| `component-image-cropper` | component | Image crop and resize with aspect ratio presets, zoom, and rotation controls |
| `component-markdown-preview` | component | Live markdown editor with split preview pane and built-in parser |
| `component-modal-system` | module | Dialog, drawer and alert dialog on native dialog, with focus returned on close |
| `component-pagination` | component | Page links from page, page count and an href function, with the pure page-window function |
| `component-qr-code` | component | QR code generator component with Canvas rendering |
| `component-signature-pad` | component | Digital signature drawing pad with undo, clear, and PNG/SVG export |
| `component-slider-range` | component | Single and dual-handle range slider with tooltips, marks, and keyboard navigation |
| `component-star-rating` | component | Interactive star rating with half-star support, hover preview, and accessible keyboard navigation |
| `component-stepper` | component | Step progress indicator with labels, validation states, and click navigation |
| `component-tabs-system` | component | Tabs with roving focus and optional URL sync |
| `component-tag-input` | component | Tag input with autocomplete suggestions, validation, and keyboard navigation |
| `component-timeline` | component | Vertical timeline with alternating layout, icons, and scroll animations |
| `component-toast-notifications` | component | Stacked toast system with success/error/warning/info variants, auto-dismiss, and pause on hover |
| `component-tree-view` | component | Expandable tree view with checkboxes, lazy loading, search, and keyboard navigation |
| `shop-cart` | component | Shopping cart sheet with quantity controls, order summary, localStorage persistence, and empty state. shadcn/ui + Tailwind. |
| `shop-category-nav` | component | Hierarchical category sidebar with accordion tree, breadcrumbs, count badges, and mobile sheet |
| `shop-checkout` | page | Multi-step checkout flow with shipping, payment, review, and confirmation steps |
| `shop-product-detail` | page | Product detail page with image gallery, variant selectors, rating, tabs for description/reviews/specs. shadcn/ui + Tailwind. |
| `shop-product-grid` | component | Responsive product card grid with image, price, rating, sale badges, add-to-cart, and grid/list toggle |
| `shop-search-filters` | component | Product search with faceted filters: price range, category checkboxes, color swatches, sort dropdown, and active filter badges. shadcn/ui + Tailwind. |
| `shop-wishlist` | component | Wishlist grid with heart toggle, move-to-cart, share list, localStorage persistence, and empty state. shadcn/ui + Tailwind. |

### CRM (12)

| Template | Type | Description |
|---|---|---|
| `crm-ai-assistant` | module | AI-powered CRM assistant with deal analysis, insights, and chat interface |
| `crm-commission-calculator` | component | Sales commission calculator with configurable tier rules and visual breakdown |
| `crm-company-page` | page | Company detail page with header, contacts list, deal history, and activity timeline |
| `crm-custom-fields` | module | Custom field system for CRM — define, configure, and render dynamic fields on contacts and deals |
| `crm-dashboard-overview` | page | CRM overview dashboard with KPI cards, pipeline summary, recent activities, and revenue chart |
| `crm-email-integration` | module | CRM email integration — compose, send, receive, and thread emails linked to contacts and deals |
| `crm-import-export` | utility | CSV import and export utilities for CRM contacts and deals — parse, validate, transform, and download |
| `crm-notes-system` | component | Rich text notes with @mentions, timestamps, and author attribution — for contacts, deals, and companies |
| `crm-reporting-charts` | page | Sales reporting dashboard with pipeline funnel, revenue trends, win/loss analysis, and activity breakdown charts |
| `crm-sales-forecast` | component | Sales forecasting widget with pipeline probability weighting, monthly projections, and confidence bands |
| `crm-task-manager` | module | CRM task management — create, assign, and track tasks with due dates, priorities, and contact/deal linking |
| `crm-territory-map` | module | Sales territory map with Mapbox GL, assignment management, and quota tracking |

### DASHBOARD (22)

| Template | Type | Description |
|---|---|---|
| `dashboard-activity-feed` | component | Timestamped activity timeline with avatars, action types, and entity links |
| `dashboard-calendar` | component | Interactive calendar with month/week/day views, event display, navigation, today indicator, and click callbacks. shadcn/ui + Tailwind. |
| `dashboard-charts` | component | Area, bar, line, and donut chart components wrapped in shadcn Cards. Powered by recharts. |
| `dashboard-data-table` | component | Generic data table with sorting, filtering, pagination, row selection, and column visibility. TanStack Table + shadcn/ui. |
| `dashboard-feature-flags` | component | Feature flag management dashboard with toggle switches, environment badges, targeting rules, search, and delete confirmation. LaunchDarkly-style. |
| `dashboard-file-browser` | component | File and folder browser with breadcrumbs, grid/list views, and file type icons |
| `dashboard-gantt-chart` | component | Project timeline Gantt chart with task groups, progress bars, dependency arrows, today marker, and day/week/month views. Pure React + SVG, no external chart library. |
| `dashboard-heatmap` | component | Data heatmap with grid, calendar (GitHub-style), and correlation matrix variants. Color-scaled cells, tooltips, legends, and summary stats. |
| `dashboard-kanban` | component | Kanban board with drag-and-drop cards, priority badges, assignee avatars, column management, and horizontal scroll. shadcn/ui + Tailwind. |
| `dashboard-kpi-cards` | component | KPI stat cards with trend indicators, percentage change, and optional sparkline mini-charts |
| `dashboard-logs-viewer` | component | Real-time log viewer with level filtering, text search, auto-scroll, and timestamp formatting |
| `dashboard-map-visualization` | component | Geographic data visualization with SVG world map, interactive markers, choropleth regions, tooltips, and stats panel. Zero external map dependencies. |
| `dashboard-notification-center` | component | Bell icon popover with unread badge, notification list with tabs (all/unread), mark as read, and empty state. shadcn/ui + Tailwind. |
| `dashboard-onboarding-wizard` | module | Multi-step onboarding wizard with progress bar, profile setup, preferences, team invite, and completion summary. Self-contained React page. |
| `dashboard-realtime-websocket` | component | Real-time dashboard with WebSocket simulation, live KPI cards, event feed, and sparkline charts. Plug in your own WebSocket endpoint for production. |
| `dashboard-resource-scheduler` | module | Resource scheduling grid with drag-and-drop block assignment, day/week views, capacity tracking, and time navigation. HTML5 native DnD, no external dependencies. |
| `dashboard-search-global` | component | Cmd+K global search dialog with recent searches, categorized results (pages/users/actions), and keyboard navigation. shadcn/ui + Tailwind. |
| `dashboard-settings-page` | page | Settings page with profile, appearance, notifications, and security tabs |
| `dashboard-shell` | layout | Responsive dashboard layout shell with collapsible sidebar, topbar, breadcrumbs, and global search. shadcn/ui + Tailwind. |
| `dashboard-sidebar-nav` | component | Collapsible sidebar navigation with grouped sections, badges, sub-items, tooltips when collapsed, and mobile sheet. shadcn/ui + Tailwind. |
| `dashboard-user-menu` | component | Avatar dropdown menu with profile, settings, theme switcher, and logout |
| `shop-order-history` | page | Order history page with status badges, expandable row details, re-order action, date filtering, and pagination. shadcn/ui + Tailwind. |

### DATA_DISPLAY (10)

| Template | Type | Description |
|---|---|---|
| `data-card-grid` | component | Responsive card grid with optional masonry layout — adapts from 1 to 4 columns |
| `data-comparison-table` | component | Side-by-side comparison table with sticky headers and highlighted differences |
| `data-json-viewer` | component | Collapsible JSON tree viewer with syntax coloring, search, and copy support |
| `data-list-infinite-scroll` | component | Virtualized infinite scroll list — loads more items as you scroll with intersection observer |
| `data-stats-dashboard` | component | Statistics dashboard with animated counters, trend indicators, and sparkline-style bars |
| `data-table-editable` | component | Inline-editable table cells — click to edit with validation and save callbacks |
| `data-table-expandable` | component | Table with expandable row details — click to reveal nested content per row |
| `data-table-virtual` | component | Virtualized table for large datasets — renders only visible rows for 60fps scrolling |
| `data-timeline-vertical` | component | Chronological vertical timeline with category filtering and alternating layout |
| `data-tree-table` | component | Hierarchical tree table with expand/collapse — nested rows with indentation and toggle controls |

### DESIGN_SYSTEM (12)

| Template | Type | Description |
|---|---|---|
| `design-accessibility-primitives` | design-system | Accessibility primitives: focus rings, skip links, screen reader utilities, focus traps, and reduced motion support. CSS utilities plus React components. |
| `design-animation-library` | design-system | Reusable animation primitives built on framer-motion. Includes AnimateIn, AnimatePresence wrapper, staggered children, and animation presets. |
| `design-color-system` | design-system | Semantic color palette with CSS custom properties, dark mode support, and contrast utilities. Built on shadcn/ui HSL color system. |
| `design-component-docs-template` | document | Template and guide for documenting design system components. Includes a fillable component doc template and a writing guide with examples. |
| `design-icon-set` | design-system | SVG icon system with a polymorphic Icon component, size variants, and tree-shakeable icon definitions. 24 essential icons included. |
| `design-motion-tokens` | design-system | Duration, easing, and spring animation presets as CSS custom properties. Includes reduced-motion support and Tailwind integration. |
| `design-responsive-breakpoints` | design-system | Breakpoint system with container queries, responsive utility mixins, and mobile-first media queries. Includes Tailwind integration. |
| `design-shadow-system` | design-system | Elevation shadow tokens from xs to 2xl with colored shadow variants and dark mode support. CSS custom properties with Tailwind integration. |
| `design-spacing-grid` | design-system | 4px/8px base grid spacing system with CSS custom properties, layout utilities, and gap classes. Drop-in foundation for consistent spatial rhythm. |
| `design-theme-switcher` | component | Light/dark/system theme toggle with React context, localStorage persistence, and CSS variable switching. Zero dependencies beyond React. |
| `design-tokens` | design-system | Design token system with CSS custom properties — colors, typography, spacing, radius, shadows. Uses shadcn/ui defaults as a starting point. |
| `design-typography-scale` | design-system | Fluid type scale with prose styles, heading hierarchy, and font stack definitions. Works with any font — system defaults included. |

### DEVOPS (14)

| Template | Type | Description |
|---|---|---|
| `config-backup-script` | config | Database and file backup scripts with rotation, encryption, S3 upload, and webhook notifications. Supports PostgreSQL and MySQL. |
| `config-docker-compose-fullstack` | config | Full-stack Docker Compose — app, PostgreSQL, Redis, and Traefik reverse proxy with SSL |
| `config-docker-next` | config | Production Docker setup for Next.js — multi-stage build, standalone output, and compose orchestration |
| `config-eslint-prettier` | config | ESLint flat config + Prettier — TypeScript, React, import sorting, and consistent formatting |
| `config-github-actions` | config | GitHub Actions workflows — CI pipeline (lint, typecheck, test), deploy, and release automation |
| `config-github-pr-template` | config | GitHub PR and issue templates with review checklists, CODEOWNERS, and structured workflows |
| `config-k8s-deployment` | config | Production-ready Kubernetes manifests -- Deployment, Service, Ingress, HPA, ConfigMap with security best practices and cert-manager TLS. |
| `config-monitoring-grafana` | config | Grafana dashboards + Prometheus config — app overview, node metrics, alert rules, and Docker Compose monitoring stack. |
| `config-nginx-reverse-proxy` | config | Production Nginx reverse proxy — SSL termination, rate limiting, caching, and security headers |
| `config-playwright-e2e` | config | Playwright E2E test setup with page object model, fixtures, and parallel execution |
| `config-terraform-hetzner` | config | Terraform config for Hetzner Cloud infrastructure -- servers, networks, firewalls, and volumes |
| `config-turbo-monorepo` | config | Turborepo monorepo scaffold — workspace structure, shared packages, and optimized pipeline |
| `config-vitest-setup` | config | Vitest unit test config with MSW mocks, React Testing Library, coverage, and factory helpers |
| `scraper-bun-hono` | starter | Self-hosted web scraper starter with Bun, Hono and Postgres: content cache, per-domain policy learning and a bundled Claude skill; grows into a tiered fetch cascade (headless browser, proxy rotation, hosted fallback) |

### EMAIL (14)

| Template | Type | Description |
|---|---|---|
| `email-abandoned-cart` | email | E-commerce abandoned cart recovery email with product listing, order summary, and urgency CTA. Built with React Email. |
| `email-feature-announcement` | email | New feature announcement email with screenshot showcase, highlight cards, and CTA. Built with React Email. |
| `email-payment-failed` | email | Payment failure notification with payment details card, retry schedule, and update payment CTA. Built with React Email. |
| `email-product-launch` | email | Product launch announcement email with feature highlights, social proof, pricing teaser, and early-bird CTA. Built with React Email. |
| `email-referral-program` | email | Referral program invitation email with discount offer, referral code, how-it-works steps, and social proof. Built with React Email. |
| `email-team-invite` | email | Team invitation email with inviter details, team info card, role badge, accept/decline actions. Built with React Email. |
| `email-trial-ending` | email | Trial expiration warning email with urgency badge, feature loss list, pricing card, and upgrade CTA. Built with React Email. |
| `email-verification` | email | Email verification transactional template with confirmation button, fallback URL, and expiration notice. Built with React Email. |
| `email-weekly-digest` | email | Weekly activity digest with stats grid, change indicators, activity feed, and key insights. Built with React Email. |
| `mail-client` | integration | Provider-agnostic sendMail() client with a durable outbox (retry and dead-letter), idempotency, plain-text generation, rate-limit and consent guards, and a console driver for development |
| `mail-dns` | config | DNS records for sending domains: generates copy-paste SPF, DKIM, DMARC and bounce records and verifies that each one is published and aligned |
| `mail-templates` | email | React Email transactional templates (verify, password reset, magic link, welcome, receipt, notification) with a preheader-aware base layout, German-first copy with English fallback, and HTML plus plain-text rendering |
| `mail-tresor` | config | Environment schema fragment for mail settings: every key declared with risk level, rotation policy, validation and a secret flag, plus an example env file |
| `mail-webhook` | integration | Signature-verified webhook receivers for delivery events and bounces, with an append-only event log, a suppression list checked before sending, and encrypted, erasable body retention |

### FORMS (10)

| Template | Type | Description |
|---|---|---|
| `form-address-autocomplete` | component | Address form with autocomplete suggestions and map preview placeholder |
| `form-array-fields` | component | Dynamic repeatable field groups with add, remove, and reorder controls |
| `form-autosave-draft` | utility | Form autosave hook with draft recovery, conflict detection, and debounced localStorage persistence |
| `form-checkout` | module | Multi-step checkout form with shipping, payment, and review steps |
| `form-conditional-logic` | component | Form fields with conditional show/hide rules, supporting AND/OR logic |
| `form-credit-card` | component | Credit card input with auto-formatting, card type detection, and visual preview |
| `form-inline-edit` | component | Click-to-edit inline form fields with save/cancel, validation, and async support |
| `form-phone-input` | component | International phone input with country code picker and auto-formatting |
| `form-survey-builder` | module | Dynamic survey form builder with multiple question types and live preview |
| `form-wizard-multistep` | module | Reusable multi-step form wizard with per-step Zod validation and progress tracking |

### INTEGRATION (12)

| Template | Type | Description |
|---|---|---|
| `integration-ai-openai` | integration | OpenAI integration with chat completions, streaming, embeddings, and structured output. Uses official SDK. |
| `integration-analytics-posthog` | integration | PostHog event tracking, user identification, and feature flags for Next.js |
| `integration-blockchain-wallet` | integration | Web3 wallet connection and transaction signing with ethers.js |
| `integration-email-sendgrid` | integration | SendGrid email sending with dynamic templates and batch support |
| `integration-maps-mapbox` | integration | Mapbox GL interactive map with markers, popups, fly-to animations, and fit-bounds. Includes React component and standalone utilities. |
| `integration-ocr-tesseract` | integration | Tesseract.js OCR integration — text extraction from images with bounding boxes, structured output, language detection, batch processing, and worker pool. |
| `integration-payments-lemon-squeezy` | integration | Lemon Squeezy payment integration with checkout, subscription management, and webhook verification. |
| `integration-pdf-generation` | integration | Server-side PDF generation with Puppeteer — HTML-to-PDF, URL-to-PDF, invoice and report templates, merge, and watermark. |
| `integration-push-notifications` | integration | Web push notifications with service worker, VAPID auth, and React hook |
| `integration-search-algolia` | integration | Algolia instant search with autocomplete, React components, and Tailwind styling |
| `integration-sms-twilio` | integration | Twilio SMS integration — send/receive messages, bulk SMS, delivery status, phone validation, and webhook handling with signature verification. |
| `integration-video-mux` | integration | Mux video integration with direct uploads, asset management, and React player component. |

### PDF (10)

| Template | Type | Description |
|---|---|---|
| `pdf-certificate` | document | Elegant certificate of completion/achievement PDF with decorative borders and signature field — powered by @react-pdf/renderer |
| `pdf-contract` | document | Service contract PDF with numbered clauses, payment terms, and signature blocks — powered by @react-pdf/renderer |
| `pdf-cover-letter` | document | Professional cover letter PDF with applicant info, body paragraphs, and signature — powered by @react-pdf/renderer |
| `pdf-data-export` | document | Tabular data export to formatted PDF with auto-pagination and summary — powered by @react-pdf/renderer |
| `pdf-invoice-template` | document | Professional invoice PDF with line items, tax calculation, and payment details — powered by @react-pdf/renderer |
| `pdf-nda` | document | Non-Disclosure Agreement PDF with numbered articles, party details, and signature blocks — powered by @react-pdf/renderer |
| `pdf-proposal` | document | Business proposal PDF with scope, deliverables, pricing table, and timeline — powered by @react-pdf/renderer |
| `pdf-receipt` | document | Payment receipt PDF with transaction details, PAID stamp, and payment method — powered by @react-pdf/renderer |
| `pdf-report-branded` | document | Branded PDF report with header, footer, tables, and bar charts — powered by @react-pdf/renderer |
| `pdf-resume` | document | Professional resume/CV PDF with experience, education, skills sections — ATS-friendly, powered by @react-pdf/renderer |

### PRICING (10)

| Template | Type | Description |
|---|---|---|
| `pricing-billing-toggle` | component | Monthly/annual billing switch with savings percentage badge |
| `pricing-calculator` | component | Usage-based pricing calculator with slider and tier breakdown |
| `pricing-cards` | component | 2-4 tier pricing cards with highlighted recommended plan |
| `pricing-comparison-table` | component | Full feature comparison matrix across pricing plans |
| `pricing-enterprise-cta` | component | Enterprise contact sales CTA section with feature highlights |
| `pricing-faq` | component | Pricing FAQ accordion section with smooth expand/collapse animation |
| `pricing-plan-badge` | component | Current plan badge with upgrade indicator |
| `pricing-quota-warning` | component | Approaching quota warning banner with dismiss and upgrade actions |
| `pricing-upgrade-modal` | component | Plan upgrade modal with feature comparison |
| `pricing-usage-meter` | component | Usage meter with quota bar and overage warning |

### PRIMITIVES (12)

| Template | Type | Description |
|---|---|---|
| `primitive-alert` | component | Alert banner with info/success/warning/error variants and optional dismiss button |
| `primitive-avatar` | component | Avatar with image, fallback initials, status dot, and group stacking |
| `primitive-badge` | component | Badge/chip with color variants (default/success/warning/info/destructive) and dot indicator |
| `primitive-button` | component | Button with variants (default/destructive/outline/ghost/link), sizes, and loading state |
| `primitive-card` | component | Card container with header, body, and footer slots — plus interactive hover variant |
| `primitive-dropdown` | component | Dropdown menu with items, separators, labels, icon slots, and destructive variant |
| `primitive-input` | component | Input field with optional leading/trailing icon, error state, and helper text |
| `primitive-modal` | component | Modal dialog with size variants (sm/default/lg/xl/full), header, body, footer slots and built-in close button |
| `primitive-separator` | component | Horizontal or vertical separator — plus LabeledSeparator with centered text |
| `primitive-skeleton` | component | Skeleton loader — base Skeleton plus SkeletonText, SkeletonCard, SkeletonArticle, SkeletonTableRow presets |
| `primitive-spinner` | component | Loading spinner with size (xs/sm/default/lg/xl) and color variants |
| `primitive-tooltip` | component | Tooltip with configurable placement and delay — convenience wrapper + low-level exports |

### SECTIONS (8)

| Template | Type | Description |
|---|---|---|
| `section-cta` | component | Call-to-action band with a title, a line of text and its links |
| `section-faq` | component | FAQ section on native details: questions open in place, keyboard complete without JavaScript |
| `section-features` | component | Features section: a grid or alternating rows of items with icon, text and image |
| `section-hero` | component | Hero section: title, lead, calls to action and an optional image, as a server component with typed content |
| `section-logo-cloud` | component | Logo cloud: a row of client or partner logos, optionally linked |
| `section-pricing` | component | Pricing section: plans with prices from minor units, a no-JavaScript interval switch and a highlighted plan |
| `section-stats` | component | Stats section: key figures as a description list |
| `section-testimonials` | component | Testimonials section: quotes with name, role and portrait |

### SIDEBAR (4)

| Template | Type | Description |
|---|---|---|
| `sidebar-dashboard` | layout | Collapsible app sidebar with nav groups, icons, badge counts, and user menu |
| `sidebar-docs` | layout | Documentation tree sidebar with nested sections, expand/collapse, and search |
| `sidebar-mobile` | layout | Slide-out mobile drawer sidebar with overlay and close button |
| `sidebar-settings` | layout | Settings panel sidebar with grouped section links and active highlight |

### STARTER (19)

| Template | Type | Description |
|---|---|---|
| `site-starter` | starter | Lean company website skeleton: Next 16, React 19, Tailwind 4 without preflight, strict TypeScript, design-sync from a Claude Design export, English with a German switch, guard tests and AGENTS.md |
| `starter-admin-panel` | starter | Admin panel starter with RBAC, audit log, Cmd+K search, CRUD data tables, forms, auth, and PostgreSQL. Next.js 14, shadcn/ui, TanStack Table, Recharts. |
| `starter-blog` | starter | Blog with MDX posts, authors, categories, RSS and Atom feeds, newsletter signup, cookie consent, SEO, legal and error pages, assembled from the website kit |
| `starter-booking-system` | starter | Appointment booking system with calendar view and availability management |
| `starter-course-platform` | starter | Online course platform with lessons and progress |
| `starter-event-platform` | starter | Next.js 14 event platform starter with event listings, speaker profiles, ticket tiers, schedule timeline, and countdown timer. Purple/violet theme. TypeScript, Tailwind CSS, App Router. |
| `starter-gym-fitness` | starter | Next.js 14 gym and fitness starter with class schedule, membership plans, trainer profiles, and testimonials. Dark theme with orange accents. TypeScript, Tailwind CSS, App Router. |
| `starter-healthcare-portal` | starter | Next.js 14 healthcare patient portal with appointments, health records, doctor profiles, multi-step booking, and department directory. Teal/cyan theme. TypeScript, Tailwind CSS, App Router. |
| `starter-inventory` | starter | Inventory management with products and stock tracking |
| `starter-job-board` | starter | Next.js 14 job board starter with job listings, search filters, company profiles, application forms, and employer posting. Blue/indigo theme. TypeScript, Tailwind CSS, App Router. |
| `starter-landing-page` | starter | Company landing page assembled from the website kit: header, footer, cookie consent, SEO, eight sections, legal and error pages, with guard tests |
| `starter-marketplace` | starter | Two-sided marketplace with listings and profiles |
| `starter-portfolio` | starter | Portfolio site assembled from the website kit: projects from MDX files with disciplines, services, about, contact form, MDX blog with feeds, cookie consent, SEO, legal and error pages |
| `starter-project-management` | starter | Project management with tasks, boards, and timelines |
| `starter-real-estate` | starter | Next.js 14 real estate starter with property listings, search filters, neighborhoods, agent profiles, and contact form. TypeScript, Tailwind CSS, App Router. |
| `starter-restaurant` | starter | Next.js 14 restaurant starter with menu, reservations, chef team, and testimonials. TypeScript, Tailwind CSS, App Router, shadcn/ui theming. |
| `starter-saas-minimal` | starter | Next.js 14 SaaS + Shop starter with shadcn/ui, dashboard shell, product catalog, cart, and checkout. TypeScript, Tailwind CSS, App Router. |
| `starter-social-network` | starter | Social network with feeds, profiles, and messaging |
| `starter-website` | starter | Company website assembled from the website kit: home, features, pricing, about, contact form, changelog, MDX blog with feeds, cookie consent, SEO, legal and error pages |

### STORAGE (13)

| Template | Type | Description |
|---|---|---|
| `booking-availability` | utility | Free appointment slots from working hours, busy footprints, buffers and travel time between zones — pure TypeScript, time-zone and DST correct, multi-resource, never throws. |
| `booking-cancellation` | utility | Whether a booking can still be cancelled and the exact late fee — free-until window, basis-point fees rounded half up, customer vs business, pure TypeScript. |
| `booking-manage-link` | module | Account-free manage links for bookings — random 256-bit token, only its SHA-256 stored, constant-time check, one answer for expired/revoked/tampered/unknown; storage as callbacks, node:crypto only. |
| `booking-schema` | module | PostgreSQL 16 booking schema that refuses every conflict itself: no double booking (buffers, multi-resource), travel time between visits, request holds with deadlines, consented notes with retention, hashed manage links. Ships its own law battery. |
| `booking-service-area` | utility | Which service zone an address falls in, or outside — postcode exact/prefix/range, accent-free locality, optional radius and polygon matchers; pure TypeScript, no network. |
| `storage-avatar-upload` | component | Avatar upload with crop, resize, and preview |
| `storage-bulk-upload` | component | Multi-file bulk upload with queue management |
| `storage-download-manager` | component | File download manager with progress and resume |
| `storage-file-manager` | module | File manager with grid/list views and context menu |
| `storage-image-gallery` | component | Image gallery with lightbox and lazy loading |
| `storage-media-library` | module | Media library with categories, search, and metadata |
| `storage-s3-browser` | module | S3-compatible bucket browser with upload and preview |
| `thumbnail-generator` | pipe | AI thumbnail generation with Reve + Flux backends, IVM overlay system, dashboard UI, and self-adapting Claude Code skill |

### SUPPORT (9)

| Template | Type | Description |
|---|---|---|
| `chatbot-api` | module | Express chat API with SSE streaming, Anthropic Claude, API key auth, origin guard, rate limiting, and escalation |
| `chatbot-context` | module | Dynamic context assembly engine with pluggable modules and token budgeting |
| `chatbot-db` | module | PostgreSQL schema and repository for chatbot conversations with Prisma + raw SQL options |
| `chatbot-widget` | module | Drop-in React chat widget with SSE streaming, session persistence, and human escalation |
| `support-csat-survey` | component | Customer satisfaction survey with emoji rating |
| `support-feedback-widget` | component | In-app feedback widget with screenshot and mood |
| `support-knowledge-base` | module | Knowledge base with articles, search, and categories |
| `support-nps-survey` | component | Net Promoter Score survey with follow-up |
| `support-status-page` | page | Service status page with incident history |

### WEB_DESIGN (29)

| Template | Type | Description |
|---|---|---|
| `page-404-error` | page | Not-found and error pages with a way onward: views plus two one-line route files |
| `page-about` | page | About page: story, values, figures and team |
| `page-app-download` | page | Mobile app download page with store badges, phone mockup, features grid, screenshot gallery, and QR code section |
| `page-careers` | page | Job listings page with filters and apply flow |
| `page-case-study` | page | Case study template with problem, solution, results |
| `page-changelog` | page | Changelog page: releases from a typed list with version badges, dates and anchor links |
| `page-coming-soon` | page | Coming soon page with countdown timer, email capture form, and social links. Dark gradient background with flip-style countdown animation. |
| `page-contact` | page | Contact page: a form with a server action, spam traps and validation, contact details and a map link |
| `page-event-landing` | page | Event landing page with speakers, schedule, pricing tiers, and sponsor sections |
| `page-faq` | page | FAQ page with categories and search |
| `page-features` | page | Features page: feature groups with icon, text and image, then a call to action |
| `page-landing-full` | page | Full landing page: hero, logos, features, figures, testimonials, pricing, questions and a call to action |
| `page-landing-hero` | page | Short landing page: hero, features and a call to action, assembled from the kit's sections |
| `page-legal-imprint` | page | Imprint page: provider identification fields for German and Austrian sites, as marked placeholders |
| `page-legal-privacy` | page | Privacy policy page: table of contents, short summaries and clearly marked placeholders |
| `page-legal-terms` | page | Terms page: collapsible sections with a table of contents and marked placeholders |
| `page-partner-integrations` | page | Integration marketplace with categories, search, and detail panels |
| `page-podcast-show` | page | Podcast show page with episode list, season filters, and interactive audio player bar |
| `page-press-kit` | page | Press kit with logos, photos, and brand guidelines |
| `page-pricing` | page | Pricing page: plans with an interval switch, a comparison table and questions |
| `page-restaurant-menu` | page | Digital restaurant menu with category navigation, dietary badges, and elegant dark theme |
| `page-saas-comparison` | page | SaaS tool comparison page with scoring matrix, card view, and interactive filters |
| `page-security-trust` | page | Security practices and compliance badges page with trust stats, data handling policies, and responsible disclosure info |
| `page-status` | page | Service status page with uptime chart, service cards, recent incidents, and subscribe-to-updates section |
| `page-waitlist` | page | Pre-launch waitlist page with email signup, animated position counter, social sharing, and referral system |
| `site-cookie-consent` | module | Consent banner, preferences dialog and a gate that holds back anything non-essential until a choice is made |
| `site-footer` | component | Footer with link columns, contact block, legal links and a cookie-settings hook |
| `site-header` | component | Responsive site navigation with mobile drawer, skip link and current-page mark |
| `site-seo` | utility | JSON-LD builders plus canonical and Open Graph helpers |

## How it works

Each template is a folder `<slug>/` holding `manifest.json` and `files/`. `registry.json` lists every template. The installer reads the manifest and copies each file into the template's `outputDir` (or `--dir`), then records the slug, version and written files in `.open-context.json`.

Every template is standalone: none imports another. A composite (a page built from sections, a starter built from parts) carries its own copies of its parts and names them, with versions, in `parts`.

## Adding templates

A manifest carries `name`, `version`, `description`, `outputDir`, `files`, `postMessage`, `type`, `category`, `tags` and `stack`; optionally `title`, `family`, `vocabVersion`, `parts`, `proof` and `peerDependencies`. This README is generated from `registry.json`; the template list is never edited by hand.
