# Project Dashboard — Setup & Usage Guide

**Created:** 2026-06-28  
**Route:** `/dashboard` (local dev only — unreachable in production)  
**Purpose:** Edit portfolio projects and "Other projects" without touching code. Changes are committed to git and deploy via Vercel rebuild.

---

## One-Time Setup

### 1. Get a Gemini API Key

The dashboard uses Google Gemini to autofill project fields from a GitHub README.

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create an API key.
2. Open `.env.local` in the project root and paste it:

```
GEMINI_API_KEY=your-key-here
```

The file already has all the other keys — just fill in the Gemini line. The key is only used locally; it never ships to Vercel.

### 2. Confirm `.env.local` has all three keys

```
RESEND_API_KEY=...
DEV_PULSE_API_KEY=...
DEV_PULSE_API_URL=...
GEMINI_API_KEY=...
```

That's all the setup needed. The dashboard has no login, no database, no extra dependencies to install beyond the normal `npm install`.

---

## Starting the Dashboard

```bash
npm run dev
```

Then open: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

The route returns 404 in production — it only exists when `NODE_ENV=development`.

---

## How to Use It

### Portfolio (4 fixed cards)

The top section shows your 4 main portfolio projects. The slots are fixed — you can't add or remove them, only edit them.

Each card has:
- **Title** and **Subtitle** (e.g. "SoterCare", "(2nd Year Project - Ongoing)")
- **Short description** — shown on the card face
- **Long description** — shown in the expanded view
- **Tech tags** — type a tag and press Enter to add, click × to remove
- **Link** — the project URL or GitHub link
- **Images** — upload one or more images; use ↑ ↓ to reorder, × to remove

### Other Projects (unlimited)

The bottom section is the grid of folder cards. You can:
- **Add** a new card with the "Add project" button
- **Remove** any card with the × button
- **Reorder** with the ↑ ↓ arrows
- Edit each card's title, description, and link

### Autofill from GitHub

Every card (both portfolio and other projects) has an autofill row at the top.

1. Paste a GitHub repo URL (e.g. `https://github.com/DahamDissanayake/sotercare`)
2. Click **Autofill**
3. Gemini reads the repo's `README.md` and fills the fields
4. Review and edit anything before saving — autofill is a starting point, not final output

Portfolio autofill fills: title, short description, long description, tech tags, and link.  
Other-project autofill fills: title, description, and link.

If the repo has no README or is private, you'll see an inline error — just fill the fields manually.

### Image Upload (Portfolio only)

In each portfolio card, click **Upload images** and pick one or more files. They're saved to `public/images/projects/` with a safe slugified filename. The path is stored in `data/projects.json` automatically.

Supported formats: `.webp`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`

---

## Saving and Publishing

### Save

Click **Save all** at the bottom of the page. This writes `data/projects.json` to disk. If any required field is empty or a portfolio card has no image, you'll see a validation message and nothing is saved.

### Publish to the live site

The dashboard only writes local files. To ship the changes:

```bash
git add data/projects.json public/images/projects/
git commit -m "update projects"
git push
```

Vercel picks up the push, rebuilds, and the new content goes live. That's the full flow — no deploy commands, no CMS sync.

---

## Data file

Everything lives in `data/projects.json`. You can also edit it directly if you prefer — the dashboard is just a UI on top of that file.

Structure:
```json
{
  "portfolio": [          // always exactly 4 entries
    {
      "id": "sotercare",
      "title": "SoterCare",
      "subtitle": "(2nd Year Project - Ongoing)",
      "description": "Short card description",
      "longDescription": "Full expanded description",
      "tech": ["IoT", "React Native"],
      "link": "https://sotercare.com",
      "images": ["/images/projects/sotercare-website.webp"]
    }
  ],
  "otherProjects": [      // unlimited
    {
      "id": "visionslide",
      "title": "VisionSlide",
      "description": "One-line description",
      "link": "https://github.com/DahamDissanayake/vision-slide"
    }
  ]
}
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `/dashboard` shows 404 | You're on the production build. Run `npm run dev` instead. |
| Autofill button does nothing | Check that `GEMINI_API_KEY` is set in `.env.local` and restart the dev server. |
| "README not found" error | The repo may be private, or have no README. Fill fields manually. |
| Save shows validation error | Read the message — it names the card and field that's empty. Fix it and try again. |
| Uploaded image doesn't show on site | Make sure you pushed `public/images/projects/<filename>` along with `data/projects.json`. |
| Build fails after editing JSON directly | Check that `portfolio` has exactly 4 entries and every entry has a non-empty `images` array. |
