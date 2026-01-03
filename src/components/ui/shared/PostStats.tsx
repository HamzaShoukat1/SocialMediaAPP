import { useDeleteSavedPost, useGetSavedRecord, useLikePost, useSavedPost } from "@/lib/reactquery/queryandmutations";
import type { Models } from "appwrite";
import type { PostDocument } from "../forms/Postform";
import { checkIsLiked } from "@/lib/utils";
import Loader from "./Loader";
import { useEffect, useMemo, useState } from "react";

type PostStateProps = {
  post?: PostDocument;
  userId: string  
};

export type SavedPostDocument = Models.Document & {
  post?: PostDocument;
  user: Models.Document;
};

const PostStats = ({ post, userId }: PostStateProps) => {
  const likeList = useMemo(() => post?.likes?.map((user: Models.Document) => user.$id) ?? [], [post?.likes]);
  const [likes, setLikes] = useState<string[]>(likeList);

  useEffect(() => {
    setLikes(likeList);
  }, [likeList]);

  const { mutate: likePost } = useLikePost();

  // Saved posts
  const { data: savedPostRecordsData, isLoading, isFetching } = useGetSavedRecord(userId, post?.$id || '');
  const { mutate: deleteSavedPost, isPending: isDeletePost } = useDeleteSavedPost();
  const { mutate: savePost, isPending: isSaving } = useSavedPost();

  // Local state to optimistically update saved status
  const [isSaved, setIsSaved] = useState(false);

  // Initialize saved state when data loads
  useEffect(() => {
    const savedRecord = savedPostRecordsData?.documents?.[0];
    setIsSaved(!!savedRecord);
  }, [savedPostRecordsData]);

  const isCheckingSaved = isLoading || isFetching || isDeletePost || isSaving;

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post?.$id) return;

    const hasLiked = likes.includes(userId);
    const newLikes = hasLiked ? likes.filter((id) => id !== userId) : [...likes, userId];
    setLikes(newLikes);

    likePost({
      postId: post.$id,
      likesArray: newLikes,
    });
  };
  const likeIge = "/assets/icons/like.svg";
  const likedIMge = "/assets/icons/liked.svg";

  const handleSavedPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post?.$id) return;

    if (isSaved) {
      setIsSaved(false);
      const savedRecord = savedPostRecordsData?.documents?.[0];
      if (savedRecord) {
        deleteSavedPost({ savedRecordId: savedRecord.$id,userId });
      }
    } else {
      setIsSaved(true);
      savePost({ postId: post.$id, userId });
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          className="cursor-pointer"
          src={checkIsLiked(likes, userId) ? likedIMge : likeIge}
          width={20}
          height={20}
          onClick={handleLikePost}
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {isCheckingSaved ? (
          <Loader />
        ) : (
          <img
            className="cursor-pointer"
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            width={20}
            height={20}
            onClick={handleSavedPost}
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
