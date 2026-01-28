export interface Comment {
	id: string;
	author: string;
	text: string;
	date: string;
}

export interface Post {
	id: string;
	author: string;
	title: string;
	slug: string;
	content: string;
	date: string;
	category: string;
	likes: number;
	isLiked: boolean;
	comments: Comment[];
}
