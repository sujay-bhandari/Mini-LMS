
export interface Video {
  id: number;
  title: string;
  url: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  videos: Video[];
}
