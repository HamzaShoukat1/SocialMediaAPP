  import { Link } from "react-router-dom"
  import type { PostDocument } from "../forms/Postform"
  import { formatTimeAgo } from "@/lib/utils";
  import PostStats from "./PostStats";
import { useAppSelector } from "@/Store/usehook";


  type PostCardProps = {
      post:PostDocument
     
      

  }


  const PostCard = ({post}:PostCardProps) => {
      const { user } = useAppSelector(state => state.auth);
    

    // const isAuther = user && post ?
    // ( user.id === post.$id ? "flex" : "hidden") : "hidden"
    // if(!post.creators) return 
    // console.log("%c color: black", post);
    
    // console.log("12121212",post?.creators);
    return(
      <div className="post-card">

          <div className="flex justify-between">
            {/* //  */}
              <div className="flex items-center gap-3 ">
                  <Link  to={`/profile/${post.creators?.$id}`}>
                  
                  <img  src={post.creators?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt=""
                  className="rounded-full w-12  object-cover lg:h-12"/>
                  </Link>

                  <div className="flex flex-col">
                      <p className="text-white base-medium lg:body-bold">{post.creators?.name || 'unknown '}</p>
                    <div className="flex items-center gap-2 text-gray-500">
                        <p className="subtle-semibold lg:small-regular">{formatTimeAgo(post.$createdAt)}</p>
                      <p className="subtle-semibold lg:small-regular">{post.location}</p>
                    </div>

                  </div>
              </div>
  {/* //  */}


  <Link to={`/edit-post/${post.$id}`  } >


  {/* className={`${user.id !== post.creators.$id && "hidden"}`} */}
  <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20}  className={`cursor-pointer ${user.id !== post.creators.$id && "hidden"}`}
  

  />

  </Link>


          </div>

          {/* //post details  */}
          <Link to={`/posts/${post.$id}`}>
          <div className="small-medium lg:base-medium py-5">
            <p>{post.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post.tags.map((tag:string)=> (
                <li className="text-gray-400" key={tag}>
                  #{tag}

                </li>
              ))}

            </ul>

          </div>

          <img src={post.imageUrl || 'assets/icons/profile-placeholder.svg'}
          className="post-card_img mt-2 bg-amber-200" alt="post img" />

          </Link>
          <PostStats post={post} userId={user.id} />
          
      </div>
      
    )
  }

  export default PostCard

    // .post-card_img {@apply h-64 xl:h-[400px] lg:h-[450px] w-full rounded-[24px] object-cover mb-5;}
