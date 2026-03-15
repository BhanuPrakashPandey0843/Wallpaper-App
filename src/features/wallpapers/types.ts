export interface Wallpaper {
  id: string;
  title: string;
  image: {
    thumb: string;
    preview: string;
    full: string;
    blurhash?: string;
  };
  width: number;
  height: number;
  creator?: {
    id: string;
    name: string;
    avatar?: string;
  };
}
