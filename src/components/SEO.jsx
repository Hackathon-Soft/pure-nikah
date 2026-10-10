import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_DESCRIPTION =
  "PureNikah is a trusted Islamic marriage platform helping Muslims find a compatible life partner with dignity, privacy, and faith.";

const pageMeta = {
  "/": { title: "PureNikah — Find Your Life Partner", description: DEFAULT_DESCRIPTION },
  "/about": { title: "About PureNikah", description: "Learn about PureNikah's mission to make Muslim marriage respectful, private, and values-led." },
  "/pricing": { title: "Pricing — PureNikah", description: "Explore PureNikah's free and supported plans, including assistance for widowed and divorced members." },
  "/search": { title: "Search Proposals — PureNikah", description: "Search compatible Muslim marriage profiles using privacy-conscious filters." },
  "/contact": { title: "Contact PureNikah", description: "Contact the PureNikah support team for account, verification, and platform help." },
  "/privacy-policy": { title: "Privacy Policy — PureNikah", description: "Read how PureNikah protects personal information and identity documents." },
  "/terms-of-service": { title: "Terms of Service — PureNikah", description: "Review the rules and verification requirements for using PureNikah." },
  "/help": { title: "Help Center — PureNikah", description: "Find answers about profiles, privacy, verification, and account support." },
};

const setMeta = (name, content, attribute = "name") => {
  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const SEO = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = pageMeta[pathname] || {
      title: "PureNikah — Islamic Marriage Platform",
      description: DEFAULT_DESCRIPTION,
    };
    const canonicalUrl = `${window.location.origin}${pathname}`;

    document.title = meta.title;
    setMeta("description", meta.description);
    setMeta("og:title", meta.title, "property");
    setMeta("og:description", meta.description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", meta.title);
    setMeta("twitter:description", meta.description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [pathname]);

  return null;
};

export default SEO;