export type CommentDto = {
	id: number,
	author: string,
	text: string,
	date: Date,
	likes: number,
	image: string
}

export type UpdateCommentDto = Omit<CommentDto, "id" | "date" | "likes">;
