
/** From GET /homepage-latest-edition (Subscription screen's magazine cover). */
export interface LatestEditionMagazine {
  id: number;
  title: string;
  image: string;
  description?: string;
}


export interface MagazineListItem {
  id: number;
  slug: string;
  title: string;
  image?: string;
  magazine_name?: string;
  description?: string;
}

export interface MagazineDetail {
  id: number;
  slug: string;
  title: string;
  magazine_name?: string;
  image?: string;
  description?: string;
  posts?: any[];
}
