import Postform from "@/components/ui/forms/Postform"
import { usegetPostByID } from "@/lib/reactquery/queryandmutations"
import { useParams } from "react-router-dom"

const EditPost = () => {
  const {id} = useParams()
  const {data:post,isPending} = usegetPostByID(id || '')

  // if(isPending) return (
  //   <div className="flex justify-center  items-center">
  //     <Loader />
  //   </div>
  // )

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1  items-start gap-10 py-10 px-5 md:px-10 lg:p-14"> 
        <div className="max-w-5xl gap-3 flex items-start justify-start">
          <img src="/assets/icons/add-post.svg"
          width={36}
          height={36}
          alt="add-post"
           />
           <h2 className="h3-bold md:h2-bold text-left text-white w-full">Edit Post</h2>
        </div>

        <Postform action="Update" post={post} />

      </div>
      
    </div>
  )
}

export default EditPost


  // .common-container {@apply flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14;}
