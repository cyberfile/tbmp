import { useEffect } from "react";

const PublicLibrary = () => {
  // Basic SEO for this page
  useEffect(() => {
    const title = "Public Library – StudyAI"; // <60 chars
    const description = "Explore StudyAI's public library of curated study resources and tools."; // <160 chars

    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);

    // Canonical tag
    const canonicalHref = `${window.location.origin}/public-library`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalHref);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">Public Library</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Browse community-curated study materials, templates, and references to boost your learning.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section aria-labelledby="library-overview" className="space-y-6">
          <h2 id="library-overview" className="text-xl font-semibold">Featured Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[ "Formula Sheets", "Practice Sets", "Study Guides"].map((title) => (
              <article key={title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <h3 className="font-medium">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Coming soon. We’ll showcase popular, high-quality resources here.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="library-how-it-works" className="space-y-3 mt-10">
          <h2 id="library-how-it-works" className="text-xl font-semibold">How it works</h2>
          <p className="text-sm text-muted-foreground max-w-3xl">
            The Public Library will feature resources shared by the community. You’ll be able to preview
            items, save them to your planner, and track what you’ve used.
          </p>
        </section>
      </main>
    </div>
  );
};

export default PublicLibrary;
