import Loader from "@/components/ui/shared/Loader"
import { useGetALlusers } from "@/lib/reactquery/queryandmutations"
import UseCard, { type userDocument } from "@/components/ui/shared/UseCard"
import { toast } from "sonner"

const AllUsers = () => {
  const {data:creatorss,isLoading,isError} = useGetALlusers()

  const userss = creatorss?.documents as userDocument[] | undefined

  if(isError){
    toast('Something went wrong')
    return
  }

  return (
    <div className=" common-container">
      <div className="user-container">
                <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
                {isLoading && !creatorss ? (
                  <Loader/>
                ): (
                  <ul className=" grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                    {userss?.map((c)=> (
                      <li key={c.$id} className="flex-1 min-w-[200px] w-full">
                        <UseCard user={c}/>


                      </li>
                    ))}

                  </ul>
                )}

      </div>
      
    </div>
  )
}

export default AllUsers







// grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]

//  .common-container {@apply flex flex-col flex-1 items-center gap-10  py-10 px-5 md:px-8 lg:p-14;}
  //.user-container {@apply max-w-5xl flex flex-col items-start w-full gap-6 md:gap-9;}