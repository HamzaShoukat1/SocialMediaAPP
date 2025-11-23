import { useInfiniteQuery } from "@tanstack/react-query";
import databasesservice from "../appwrite/databases";

export function useInfiniteDocuments({
  queryKey,
  collectionId,
  filters = [],
  enabled = true //for savedpost for fetching curretnuser first so that i show laoder
}: {
  queryKey: string[];
  collectionId: string;
  filters?: any[];
  enabled:boolean
}) {
  return useInfiniteQuery({
    queryKey,
  enabled,
    initialPageParam: null,

    queryFn: ({ pageParam }) =>
      databasesservice.getInfiniteDocuments({
        pageParam,
        collectionId,
        filters,
      }),

    getNextPageParam: (lastPage) => {
      if (!lastPage?.documents?.length) return undefined;

      return lastPage.documents[lastPage.documents.length - 1].$id;
    },
  });
}
