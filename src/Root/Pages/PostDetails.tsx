import { useDeletePost, usegetPostByID } from "@/lib/reactquery/queryandmutations";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/ui/shared/Loader";
import { formatTimeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import PostStats from "@/components/ui/shared/PostStats";
import { toast } from "sonner";
import { useAppSelector } from "@/Store/usehook";


const PostDetails = () => {
  const {mutate:deletePost} = useDeletePost()
    const { user } = useAppSelector(state => state.auth);
  
  const { id } = useParams();
  const navigate = useNavigate()

  const { data: post, isPending } = usegetPostByID(id || "");
  const handleDelPost =()=> {
    deletePost({postId:id ?? "",imageId: post?.imageId ?? ""})
    toast.success('post deleted!', {
      style: {
          background: 'black',
          color:'white',
          border: '1px solid white'
          
        }
    })
    navigate(-1)
  }

  return (
    <div className="post_details-container ">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card ">
          <img src={post?.imageUrl}
           alt="post" className=" post_details-img 
           " />
            <div className="post_details-info">
                <div className="justify-between flex w-full">
                  {/* //1 */}
                     <Link to={`/profile/${post?.creators?.$id}`} className="flex items-center gap-3">
              <img
                src={
                  post?.creators?.imageUrl ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt=""
                className="rounded-full w-8 h-8  lg:h-12  object-cover"
              />
             

            <div className="flex flex-col">
              <p className="text-white base-medium lg:body-bold">
                {post?.creators?.name || "unknown "}
              </p>
              <div className="flex items-center gap-2 text-gray-500">
                <p className="subtle-semibold lg:small-regular">
                  {formatTimeAgo(post?.$createdAt || "")}
                </p>
                <p className="subtle-semibold lg:small-regular">
                  {post?.location}
                </p>
              </div>
            </div>









          </Link>
          {/* // 2*/}
          <div className="flex items-center ">
            <Link to={`/edit-post/${post?.$id}`} className={`${user.id !== post?.creators.$id && "hidden"}`}>
            <img src="/assets/icons/edit.svg" width={24} height={23} />
            </Link>
            <Button

            onClick={handleDelPost}
            variant='ghost'
            className={`${user.id !== post?.creators.$id && "hidden"}`}
            >
              <img src="/assets/icons/delete.svg"
              className="cursor-pointer"
              alt="del"
              width={24}
              height={24} />

            </Button>

          </div>
                </div>


                {/* //  */}

                <hr className="border w-full border-dark-4/100" />
                 <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
            <p>{post?.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post?.tags.map((tag:string)=> (
                <li className="text-gray-400" key={tag}>
                  #{tag}

                </li>
              ))}

            </ul>

          </div>
          {/* // */}
          <div className="w-full">
            <PostStats post={post} userId={user.id} />

          </div>

              </div>
        

        </div>
      )}
    </div>
  );
};

export default PostDetails;





//  .post_details-card {@apply w-full max-w-5xl rounded-[30px] flex-col flex xl:flex-row  xl:rounded-l-[24px];}
