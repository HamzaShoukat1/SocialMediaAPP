import { useDeleteSavedPost, useGetCurrentUser, useLikedPost, useSavedPost } from "@/lib/reactquery/queryandmutations";
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
  const {mutate:savePost,isPending:isPostSaving} = useSavedPost()
    const {mutate:deleteSavedPost,isPending:isdeltePost} = useDeleteSavedPost()
    const {data:currentUser}  = useGetCurrentUser()
    // const {data:saveUserPost} = useGetsavedPostsByUser(currentUser?.$id || "")

    // console.log("0",currentUser?.post);
//   useEffect(() => {
//   if (saveUserPost) {
//     console.log("Full saved posts:", saveUserPost);
//   }
// }, [saveUserPost]);

const saveUserPosts = currentUser?.save;
console.log("111222",saveUserPosts);

    
    
    
//who saved the post
const savedPostRecord = saveUserPosts?.find(
  (record:SavedPostDocument) => record?.post?.$id === post?.$id
)      
      console.log("1111",savedPostRecord);
      



      
useEffect(() => {
 setisSaved(savedPostRecord ? true : false)
}, [savedPostRecord])




const handleLikePost= (e: React.MouseEvent)=> {
  e.stopPropagation();
  let newLikes = [...likes!];

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
    
    if(savedPostRecord){
    setisSaved(false)
    deleteSavedPost(savedPostRecord.$id)
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
       {isPostSaving || isdeltePost ? <Loader /> 
       : 
        <img 
        className="cursor-pointer"
        src={`${isSaved ? "/assets/icons/saved.svg" : 
          "/assets/icons/save.svg"  
             }`} 
        width={20}
        height={20}
        onClick={handleSavedPost}
        />
}
      </div>


    </div>
  )

}

export default PostStats