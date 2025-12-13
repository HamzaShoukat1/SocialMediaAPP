import type { PostDocument } from "@/components/ui/forms/Postform";
import { config } from "@/lib/appwrite/config";
import GridPostList from "@/components/ui/shared/GridPostList";
import Loader from "@/components/ui/shared/Loader";
import { useGetCurrentUser } from "@/lib/reactquery/queryandmutations";
import { QUERY_KEYS } from "@/lib/reactquery/querykeys";
import { Query } from "appwrite";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteDocuments } from "@/lib/reactquery/UseInfinity";

const Saved = () => {
  const { data: currentUser, isPending: isUserPending } = useGetCurrentUser();

  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteDocuments({
    queryKey: [QUERY_KEYS.GET_SAVED_POSTS],
    collectionId: config.savescollectionId,     
    filters: [
      Query.equal("user", currentUser?.$id || ''),     
      Query.limit(10),
      Query.select(["*", "post.*", "post.creators.*"]),   
    ],
    enabled: !!currentUser?.$id
  });
  console.log("hello",data);
  

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  if (isUserPending || isLoading ) return <Loader />;

  // Extract posts from saved documents
  const savedPosts: PostDocument[] =
    data?.pages.flatMap((page: any) =>
      page.documents.map((doc: any) => ({
        ...doc.post,
        creators: doc.post?.creators,
      }))
    ) || [];
    

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      <ul className="w-full flex justify-center max-w-5xl gap-9">
        {savedPosts.length === 0  ? (
          <p className="text-light-4">No saved posts</p>
        ) : (
          <GridPostList posts={savedPosts} showStats={false} />
        )}
      </ul>

      {/* infinite scroll loader */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-6">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Saved;
