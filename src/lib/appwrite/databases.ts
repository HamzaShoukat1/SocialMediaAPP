import { Client, Databases, Storage,Query ,ID,  } from "appwrite";
import { config } from "./config";
import type { INewPost, IUpdatePost, IUser } from "../types/types";
import type { PostDocument } from "@/components/ui/forms/Postform";


export class DatabasesService {
  client = new Client();
  databases: Databases;
  storage: Storage;

  constructor() {
    this.client
      .setProject(config.projectId)
      .setEndpoint(config.projectUrl);

    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async saveUsertoDB(user: {
    accountId: string;
    name: string;
    email: string;
    imageUrl: string;
    username?: string;
  }) {
    try {
      const newUser = await this.databases.createDocument(
        config.databasesId,
        config.userscollectionId,
        ID.unique(),
        {
          accountId: user.accountId,
          name: user.name,
          email: user.email,
          username: user.username,
          imageUrl: user.imageUrl,
        }
      );

      return newUser;
    } catch (error) {
      console.error(" Error saving user:", error);
      throw error;
    }
  }

  // ✅ Create a post
  async createPost(post: INewPost) {
    try {
      // Upload image to storage
      const uploadedFile = await this.uploadFile(post.file[0]);
      if (!uploadedFile) throw new Error("File upload failed");

      // Get public file preview URL
      const fileUrl =  this.getfileView(uploadedFile.$id);

      if (!fileUrl) {
        await this.deleteFile(uploadedFile.$id);
        throw new Error("Failed to generate file preview URL");
      }

      // Convert comma-separated tags → array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];

      // Save post document to Appwrite database
      const newPost = await this.databases.createDocument(
        config.databasesId,
        config.postcollectionId,
        ID.unique(),
        {
          creators: post.userId, 
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id, //for delt image
          location: post.location,
          tags: tags,
        }
      );

      return newPost;
    } catch (error) {
      console.error(" Error creating post:", error);
      throw error;
    }
  }

  async uploadFile(file: File) {
    try {
      const uploadedFile = await this.storage.createFile(
        config.storageId,
        ID.unique(),
        file
      );
      return uploadedFile;
    } catch (error) {
      console.error(" Error uploading file:", error);
      throw error;
    }
  }

   getfileView(fileId: string) {
    try {
      const fileUrl = this.storage.getFileView(
        config.storageId,
        fileId,
      );

      // The SDK returns a URL object → convert to string
      return  String(fileUrl);
    } catch (error) {
      console.error(" Error generating file preview:", error);
      throw error;
    }
  }

  async deleteFile(fileId: string) {
    try {
      await this.storage.deleteFile(config.storageId, fileId);
      return { status: "ok" };
    } catch (error) {
      console.error(" Error deleting file:", error);
      throw error;
    }
  }

// async getRecentPosts(){
//     const posts = await this.databases.listDocuments(
//       config.databasesId,
//       config.postcollectionId,
//       [Query.orderDesc("$createdAt"), 
//         Query.limit(20),
//           Query.select(['*', 'creators.*'])
//       ],
//     );

//     if (!posts || !posts.documents) return [];

//     // Map Appwrite documents into your PostDocument type
//     // const postDocuments: PostDocument[] = posts.documents.map((doc: Models.Document) => {
//     //   // Access your custom fields from doc.data
//     //   const data = doc as {
//     //     caption?: string;
//     //     imageUrl?: string;
//     //     location?: string;
//     //     likes?:Models.Document[]
//     //     tags?: string[];
//     //   };

//     //   return {
//     //     ...doc,
//     //     caption: data.caption ?? "",
//     //     imageUrl: data.imageUrl ?? "",
//     //     location: data.location,
//     //    likes: data.likes ?? [],
//     //     tags: data.tags ?? [],
//     //   };
//     // });
//     console.log("222",posts);

//     return posts.documents as unknown as PostDocument[]
    
//   }

  async likePost(postId: string, likesArray: string[]){
    try {
      // console.log("🟢 Updating likes for post:", postId);
    // console.log("🟢 likesArray being sent to Appwrite:", likesArray);
      const updatePost = await this.databases.updateDocument(
        config.databasesId,
        config.postcollectionId,
        postId,
        {
          likes: likesArray
        }

      )
      if(!updatePost) throw Error
      return updatePost
      
    } catch (error) {
      console.log(error);
      
      
    }
  }

  async getSavedRecord(userId: string, postId: string) {
  try {
    const result = await this.databases.listDocuments(
      config.databasesId,
      config.savescollectionId,
      [
        Query.equal("user", userId),
        Query.equal("post", postId),
      ]
    );
    return result;
  } catch (err) {
    console.error("Error fetching saved record", err);
    return null;
  }
}

  async savePost(postId: string,userId: string,){
    try {
      const updatePost = await this.databases.createDocument(
        config.databasesId,
        config.savescollectionId,
        ID.unique(),
        {
          user: userId,
          post: postId,
        }
        
        
      )
      if(!updatePost) throw Error
      return updatePost
      
    } catch (error) {
      console.log(error);
      
      
    }




    
  }
   async deletesavePost(savedRecordId: string){
    try {
      const statusCode = await this.databases.deleteDocument(
        config.databasesId,
        config.savescollectionId,
        savedRecordId,
      

      )
      if(!statusCode) throw Error
      return {status: "ok"}
      
    } catch (error) {
      console.log(error);
      
      
    }















    
  };
  // fetch saved post for specific users 
  // async useGetSavedPostsByUser(userId:string,){
   

  //   try {
  //     const res = await this.databases.listDocuments(
  //       config.databasesId,
  //       config.savescollectionId,
  //       [Query.equal("user",userId),
  //             Query.select(["*", "post.*"])  
              


  //       ],


  //     );

  //     return res.documents
      
  //   } catch (error) {
  //     console.log(error);
      
      
  //   }
  // };


  async getPostById(postId:string): Promise<PostDocument>{
    
      
      const post = await this.databases.getDocument(
        config.databasesId,
        config.postcollectionId,
        postId,
        [
                    Query.select(['*', 'creators.*']) 

        ]
      )
      return post as unknown as PostDocument
    

  };
  
   async UpdatePost(post: IUpdatePost) {
    const hasFiletoUpdate = post.file.length > 0
    try {
      let image = {
        imageUrl:post.imageUrl,
        imageId:post.imageId
      }
      if(hasFiletoUpdate){
        const uploadedFile = await this.uploadFile(post.file[0]);
        if (!uploadedFile) throw new Error("File upload failed");
         // Get public file preview URL
      const fileUrl =  this.getfileView(uploadedFile.$id);

      if (!fileUrl) {
        await this.deleteFile(uploadedFile.$id);
        throw new Error("Failed to generate file preview URL");
      }
      image = {...image, imageUrl: fileUrl,imageId:uploadedFile.$id} 

      }
 
     

      // Convert comma-separated tags → array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];

      // Save post document to Appwrite database
      const UpdatePost = await this.databases.updateDocument(
        config.databasesId,
        config.postcollectionId,
        post.postId,
        {
          caption: post.caption,
          imageUrl: image.imageUrl,
          imageId: image.imageId, //for delt image
          location: post.location,
          tags: tags,
        }
      );
      if(!UpdatePost){
        await this.deleteFile(post.imageId)
      }

      return UpdatePost;
    } catch (error) {
      console.error(" Error creating post:", error);
      throw error;
    }
  };

  async  deletesPost(postId:string,imageId: string){
    if(!postId || !imageId) throw Error
    try {
      await this.databases.deleteDocument(
        config.databasesId,
        config.postcollectionId,
        postId
      )
      return {status: 'ok'}
      
    } catch (error) {
      console.log(error);
      
      
    }

  };
  
// async getInfinityPostforexplore() {
//   // const queries: any[] = [
//   //   Query.orderDesc("$updatedAt"),
//   //   Query.limit(15),
//   //   Query.select(["*", "creators.*"]),
//   // ];

//   // if (pageParam) {
//   //   queries.push(Query.cursorAfter(pageParam));
//   // }

//   try {
//     const posts = await this.databases.listDocuments(
//       config.databasesId,
//       config.postcollectionId,
//       // queries
//     );

//     if (!posts) throw new Error("No posts found");
//     return posts;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }


  async searchPosts(searchTerm:string){
    
    try {
      const posts = await this.databases.listDocuments(
        config.databasesId,
        config.postcollectionId,
        [Query.search('caption',searchTerm),
                Query.select(["*","creators.*"]),   

        ]

      );
      if(!posts) throw Error
      return posts
      
    } catch (error) {
      console.log(error);
      
      
    }

  };
  
  async getInfiniteDocuments({
  pageParam,
  collectionId,
  filters = [],
}: {
  pageParam: string | null;
  collectionId: string;
  filters?: any[];
}) {
  const queries = [
    Query.orderDesc("$updatedAt"),
    Query.limit(10),
    ...filters
  ];


  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  return await this.databases.listDocuments(
    config.databasesId,
    collectionId,
    queries
  );
};

//getUserById
 async getUserById(userId:string){
  
    const user = await this.databases.getDocument(
      config.databasesId,
      config.userscollectionId,
      userId,
      [
                  Query.select(['*', 'posts.*'])
]
    );
    if(!user) throw new Error
  
    return user 
  } 



  

  
  
}

const databasesservice = new DatabasesService();
export default databasesservice;
