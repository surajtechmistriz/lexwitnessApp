export interface EditorPickItem {
  slug: any;
  category: any;
  id: number;
  title: string;
  image: string;
  author?: {
    name: string;
  };
}

export interface EditorPicksSectionProps {
  data: EditorPickItem[];
  getImage: (img: string) => string;
  onPressItem: (item: EditorPickItem) => void;
}

export type Article = {
  slug: string;
  id: number;
  title: string;
  image: string;
  category?: { name: string };
  magazine?: {
    month?: { name: string };
    year?: number;
  };
};

export type Post = {
  id: number;
  title: string;
  image?: string;
  description?: string;
  short_description: string;
  slug: string;
  category?: {
    slug: string;
    name?: string;
  };
};

/**
 * A THIRD, different "Magazine" shape from the ones in
 * types/magazine.types.ts (LatestEditionMagazine / MagazineListItem).
 * Renamed from the original bare `Magazine` to avoid clashing with
 * those when both are imported in the same file. Used by the home
 * screen's edition display components.
 */
export type HomeMagazineCard = {
  magazine_name: string;
  id: number;
  title: string;
  image: string;
  year: number;
  slug?: string;
  link?: string;
};

export type EditionResponse = {
  magazine: HomeMagazineCard;
  posts: Post[];
};

export type LatestEditionProps = {
  onData: (data: EditionResponse) => void;
};

export type CategoryValue =
  | string
  | {
      name?: string;
      slug?: string;
    };

export type ListCardProps = {
  category: CategoryValue;
  title: string;
  slug: string;
  date?: string;
  image?: string;
};

export type LatestEdition = {
  id: number;
  title?: string;
  image?: string;
  slug?: string;
  year?: number;
};

export type LatestEditionsProps = {
  skipId?: number;
  onPressItem?: (item: LatestEdition) => void;
  onPressViewAll?: () => void;
};

export type EditionCardProps = {
  item: LatestEdition;
  index: number;
  progressValue: {
    value: number;
  };
  onPress?: () => void;
  colors: any;
  isDark: boolean;
};

export type PaginationDotProps = {
  index: number;
  progressValue: {
    value: number;
  };
  color: string;
};
