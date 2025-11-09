export interface AllPost {
  postId: number;
  subreddit: string;
  depressionScore: number;
  label: string;
  date: string;
  excerpt?: string;
  author?: string;
}