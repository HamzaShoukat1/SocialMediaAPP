export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: string
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};
export type SigninUser = {
  email: string;
  password: string;
};

export type IContextType = {
  user:IUser
  isLoading:boolean
  isauthenticated:boolean
  setIsauthenticated:React.Dispatch<React.SetStateAction<boolean>>
  setUser:React.Dispatch<React.SetStateAction<IUser>>
checkCurrentUser: ()=> Promise<boolean>
};

export type AppwriteDocument<T> = T & {
  $id: string
  $collectionId: string
  $databaseId: string
  $createdAt: string
  $updatedAt: string
  $permissions: string[]
  $sequence?: number
   caption: string
  imageUrl: string
  location?: string
  tags: string[]
}