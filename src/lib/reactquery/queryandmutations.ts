import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery
} from '@tanstack/react-query'
import  authservice from '../appwrite/auth'
import type { INewPost, INewUser, IUpdatePost, SigninUser } from '../types/types'
import databasesservice from '../appwrite/databases'
import { QUERY_KEYS } from './querykeys'
import type { PostDocument } from '@/components/ui/forms/Postform'
export const usecreateAccountMutation = ()=> {
  return useMutation({
    mutationFn: (user:INewUser)=> authservice.createUserAccount(user)
  })
}
export  const useSigninAccountMutation = ()=> {
  return useMutation({
    mutationFn: (user:SigninUser)=> authservice.SignInAccount(user)
  })
} 

export const useSIgnoutAccountmutation = ()=> {
  return useMutation({
    mutationFn: authservice.SignoutAccount
  })

}
export const useCreatePostmutaion = ()=> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post:INewPost)=> databasesservice.createPost(post),
    onSuccess: ()=> {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })

}

// // export const useGetRecentPosts = ()=> {
// //   return useQuery<PostDocument[]>({
// //     queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
// //     queryFn:()=> databasesservice.getRecentPosts(),
// //         staleTime: 1000 * 60, 
        
// //   })
// };

export const useLikedPost =  ()=> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ( {postId,likesArray}: {postId: string; likesArray: string[]}) =>
      databasesservice.likePost(postId,likesArray),
    onSuccess: (data)=> {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
      });
          queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      });
          queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      });
            queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })



    }
      

    
  })
};
export const useSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      databasesservice.savePost(postId, userId),

    onSuccess: (_data, { userId }) => {
      // Invalidate queries so UI updates correctly
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER_SAVED_POST, userId] });
    },
  });
};
export const useGetSavedRecord = (userId: string, postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_SAVED_POST, userId, postId],
    queryFn: () => databasesservice.getSavedRecord(userId, postId),
    enabled: !!userId && !!postId
  });
};



export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ savedRecordId }: { savedRecordId: string,userId:string },) =>
      databasesservice.deletesavePost(savedRecordId),

    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_SAVED_POST, userId],
      })
    },
  })
}

export const useGetCurrentUser = ()=> {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn:  ()=> authservice.getCurreentUser()
  })
};

export const usegetPostByID = (postId:string)=> {
  return useQuery<PostDocument>({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID,postId],
    queryFn: ()=> databasesservice.getPostById(postId) as unknown as PostDocument,
    enabled: !!postId //“Only fetch the post if we actually have a postId.”
    //So we write enabled: !!postId to prevent the query from running before we have a valid post ID — avoiding wasted requests and errors.
  })
};
export const useUpdatePost = ()=> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:(post:IUpdatePost)=> databasesservice.UpdatePost(post), 
    onSuccess: (data)=> {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID,data?.$id]
      })

    }
  })

};
export const useDeletePost = ()=> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:({postId,imageId}: {postId:string,imageId:string})=> databasesservice.deletesPost(postId,imageId), 
    onSuccess: ()=> {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })

    }
  })

};
// export const usegetPostsforexplore = () => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//     queryFn: ()=> {
//     return   databasesservice.getInfinityPostforexplore()
//     }
//   })
                                                                            

//   // queryFn: () =>
//   //   databasesservice.getInfinityPostforexplore(),
//   // return useInfiniteQuery({

//   //   initialPageParam: null,


//   //   getNextPageParam: (lastPage) => {
//   //     if (!lastPage?.documents?.length) return undefined;

//   //     const lastId = lastPage.documents[lastPage.documents.length - 1].$id;

//   //     return lastId;
//   //   },
//   // });
// };








export const useSearchPost = (searchTerm: string)=> {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS,searchTerm],
    queryFn: ()=> databasesservice.searchPosts(searchTerm),
    enabled: !!searchTerm

  })

};
//never use this {} in mutation func
export const UseDeletePost = ()=> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({postId,imageId}: {postId:string,imageId: string})=> 
      databasesservice.deletesPost(postId,imageId),
      onSuccess: ()=> {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        })
      }

    
  })  

}


