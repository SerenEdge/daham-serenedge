# Graph Report - .  (2026-06-28)

## Corpus Check
- Large corpus: 62 files · ~638,231 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 244 nodes · 233 edges · 44 communities (22 shown, 22 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.86)
- Token cost: 185,451 input · 32,725 output

## Community Hubs (Navigation)
- [[_COMMUNITY_CV Education & Background|CV: Education & Background]]
- [[_COMMUNITY_SEO Strategy & Audit|SEO Strategy & Audit]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Page Content Components|Page Content Components]]
- [[_COMMUNITY_Build Tooling & Deps|Build Tooling & Deps]]
- [[_COMMUNITY_App Layout & Navigation|App Layout & Navigation]]
- [[_COMMUNITY_MLIoT Project Tech|ML/IoT Project Tech]]
- [[_COMMUNITY_API & Agent Projects|API & Agent Projects]]
- [[_COMMUNITY_Portrait & Brand Imagery|Portrait & Brand Imagery]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_PWA Manifest|PWA Manifest]]
- [[_COMMUNITY_SoterCare Artifacts|SoterCare Artifacts]]
- [[_COMMUNITY_Next.js Starter Assets|Next.js Starter Assets]]
- [[_COMMUNITY_DevPulse Card Component|DevPulse Card Component]]
- [[_COMMUNITY_404 Page|404 Page]]
- [[_COMMUNITY_DevPulse Project|DevPulse Project]]
- [[_COMMUNITY_ImgHarvest Project|ImgHarvest Project]]
- [[_COMMUNITY_VibeCheck Project|VibeCheck Project]]
- [[_COMMUNITY_ReImage Project|ReImage Project]]
- [[_COMMUNITY_VisionSlide Project|VisionSlide Project]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_VS Code Settings|VS Code Settings]]
- [[_COMMUNITY_Arduino|Arduino]]
- [[_COMMUNITY_Docker|Docker]]
- [[_COMMUNITY_Git|Git]]
- [[_COMMUNITY_Java|Java]]
- [[_COMMUNITY_LangChain|LangChain]]
- [[_COMMUNITY_MongoDB|MongoDB]]
- [[_COMMUNITY_Scikit-learn|Scikit-learn]]
- [[_COMMUNITY_SQL|SQL]]
- [[_COMMUNITY_Tailwind CSS|Tailwind CSS]]
- [[_COMMUNITY_TensorFlow|TensorFlow]]
- [[_COMMUNITY_TypeScript|TypeScript]]
- [[_COMMUNITY_YOLOv11|YOLOv11]]
- [[_COMMUNITY_File Icon SVG|File Icon SVG]]
- [[_COMMUNITY_Globe Icon SVG|Globe Icon SVG]]
- [[_COMMUNITY_Window Icon SVG|Window Icon SVG]]

## God Nodes (most connected - your core abstractions)
1. `Daham Dissanayake` - 17 edges
2. `compilerOptions` - 16 edges
3. `SEO Audit Report — daham.serenedge.com` - 13 edges
4. `SoterCare` - 9 edges
5. `SEO Strategy Guide — Ranking #1 for Daham Dissanayake` - 8 edges
6. `ImgHarvest` - 7 edges
7. `scripts` - 5 edges
8. `VibeCheck` - 5 edges
9. `ReImage Agent` - 5 edges
10. `VisionSlide` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Wordmark Logo (SVG)` --references--> `Next.js Project (create-next-app)`  [INFERRED]
  public/next.svg → README.md
- `Vercel Triangle Logo (SVG)` --references--> `Vercel Deployment`  [INFERRED]
  public/vercel.svg → README.md
- `Google Site Verification HTML File` --conceptually_related_to--> `Google Search Console Workflow`  [INFERRED]
  app/google5ecffaaeec0becce.html → dev-logs/SEOproper.md
- `Hero()` --calls--> `useScale()`  [EXTRACTED]
  components/Hero.tsx → hooks/useScale.ts
- `JSON-LD WebSite Schema (missing @id/description)` --semantically_similar_to--> `JSON-LD ProfilePage + Person Schema`  [INFERRED] [semantically similar]
  dev-logs/SEOissues.md → dev-logs/SEOproper.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Client-Side Rendering Hurts SEO (CSR root cause cluster)** — seoissues_use_client_csr, seoissues_h1_hello, seoissues_noscript_fallback, seoissues_core_web_vitals [EXTRACTED 0.85]
- **Path to Google Knowledge Panel** — seoproper_jsonld_profilepage, seoproper_wikidata_entry, seoproper_sameas_backlinks, seoproper_knowledge_panel [EXTRACTED 0.85]
- **Next.js create-next-app Starter Assets** — readme_nextjs_project, next_icon, vercel_icon, globe_icon [INFERRED 0.65]
- **SoterCare IoT & ML Elderly Care Stack** — docs_dahamdissanayake_cv_sotercare, docs_dahamdissanayake_cv_raspberry_pi, docs_dahamdissanayake_cv_edge_impulse, docs_dahamdissanayake_cv_nestjs, docs_dahamdissanayake_cv_react_native [INFERRED 0.85]
- **ImgHarvest Microservices Stack** — docs_dahamdissanayake_cv_imgharvest, docs_dahamdissanayake_cv_ballerina, docs_dahamdissanayake_cv_groq_api, docs_dahamdissanayake_cv_serpapi, docs_dahamdissanayake_cv_choreo_wso2 [INFERRED 0.85]
- **Daham B&W studio portrait variants** — images_damaportrait_png, images_damaportrait_webp, images_damaportraitfinal, images_damaportraitfinal2 [INFERRED 0.85]
- **Daham signature/logo branding marks** — images_daham_sign_dark, images_daham_sign_white, images_logo, images_apple_touch_icon [INFERRED 0.85]
- **Daham casual bucket-hat portraits** — images_dahamimagefornow, images_dahamimagefornow_dark, images_og_image [INFERRED 0.75]
- **SoterCare Project Artifacts** — projects_sotercare_finaldevice, projects_sotercare_gitorg, projects_sotercare_mobileapp, projects_sotercare_prototype1v, projects_sotercare_studio, projects_sotercare_website, projects_sotercareteam, concept_sotercare [INFERRED 0.95]
- **DevPulse project views** — projects_devpulse1, projects_devpulse2, concept_devpulse [INFERRED 0.75]
- **ImgHarvest project views** — projects_imgharvest1, projects_imgharvest2, concept_imgharvest [INFERRED 0.75]
- **VibeCheck project views** — projects_vibecheck1, projects_vibecheck2, concept_vibecheck [INFERRED 0.75]

## Communities (44 total, 22 thin omitted)

### Community 0 - "CV: Education & Background"
Cohesion: 0.09
Nodes (24): Apple HomeKit Automation, Bandaranayake College, Gampaha, BSc (Hons) in Computer Science, Professional Certificate in Machine Learning, Professional Certificate in Marketing (SLIM), Daham Dissanayake CV, Daham Dissanayake, ESP32 (+16 more)

### Community 1 - "SEO Strategy & Audit"
Cohesion: 0.13
Nodes (21): Google Site Verification HTML File, SEO Audit Report — daham.serenedge.com, Core Web Vitals Risk (LCP/CLS/INP), Duplicate Google Verification Methods, Non-Descriptive H1 "Hello", Hero Image alt Text Typo (ComputerScience), JSON-LD Person Schema (missing image/@id), JSON-LD WebSite Schema (missing @id/description) (+13 more)

### Community 2 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 3 - "Page Content Components"
Cohesion: 0.12
Nodes (8): resend, sendContactEmail(), metadata, Hero(), AudienceType, content, technologies, useScale()

### Community 4 - "Build Tooling & Deps"
Cohesion: 0.11
Nodes (18): devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+10 more)

### Community 5 - "App Layout & Navigation"
Cohesion: 0.13
Nodes (8): geistMono, inter, metadata, viewport, menuLinks, Navbar(), LenisContext, useLenis()

### Community 6 - "ML/IoT Project Tech"
Cohesion: 0.12
Nodes (16): C++, Edge Impulse, HTML5/CSS3, IoT-driven Machine Learning, JavaScript, Chrome Extension Manifest V3, NestJS, OpenCV (+8 more)

### Community 7 - "API & Agent Projects"
Cohesion: 0.18
Nodes (12): Ballerina, Choreo WSO2, Dev-Pulse API, FastAPI, Gemini (Nano Banana), GitHub API, Groq API, ImgHarvest (+4 more)

### Community 8 - "Portrait & Brand Imagery"
Cohesion: 0.18
Nodes (11): Apple Touch Icon (Daham signature 'D' mark, white on white AMBIGUOUS), Daham Signature (dark navy), Daham Signature (white, for dark backgrounds), Daham Casual Portrait (grayscale, bucket hat), Daham Casual Portrait (dark/blue tint, bucket hat), Daham Portrait (PNG, B&W profile), Daham Portrait (WebP variant of PNG), Daham Portrait Final (B&W profile) (+3 more)

### Community 9 - "Runtime Dependencies"
Cohesion: 0.20
Nodes (10): dependencies, gsap, lenis, next, react, react-dom, react-icons, resend (+2 more)

### Community 10 - "PWA Manifest"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 11 - "SoterCare Artifacts"
Cohesion: 0.36
Nodes (8): SoterCare Project (Smart Elderly Care Monitoring System), SoterCare Final Device — ESP32 Gateway Node and Touchscreen Dashboard, SoterCare GitHub Organization Repositories, SoterCare Mobile App UI Showcase, SoterCare Wearable Prototype — Wrist/Thigh Sensor Nodes, SoterCare Local Data Studio Desktop App, SoterCare Marketing Website Landing Page, SoterCare Team Photo

### Community 12 - "Next.js Starter Assets"
Cohesion: 0.40
Nodes (5): Next.js Wordmark Logo (SVG), Geist Font via next/font, Next.js Project (create-next-app), Vercel Deployment, Vercel Triangle Logo (SVG)

### Community 13 - "DevPulse Card Component"
Cohesion: 0.67
Nodes (3): DevPulseCard(), DevPulseData, fetchPulseData()

### Community 15 - "DevPulse Project"
Cohesion: 1.00
Nodes (3): DevPulse — Real-time GitHub Metrics Platform, DevPulse Portfolio Card UI, DevPulse Choreo Deployment Dashboard

### Community 16 - "ImgHarvest Project"
Cohesion: 1.00
Nodes (3): ImgHarvest — ML-Ready Image Dataset Builder, ImgHarvest Search & Harvest Landing, ImgHarvest Results Grid

### Community 17 - "VibeCheck Project"
Cohesion: 1.00
Nodes (3): VibeCheck — Layout Assistant Browser Extension, VibeCheck Layout Assistant Web Store Listing, VibeCheck Fix Prompt Generator Panel

## Knowledge Gaps
- **124 isolated node(s):** `css.lint.unknownAtRules`, `resend`, `geistMono`, `inter`, `viewport` (+119 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Daham Dissanayake` connect `CV: Education & Background` to `ML/IoT Project Tech`, `API & Agent Projects`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `SoterCare` connect `ML/IoT Project Tech` to `CV: Education & Background`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `ImgHarvest` connect `API & Agent Projects` to `CV: Education & Background`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `css.lint.unknownAtRules`, `resend`, `geistMono` to the rest of the system?**
  _129 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CV: Education & Background` be split into smaller, more focused modules?**
  _Cohesion score 0.09057971014492754 - nodes in this community are weakly interconnected._
- **Should `SEO Strategy & Audit` be split into smaller, more focused modules?**
  _Cohesion score 0.12987012987012986 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._