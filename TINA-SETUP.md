# Visual editor setup (TinaCMS)

A visual editor where you click around your post and type — no markdown.
TinaCMS reads/writes the same `.mdx` files you'd edit by hand, so the two
workflows coexist: edit in Tina when you want buttons, edit in your IDE when
you want raw control.

## One-time install

In your project folder, run:

```
npm install tinacms @tinacms/cli --save-dev
```

Then in `package.json`, replace your `dev` and `build` scripts with these so
Tina runs alongside Next.js:

```json
"scripts": {
  "dev": "tinacms dev -c \"next dev\"",
  "build": "tinacms build && next build",
  "start": "next start",
  "lint": "eslint"
}
```

The Tina config is already written at `tina/config.ts`. It knows about your
custom components (`Highlight`, `KeyTerm`, `Arrow`, `Callout`, `SubList`) and
adds them as toolbar blocks in the visual editor.

## Run it

```
npm run dev
```

Then open:

- **Your site:** http://localhost:3000
- **The editor:** http://localhost:3000/admin/index.html

The editor shows a list of all your posts. Click one to edit. Use the toolbar
to bold/italic/highlight/add a callout, etc. Save — it writes to your `.mdx`
file. Git sees the change like any other edit.

## What the editor gives you

- A WYSIWYG view of every post — type and see formatting immediately
- Toolbar buttons for bold, italic, headings, lists, links, blockquote
- A "+" menu to insert your custom blocks: `Image`, `Highlight`, `KeyTerm`,
  `Arrow`, `Callout`, `SubList`
- A sidebar for front matter (title, date, tags, cover image, etc.)
- Image upload (drops files into `public/images/blog/...`)

## Going further (optional — Tina Cloud)

Local editing is enough to work. If you ever want to edit from another
computer or share editing access with someone, sign up for Tina Cloud
(free tier covers personal use):

1. https://app.tina.io — sign in with GitHub, connect this repo
2. Copy the Client ID and a Read-Only Token from the Tina dashboard
3. Put them in a `.env.local` file (don't commit):

```
NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id
TINA_TOKEN=your-token
```

After that, edits made through Tina commit directly to your GitHub branch.

## Lighter alternative if Tina feels heavy

If the setup feels like too much, **Obsidian** is a free desktop app that
opens your `content/blog/` folder as a "vault" and gives you a clean
WYSIWYG markdown editor. It won't know about your custom components
(`<Highlight>` etc. show up as text), but bold/italic/lists/links/headings
all work with toolbar buttons. Many people use Obsidian for writing and
just type the custom tags by hand when needed.

Download: https://obsidian.md

## Troubleshooting

- **"Cannot find module 'tinacms'"** — you skipped the `npm install` step.
- **The admin page is blank** — make sure you used `tinacms dev -c "next dev"`
  in the `dev` script. Plain `next dev` won't start Tina.
- **Custom block isn't showing up** — restart `npm run dev` after editing
  `tina/config.ts`.
