import { useInfiniteQuery, type InfiniteData, type QueryFunctionContext, } from "@tanstack/react-query";
import databasesservice from "../appwrite/databases";
import type { Models } from "appwrite";

interface UseInfiniteDocumentsProps {
  queryKey: string[];
  collectionId: string;
  filters?: any[];
  enabled?: boolean;
}

export function useInfiniteDocuments({
  queryKey,
  collectionId,
  filters = [],
  enabled = true,
}: UseInfiniteDocumentsProps) {
  return useInfiniteQuery<
    Models.DocumentList<Models.Document>, // type of each page
    Error, // error type
    InfiniteData<Models.DocumentList<Models.Document>>, // data type returned from queryFn
    string[] // query key type
>({
    queryKey,
    enabled,
    initialPageParam: null,
    queryFn: async ({ pageParam }: QueryFunctionContext<string[]>) => {
      return databasesservice.getInfiniteDocuments({
        pageParam: pageParam as string | null,
        collectionId,
        filters,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.documents?.length) return undefined;
      return lastPage.documents[lastPage.documents.length - 1].$id;
    },
  });
}
