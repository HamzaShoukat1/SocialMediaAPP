import { Input } from "@/components/ui/input";
import GridPostList from "@/components/ui/shared/GridPostList";
import Loader from "@/components/ui/shared/Loader";
import SearchResult from "@/components/ui/shared/SearchResult";
import useDebounce from "@/hooks/UseDebounce";
import {  useSearchPost } from "@/lib/reactquery/queryandmutations";
import { useEffect, useState } from "react";
import {useInView} from 'react-intersection-observer'
import { useInfiniteDocuments } from "@/lib/reactquery/UseInfinity";
import { QUERY_KEYS } from "@/lib/reactquery/querykeys";
import { config } from "@/lib/appwrite/config";
import {type  PostDocument } from "@/components/ui/forms/Postform";
import { Query, type Models } from "appwrite";
const Explore = () => {
  const {ref,inView} = useInView()
  const [searchValue, setsearchValue] = useState("");
  const debounceValue = useDebounce(searchValue,500)
  const {data,fetchNextPage,hasNextPage} = useInfiniteDocuments({
    
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    collectionId: config.postcollectionId,
      filters: [
      Query.select(["*","creators.*"]),   
    ],
 

    enabled:true


  })
  console.log("mee",data);
  

  useEffect(() => {
    if(inView && !searchValue) fetchNextPage()
  }, [inView,searchValue])

  
const {data:searchpost,isFetching: isSearchFetching} = useSearchPost(debounceValue)



  if(!data){
    return (
      <div className="flex justify-center w-full">
        <Loader />

      </div>
    )
    
  }
    const savedPosts: PostDocument[] =
      data?.pages.flatMap((page:any) =>
        page.documents.map((doc: any) => ({
          ...doc,
          creators: doc.creators
        }))
      ) || [];
      
    

  const shouldshowsearchresults = searchValue !== ''
  // const shouldshowposts = !shouldshowsearchresults && data?.pages?.every((item:any)=> item.documents?.length === 0)
    const shouldshowposts = !shouldshowsearchresults && savedPosts.length === 0

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>

        <div className="flex gap-1 px-4 rounded-lg w-full bg-[#2d2c2c]">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setsearchValue(e.target.value)}
          />
        </div>
      </div>
      {/* //  */}

      <div className="flex  w-full justify-between max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex items-center gap-2 bg-[#2d2c2c] rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-gray-200">All</p>
          <img src='/assets/icons/filter.svg' width={20} height={20} alt="filter" />

        </div>

      </div>

      {/* //  */}

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldshowsearchresults ? (
          <SearchResult issearchfetching={isSearchFetching}
          SearchPosts={searchpost as Models.DocumentList<PostDocument> | undefined} />

        ) : shouldshowposts ? (
          <p className="text-gray-300 mt-10 text-center w-full">End of Posts</p>
        ) : 
          <GridPostList showUser={true} showStats={false} posts={savedPosts}/>

      }

      </div>

{hasNextPage && !searchValue && (
  <div ref={ref} className="mt-10">
    
    <Loader />

  </div>
)}

    </div>
  );
};

export default Explore;
