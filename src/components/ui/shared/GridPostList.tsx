import { useAuthContext } from "@/context/Authcontext/AuthContext"
import type { PostDocument } from "../forms/Postform"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"

type Gridprops = {
  posts:PostDocument[]
  showUser?: boolean
  showStats?: boolean
}
function GridPostList({posts,showUser = true, showStats = true}:Gridprops) {
  
  
  const {user} = useAuthContext()
  
  return (
<ul className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">  
  {posts.map((post) => (
    <li key={post.$id} className="relative h-80">
      <Link
        to={`/posts/${post.$id}`}
        className="flex rounded-3xl overflow-hidden w-full h-full"
      >
        <img
          src={post.imageUrl}
          className="h-full w-full object-cover"
          alt="post"
        />
      </Link>

      <div className="absolute bottom-0 flex w-full gap-2 p-5 bg-linear-to-t">
        {showUser && (
          <div className="flex flex-1 items-center gap-2">
            <img
              src={post.creators?.imageUrl}
              className="h-8 w-8 rounded-full "
            />
            <p>{post.creators?.name}</p>
          </div>
        )}

        {showStats && <PostStats post={post} userId={user.id} />}
      </div>
    </li>
  ))}
</ul>

  )
}

export default GridPostList



  // .grid-container {@apply w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5xl;}
  // .grid-post_link {@apply flex rounded-[24px] overflow-hidden cursor-pointer w-full h-full;}
