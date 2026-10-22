export interface GetPostsParams {
  search?: string;
  category_id?: number;
  year?: number;
  author_id?: number;
  tag_id?: number;
  magazine_id?: number;
  page?: number;
  per_page?: number;
  latest?: number;
}

/**
 * A FOURTH distinct "Magazine" shape found in the codebase — see also
 * types/magazine.types.ts (LatestEditionMagazine, MagazineListItem) and
 * types/home.types.ts (HomeMagazineCard). Named specifically for where
 * it's used (posts.ts) to avoid clashing with those when imported
 * together. Worth confirming with the backend whether some of these
 * four should actually be the same type.
 */
export interface ArticlePostMagazine {
  id: number;
  title: string;
  slug: string;
  image: string;
  featured_image: string;
  created_at: string;
  category?: {
    name: string;
  };
}

export type TextAlignment = 'left' | 'right' | 'center';

export interface TestimonialData {
  reader_feedback?: string;
  reader_name?: string;
  reader_designation?: string;
  text_alignment?: TextAlignment;
}

export interface SocialShareProps {
  title: string;
  url: string;
}

export interface ShareArticleData {
  title: string;
  slug: string;
}
