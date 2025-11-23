import Loader from "@/components/ui/shared/Loader";
import PostCard from "@/components/ui/shared/PostCard";
import { config } from "@/lib/appwrite/config";
import { QUERY_KEYS } from "@/lib/reactquery/querykeys";
import { useInfiniteDocuments } from "@/lib/reactquery/UseInfinity";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Query } from "appwrite";

function Home() {
  const { ref, inView } = useInView();

  // ⬇️ Infinite scroll for recent posts
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteDocuments({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    collectionId: config.postcollectionId,
    enabled: true,
    filters: [
      Query.orderDesc("$createdAt"),
      Query.limit(10),
      Query.select(["*", "creators.*"]),
    ],
  });

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  if (isError) return <div>Error loading posts.</div>;

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          {isLoading && data?.pages?.length === 0  ? (
            <div className=" flex justify-center h-[70vh] items-center w-full">
              <Loader  />
            </div>
          ) : (
            <>
              <h2 className="h3-bold md:h2-bold text-left w-full text-white">
                Home Feed
              </h2>

              <ul className="flex flex-col flex-1 gap-9 w-full">
                {data?.pages?.map((page:any) =>
                  page.documents.map((post: any) => (
                    <PostCard key={post.$id} post={post} />
                  ))
                )}
              </ul>
            </>
          )}

      {/* Infinite Scroll Loader */}
      {hasNextPage && (
        <div ref={ref} className="mt-10 ">
          <Loader />
        </div>
      )}
        </div>
      </div>

    </div>
  );
}

export default Home;
