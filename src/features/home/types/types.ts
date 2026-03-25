export interface EditorPickItem {
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
}



// types.ts
export type Article = {
  id: number;
  title: string;
  image: string;
  category?: { name: string };
  magazine?: {
    month?: { name: string };
    year?: number;
  };
};