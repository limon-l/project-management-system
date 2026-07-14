export interface AttachmentResponse {
  id: string;
  taskId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploader: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

export interface BoardResponse {
  id: string;
  projectId: string;
  name: string;
  columns: {
    id: string;
    name: string;
    position: string;
    tasks?: { id: string; position: string }[];
  }[];
  createdAt: string;
  updatedAt: string;
}
