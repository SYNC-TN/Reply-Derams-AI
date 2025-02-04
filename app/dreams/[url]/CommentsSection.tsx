import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { MessageCircle } from "lucide-react";
import Comment from "./Comment";
import { useCallback } from "react";
interface CommentType {
  _id: string;
  username: string;
  content: string;
  image: string;
  profileName: string;
  createdAt: string;
  parentId: string | null;
  ancestors: { id: string }[];
}

const CommentsSection = () => {
  const { data: session } = useSession();
  const params = useParams();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string | null;
    username: string | null;
  }>({ commentId: null, username: null });
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    const response = await fetch(
      `/api/dreams/Comments/getAllComments?url=${params.url}`
    );
    const data = await response.json();
    setComments(data.comments);
  }, [params.url]);

  useEffect(() => {
    fetchComments();
  }, [params.url, fetchComments]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !session) return;

    setIsLoading(true);
    try {
      const endpoint = replyingTo.commentId
        ? "/api/dreams/Comments/addReply"
        : "/api/dreams/Comments/addComment";

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          url: params.url,
          ...(replyingTo.commentId && {
            parentCommentId: replyingTo.commentId,
          }),
        }),
      });

      setNewComment("");
      setReplyingTo({ commentId: null, username: null });
      await fetchComments();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (commentId: string, username: string) => {
    setReplyingTo({ commentId, username });
  };

  return (
    <div className="w-full rounded-lg bg-slate-900/80 backdrop-blur-md p-6 mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Comments</h2>
      </div>

      {session ? (
        <div className="flex gap-3 mb-6 sendInput">
          <Avatar className="w-8 h-8">
            <AvatarImage src={session.user?.image || ""} />
            <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            {replyingTo.commentId && (
              <div className="text-sm text-slate-400">
                Replying to {replyingTo.username}
              </div>
            )}
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                replyingTo.commentId ? "Write a reply..." : "Add a comment..."
              }
              className="bg-slate-800/50 border-slate-700"
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !newComment.trim()}
            >
              Post
            </Button>
            {replyingTo.commentId && (
              <Button
                variant="ghost"
                onClick={() =>
                  setReplyingTo({ commentId: null, username: null })
                }
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-slate-400 mb-6">
          Please sign in to comment
        </p>
      )}

      <div className="space-y-4">
        {comments
          .filter((comment) => !comment.parentId) // Only top-level comments
          .map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              allComments={comments}
              onReply={handleReply}
            />
          ))}
      </div>
    </div>
  );
};

export default CommentsSection;
