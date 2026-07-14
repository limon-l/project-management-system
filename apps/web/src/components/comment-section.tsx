"use client";

import { useState } from "react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useAddComment, type Comment } from "@/hooks/use-tasks";

interface CommentSectionProps {
  taskId: string;
  comments: Comment[];
  currentUserId: string;
}

export function CommentSection({
  taskId,
  comments,
  currentUserId,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const addComment = useAddComment();

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed) return;
    addComment.mutate(
      { taskId, content: trimmed },
      { onSuccess: () => setNewComment("") }
    );
  };

  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-foreground">
        Comments ({comments.length})
      </h4>

      {/* Comment list */}
      <div className="mb-4 space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {comment.author.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {comment.author.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(comment.createdAt)}
                </span>
                {comment.edited && (
                  <span className="text-xs text-muted-foreground">(edited)</span>
                )}
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/80">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
          ?
        </div>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[60px] w-full rounded-lg border border-border bg-surface p-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            rows={2}
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || addComment.isPending}
              className="inline-flex h-7 items-center rounded bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {addComment.isPending ? "Posting..." : "Comment"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
