import { useDeleteSavedPost, useGetSavedRecord, useLikedPost, useSavedPost } from "@/lib/reactquery/queryandmutations";
import type { Models } from "appwrite"
import type { PostDocument } from "../forms/Postform";
import { useState ,useEffect} from "react";
import { checkIsLiked } from "@/lib/utils";
import Loader from "./Loader";

type PostStatePros = {
  post?:PostDocument;
  userId: string;
}
export type SavedPostDocument = Models.Document & {
  post?: PostDocument; 
  user:Models.Document
  
};

const PostStats = ({post,userId}:PostStatePros)=> {
  const likeList = post?.likes?.map((user:Models.Document)=>user.$id) ?? []

  const [likes, setlikes] = useState(likeList)
  const {mutate:likePost} = useLikedPost()
  const [isSaved, setisSaved] = useState(false)
  const {data: savedPostRecordsData} = useGetSavedRecord(userId,post?.$id || '')
    const {mutate:deleteSavedPost,isPending:isdeltePost} = useDeleteSavedPost()
    const { mutate: savePost } = useSavedPost();



const savedPostrecords = savedPostRecordsData?.documents?.[0] || null


    
    
    




      
useEffect(() => {
 setisSaved(!!savedPostrecords)
}, [savedPostrecords])




const handleLikePost= (e: React.MouseEvent)=> {
  e.stopPropagation();
  let newLikes = [...likes];

  const hasLiked = (newLikes.includes(userId));

  if(hasLiked){
    newLikes = newLikes.filter((id)=> id !== userId)

  }else{
    newLikes.push(userId)
  };
  setlikes(newLikes)
  likePost({postId:post?.$id || '',likesArray: newLikes})



}
const handleSavedPost = (e:React.MouseEvent)=> {
  e.stopPropagation()
    
    if(savedPostrecords){
    setisSaved(false)
    deleteSavedPost({savedRecordId: savedPostrecords.$id,userId})
  } else{
    
     savePost({postId:post?.$id || '',userId})
  setisSaved(true)
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
       {/* {isPostSaving || isdeltePost ? <Loader />  */}
       
        <img 
        className="cursor-pointer"
        src={`${isSaved ? "/assets/icons/saved.svg" : 
          "/assets/icons/save.svg"  
             }`} 
        width={20}
        height={20}
        onClick={handleSavedPost}
        />

      </div>


    </div>
  )

}

export default PostStats