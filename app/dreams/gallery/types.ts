interface Stats {
  likes?: number;
  views?: number;
  comments?: number;
}

interface CoverData {
  title: string;
  subtitle: string;
  coverImageUrl?: string;
}

interface Dream {
  User: string;
  url: string;
  name: string;
  share: boolean;
  description: string;
  title: string;
  stats: Stats;
  options: Record<string, unknown>[];
  pages: Record<string, unknown>[];
  coverData: CoverData;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FilterState {
  hasLikes: boolean;
  hasViews: boolean;
}
