export interface Post {
  id: number;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  postCategories: PostCategory[]
}

export interface PostCategory {
  id: number;
  postId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  post: Post;
  category: Category;
}

export interface Category {
  id: number;
  name: String;
  createdAt: string;
  updatedAt: string;
  posts: PostCategory[];
}