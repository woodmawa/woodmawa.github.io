# woodmawa.github.io

The Softwood Consulting site, served at <https://woodmawa.github.io/>.

It is a [Jekyll](https://jekyllrb.com/) site built by GitHub Pages: push to `main` and Pages rebuilds it
within a minute or two. Build status and errors show under the repository's **Actions** tab
("pages build and deployment").

## Admin page (no local tools needed)

<https://woodmawa.github.io/admin/> runs [Sveltia CMS](https://sveltiacms.app/), configured in
`admin/config.yml`. It lists, creates, edits and deletes blog posts, edits the project list, and uploads
images to `images/uploads/`. Every save is a commit to `main`, so the site rebuilds a minute or two later.
A post with **Published** switched off stays in the repo but is not shown on the site.

Sign in with **Sign In with Token**, using a fine-grained GitHub personal access token:
Repository access *Only select repositories* -> `woodmawa.github.io`, permission *Contents: Read and write*.
The token is kept in that browser's local storage; use **Sign Out** on shared machines, and revoke the token
at <https://github.com/settings/tokens> if a device is lost. Anyone else who opens `/admin/` sees only the
sign-in screen, because GitHub refuses writes without access to this repo.

## Add a blog post by hand

Create `_posts/YYYY-MM-DD-short-slug.md`:

~~~~markdown
---
title: groovy-HttpClient 2.2.0 released
date: 2026-12-01 10:00:00 +0000
category: Release              # shown as a badge: Release, Announcement, Article ...
project: groovy-HttpClient     # optional: repo name from _data/projects.yml
description: One sentence for search engines and link previews.   # optional
---

The first paragraph is the excerpt shown on the home page and the blog list.

## Headings, lists, code blocks -- ordinary Markdown

```groovy
def client = new GroovyHttpClient('https://api.example.com')
```
~~~~

Commit and push. The post appears at `/blog/YYYY/short-slug/`, on the blog list, in the home page's
"Latest News", in the RSS feed (`/feed.xml`) and, when `project:` is set, on that project's **News** tab,
with a link back to the project.

A post dated in the future is not published until a build after that date.

To link to another post from inside a post: `[text]({% post_url 2026-10-26-groovy-httpclient-2-1-0-released %})`.

## Add or update a project

Edit `_data/projects.yml`. Each entry gives the repo name, category, version and coordinates, summary,
features and documentation links. Projects with the same `category` share an accordion. Public repos not
listed there still appear under "Other Projects", fetched from the GitHub API in the browser, as do star
counts and last-updated dates.

Link to a project from anywhere with `/projects/#<repo-name>`, which opens its accordion.

## Layout

| Path | What it is |
|---|---|
| `_config.yml` | Site title, URL, permalinks, plugins (feed, SEO tags, sitemap) |
| `_layouts/default.html` | Header, navigation and footer shared by every page |
| `_layouts/post.html` | A single post, with its project box and previous/next links |
| `_includes/post-card.html` | Post summary card (home, blog list) |
| `_data/projects.yml` | The project list |
| `_posts/` | Blog posts |
| `index.html`, `projects/`, `blog/`, `contact/` | The pages |
| `css/styles.css`, `js/app.js` | Styles; accordions, tabs and live GitHub stats |

## Preview locally (optional)

Needs Ruby 3.x:

```
bundle install
bundle exec jekyll serve
```

then open <http://localhost:4000>. Add `--future` to see future-dated posts.
