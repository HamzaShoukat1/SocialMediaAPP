import { useDeleteSavedPost, useGetSavedRecord, useLikePost, useSavedPost } from "@/lib/reactquery/queryandmutations";
import type { Models } from "appwrite"
import type { PostDocument } from "../forms/Postform";
import { checkIsLiked } from "@/lib/utils";
import Loader from "./Loader";
import { useEffect, useMemo, useState } from "react";


type PostStatePros = {
  post?:PostDocument;
  userId: string;
}
export type SavedPostDocument = Models.Document & {
  post?: PostDocument; 
  user:Models.Document
  
};

const PostStats = ({post,userId}:PostStatePros)=> {
  const likeList = useMemo(()=> post?.likes?.map((user:Models.Document)=>user.$id) ?? [],
[post?.likes])
  const [likes, setlikes] = useState<string[]>(likeList)
  
    useEffect(() => {
  setlikes(likeList);
}, [likeList]);



  const {mutate:likePost} = useLikePost()


  // const [isSaved, setisSaved] = useState(false)
  const {data: savedPostRecordsData,isLoading,isFetching} = useGetSavedRecord(userId,post?.$id || '')
    const {mutate:deleteSavedPost,isPending:isdeltePost} = useDeleteSavedPost()
    const { mutate: savePost,isPending:isSaving } = useSavedPost();



const ischeckingSaved = isLoading || isFetching || isdeltePost || isSaving;

const savedPostrecords = savedPostRecordsData?.documents?.[0] || null
const isSaved = !!savedPostrecords


    
    
    




      
// useEffect(() => {
//  setisSaved(!!savedPostrecords)
// }, [savedPostrecords])




const handleLikePost = (e: React.MouseEvent) => {
  e.stopPropagation();

  if (!post?.$id) return;

  const hasLiked = likes.includes(userId);

  const newLikes = hasLiked
    ? likes.filter((id) => id !== userId)
    : [...likes, userId];

    setlikes(newLikes)
  likePost({
    postId: post.$id,
    likesArray: newLikes,
  });
};

const handleSavedPost = (e:React.MouseEvent)=> {
  e.stopPropagation()
    
    if(savedPostrecords){
    deleteSavedPost({savedRecordId: savedPostrecords.$id,userId})
  } else{
    
     savePost({postId:post?.$id || '',userId})
  };
 
}























  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img 
        className="cursor-pointer"
        src={`${checkIsLiked(likes,userId) ? 
          "/assets/icons/liked.svg"
           :"/assets/icons/like.svg" }`}
        width={20}
        height={20}
        onClick={handleLikePost}
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>

      </div>

      {/* //  */}
       <div className="flex gap-2 ">
       
      {ischeckingSaved ? (<Loader />) : (
          <img 
        className="cursor-pointer"
        src={`${isSaved ? "/assets/icons/saved.svg" : 
          "/assets/icons/save.svg"  
             }`} 
        width={20}
        height={20}
        onClick={handleSavedPost}
        />

      )}
      </div>


    </div>
  )

}

export default PostStats