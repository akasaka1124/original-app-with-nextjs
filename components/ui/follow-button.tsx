"use client";

import { followUser, unfollowUser } from "@/lib/actions";
import { useState, useTransition } from "react";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
  isOwnProfile?: boolean;
}

export default function FollowButton({
  targetUserId,
  initialIsFollowing,
  isOwnProfile = false,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  if (isOwnProfile) {
    return null;
  }

  const handleFollowToggle = () => {
    startTransition(async () => {
      try {
        if (isFollowing) {
          await unfollowUser(targetUserId);
          setIsFollowing(false);
        } else {
          await followUser(targetUserId);
          setIsFollowing(true);
        }
      } catch (error) {
        console.error("フォロー操作に失敗しました:", error);
      }
    });
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isPending}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        isFollowing
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } ${isPending ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {isPending ? "処理中..." : isFollowing ? "フォロー中" : "フォロー"}
    </button>
  );
}