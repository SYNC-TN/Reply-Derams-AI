export interface Stats {
  likes: number;
  views: number;
}

export interface BooksCategorie {
  BooksTitle: string;
  Tab: string | undefined;
}

export interface CommunityBookProps {
  title: string;
  profilePic?: string;
  username: string;
  comments?: number;
  url: string;
  coverData: {
    coverImageUrl: string;
    title: string;
    subtitle: string;
  };
  stats: Stats;
  createdAt: string;
}
