import { Comment, Task, Project, User } from "../models/index.js";
import { AppError, validate } from "../utils/helpers.js";
import { createCommentSchema, updateCommentSchema } from "@boardflow/shared";
import { emitToProject } from "../socket/index.js";
import { notifyMention } from "./notification.service.js";

export async function getTaskComments(taskId: string, page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find({ taskId })
      .populate("authorId", "name avatarUrl")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Comment.countDocuments({ taskId }),
  ]);

  const mapped = comments.map((c) => {
    const author = c.authorId as unknown as {
      _id: { toString(): string };
      name: string;
      avatarUrl: string | null;
    };
    return {
      id: c._id.toString(),
      taskId: c.taskId.toString(),
      authorId: author._id.toString(),
      author: {
        id: author._id.toString(),
        name: author.name,
        avatarUrl: author.avatarUrl,
      },
      content: c.content,
      edited: c.edited,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  });

  return {
    items: mapped,
    total,
    page,
    limit,
    hasMore: skip + comments.length < total,
  };
}

export async function createComment(
  taskId: string,
  authorId: string,
  input: unknown
) {
  const data = validate(createCommentSchema, input);

  const comment = await Comment.create({
    taskId,
    authorId,
    content: data.content,
  });

  const populated = await Comment.findById(comment._id)
    .populate("authorId", "name avatarUrl")
    .lean();

  if (!populated) {
    throw new AppError(500, "INTERNAL_ERROR", "Failed to load comment");
  }

  const author = populated.authorId as unknown as {
    _id: { toString(): string };
    name: string;
    avatarUrl: string | null;
  };

  const result = {
    id: populated._id.toString(),
    taskId: populated.taskId.toString(),
    authorId: author._id.toString(),
    author: {
      id: author._id.toString(),
      name: author.name,
      avatarUrl: author.avatarUrl,
    },
    content: populated.content,
    edited: populated.edited,
    createdAt: populated.createdAt,
    updatedAt: populated.updatedAt,
  };

  const taskDoc = await Task.findById(taskId).select("projectId").lean();
  let workspaceId: string | undefined;

  if (taskDoc) {
    const projectId = taskDoc.projectId.toString();
    emitToProject(projectId, "comment:created", { comment: result });

    const project = await Project.findById(projectId).select("workspaceId").lean();
    workspaceId = project?.workspaceId?.toString();

    // Detect @mentions — batch lookup
    const mentionRegex = /@(\w+)/g;
    const mentionNames = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = mentionRegex.exec(data.content)) !== null) {
      mentionNames.add(match[1]);
    }

    if (mentionNames.size > 0 && workspaceId) {
      const wsId = workspaceId;
      const mentionedUsers = await User.find({ name: { $in: Array.from(mentionNames) } })
        .select("_id name")
        .lean();
      await Promise.all(
        mentionedUsers.map((u) =>
          notifyMention(
            u._id.toString(),
            authorId,
            "comment",
            comment._id.toString(),
            projectId,
            wsId,
            `in a comment on task ${taskId}`
          )
        )
      );
    }
  }

  return result;
}

export async function updateComment(
  commentId: string,
  userId: string,
  input: unknown
) {
  const data = validate(updateCommentSchema, input);

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError(404, "NOT_FOUND", "Comment not found");
  }

  if (comment.authorId.toString() !== userId) {
    throw new AppError(403, "FORBIDDEN", "Can only edit your own comments");
  }

  comment.content = data.content;
  comment.edited = true;
  await comment.save();

  const task = await Task.findById(comment.taskId).select("projectId").lean();
  const projectId = task?.projectId.toString();

  const populated = await Comment.findById(commentId)
    .populate("authorId", "name avatarUrl")
    .lean();

  if (!populated) {
    throw new AppError(500, "INTERNAL_ERROR", "Failed to load comment");
  }

  const author = populated.authorId as unknown as {
    _id: { toString(): string };
    name: string;
    avatarUrl: string | null;
  };

  const result = {
    id: populated._id.toString(),
    taskId: populated.taskId.toString(),
    authorId: author._id.toString(),
    author: {
      id: author._id.toString(),
      name: author.name,
      avatarUrl: author.avatarUrl,
    },
    content: populated.content,
    edited: populated.edited,
    createdAt: populated.createdAt,
    updatedAt: populated.updatedAt,
  };

  if (projectId) {
    emitToProject(projectId, "comment:updated", { comment: result });
  }

  return result;
}

export async function deleteComment(commentId: string, userId: string) {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError(404, "NOT_FOUND", "Comment not found");
  }

  if (comment.authorId.toString() !== userId) {
    throw new AppError(403, "FORBIDDEN", "Can only delete your own comments");
  }

  const task = await Task.findById(comment.taskId).select("projectId").lean();
  const projectId = task?.projectId.toString();

  await Comment.findByIdAndDelete(commentId);

  if (projectId) {
    emitToProject(projectId, "comment:deleted", {
      commentId,
      taskId: comment.taskId.toString(),
    });
  }
}
