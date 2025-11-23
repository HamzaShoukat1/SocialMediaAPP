import type { Models } from "appwrite"
import GridPostList from "./GridPostList";
import Loader from "./Loader";
import type { PostDocument } from "../forms/Postform";

type SearchProps = {
  issearchfetching:boolean,
  SearchPosts: Models.DocumentList<PostDocument> | undefined

}

function SearchResult({issearchfetching,SearchPosts}:SearchProps) {
  if(issearchfetching) return(
    <div className="">
       <Loader />
    </div>
  )

  if( SearchPosts?.documents && SearchPosts?.documents.length > 0 ){
    return (
      <GridPostList posts={SearchPosts?.documents} />
    )
  }
  return (
    <p className="text-gray-300 mt-10 text-center w-full">
      No result found
    </p>
  )
}

export default SearchResult