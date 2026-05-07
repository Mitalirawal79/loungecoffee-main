import { categories, type CategoryItem } from "@/data/categories";

export type SearchResult = CategoryItem & {
  categorySlug: string;
  categoryLabel: string;
  key: string;
};

const allItems: SearchResult[] = categories.flatMap((c) =>
  c.items.map((it) => ({
    ...it,
    categorySlug: c.slug,
    categoryLabel: c.label,
    key: `${c.slug}:${it.name}`,
  }))
);

export const getAllProducts = () => allItems;

export const searchProducts = (q: string, limit?: number): SearchResult[] => {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const tokens = query.split(/\s+/).filter(Boolean);
  const results = allItems.filter((item) => {
    const haystack = `${item.name} ${item.description} ${item.categoryLabel}`.toLowerCase();
    return tokens.every((t) => haystack.includes(t));
  });
  return typeof limit === "number" ? results.slice(0, limit) : results;
};
