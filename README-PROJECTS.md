# Repair package — engineering portfolio

This update repairs integration of the 12-project catalog into your existing Jekyll / al-folio website. It includes 12 detail pages, categorized filters, professional type badges and a new functional light/dark control on the redesigned homepage, listing, and detail pages. This does **not** touch `main` or GitHub Pages settings.

## Install safely in Codespaces

1. Confirm you are on `engineering-redesign` using `git branch --show-current`.
2. Upload `amin-portfolio-fix.zip` into the **top-level folder** of your Codespaces repository (alongside `_config.yml`).
3. Run these commands from the repository root:

```bash
python3 -m zipfile -e amin-portfolio-fix.zip /tmp/amin-portfolio-fix
python3 /tmp/amin-portfolio-fix/install.py .
```

The installer **refuses** to run on `main` or a different branch. It creates a timestamped backup in `/tmp/` of any files it replaces, copies the exact files into the correct repository folders, and checks that the 12 individual pages exist.

4. Stop Jekyll (Ctrl+C) and rebuild with:

```bash
bundle exec jekyll build
bundle exec jekyll serve --host 0.0.0.0 --port 4000 --no-watch
```

5. Open the private port 4000 in Codespaces. Visit `/projects/` **not** the homepage; the homepage has only **four featured** cards by design. The `/projects/` page should have 12 cards, six technical category buttons and four project type buttons. Open `/projects/hexapod/` to confirm the first detail page. Try the new top-right **Dark mode / Light mode** switch.
6. If anything is missing, check the build output and generated files:

```bash
test -f _site/projects/index.html && echo 'Projects generated'
grep -o 'data-project-card' _site/projects/index.html | wc -l
test -f _site/projects/hexapod/index.html && echo 'Detail generated'
git status --short
```

The card count must be 12. If it is 0 or 4, your build may be reading a different projects page or an older cached build. Check `_pages/projects.md` and `_config.yml` include rules; run `bundle exec jekyll clean` then rebuild. Avoid `jekyll clean` while the preview server is running.

**Important:** The former al-folio navbar theme icon may still use its own JS logic. This patch adds a working control specifically to the redesigned pages; it does not overwrite your original global navbar JS. If that original button stays broken elsewhere, we can adjust its actual template and JS after examining those files.

**Keep changes on `engineering-redesign` until visual testing is complete.**
