export interface Stats {
  likes: number;
  views: number;
}

export interface BooksCategorie {
  BooksTitle: string;
  Tab: string | undefined;
}

export interface Author {
  name: string;
  avatar?: string;
  username: string;
}

export interface CommunityBookProps {
  title: string;
  profilePic?: string;
  username: string;
  url: string;
  coverData: {
    coverImageUrl: string;
    title: string;
    subtitle: string;
  };
  stats: Stats;
  author: Author;
  createdAt: string;
}
