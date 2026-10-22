/**
 * Inferred from usage in AuthorScreen.tsx and the /authors endpoint.
 * Only the fields actually used in the app are included — confirm the
 * full shape against the real API response if more fields are needed
 * elsewhere (e.g. image, description, linkedin — those were seen on a
 * post's embedded author object in ArticleScreen.tsx, which may or may
 * not be the exact same shape as this one).
 */
export interface Author {
  id: number;
  name: string;
  slug: string;
}
