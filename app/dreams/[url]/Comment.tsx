"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Reply, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
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

const Comment = ({
  comment,
  allComments,
  onReply,
}: {
  comment: CommentType;
  allComments: CommentType[];
  onReply: (commentId: string, username: string) => void;
}) => {
  const [showReplies, setShowReplies] = useState(false);

  // Find direct replies to this comment
  const directReplies = allComments.filter((c) => c.parentId === comment._id);

  // Count total number of replies recursively
  const countTotalReplies = (commentId: string): number => {
    const directChildReplies = allComments.filter(
      (c) => c.parentId === commentId
    );

    return directChildReplies.reduce(
      (total, reply) => total + 1 + countTotalReplies(reply._id),
      0
    );
  };

  // Calculate comment depth based on ancestors
  const commentDepth = comment.ancestors.length;

  const totalRepliesCount = countTotalReplies(comment._id);

  return (
    <div className="space-y-2">
      <div
        className={`flex flex-col bg-slate-800/50 p-4 rounded-lg backdrop-blur-sm ${
          commentDepth > 0 ? `ml-${Math.min(commentDepth * 4, 16)}` : ""
        }`}
      >
        <div className="flex items-start gap-3">
          <Link href={`/dreams/profile/${comment.profileName}`}>
            <Avatar className="w-10 h-10">
              <AvatarImage src={comment.image} />
              <AvatarFallback>{comment.username[0]}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-slate-200">
                {comment.username}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-slate-300">{comment.content}</p>

            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-slate-400 hover:text-slate-200"
              onClick={() => {
                onReply(comment._id, comment.username);
                document.getElementsByClassName("sendInput")[0].scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <Reply className="w-4 h-4 mr-1" />
              Reply
            </Button>

            {totalRepliesCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 ml-2 text-slate-400 hover:text-slate-200"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide Replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show {totalRepliesCount} Replies
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {showReplies && directReplies.length > 0 && (
          <div className="mt-2 space-y-2">
            {directReplies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                allComments={allComments}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
