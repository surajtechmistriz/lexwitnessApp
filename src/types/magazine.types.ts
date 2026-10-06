/**
 * Multiple magazine-shaped API responses exist across the app with
 * different fields — kept separate and named by where they come from
 * rather than force-merged into one wrong shape. A THIRD shape used
 * specifically by home screen components lives in home.types.ts as
 * `HomeMagazineCard`. Worth confirming with the backend whether these
 * should actually be unified into one canonical Magazine type.
 */

/** From GET /homepage-latest-edition (Subscription screen's magazine cover). */
export interface LatestEditionMagazine {
  id: number;
  title: string;
  image: string;
  description?: string;
}

/**
 * From GET /magazines (home's getLatestMagazines). The original
 * interface had a broken self-referential `magazine: Magazine` field
 * inside itself — removed, it made no sense.
 */
export interface MagazineListItem {
  id: number;
  slug: string;
  title: string;
  image?: string;
  magazine_name?: string;
  description?: string;
}
