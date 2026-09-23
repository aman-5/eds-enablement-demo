Got it — no action items. Here's the straightforward answer:

The migration was run against the source URL **`https://wknd-trendsetters.site/about-us`**. The import pipeline derives the output page path from the source URL's path, so `/about-us` became an `about-us` page.

The **index** page maps to the site's homepage (source path `/`), which is a different URL and wasn't the migration target. The tool doesn't touch `index` unless you specifically point it at the homepage — so this was just a consequence of which URL was migrated, not a decision to skip the index.
