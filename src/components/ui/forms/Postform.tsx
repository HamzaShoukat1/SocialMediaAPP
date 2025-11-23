import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validation"
import type { Models } from "appwrite"
import { useAuthContext } from "@/context/Authcontext/AuthContext"
import { useCreatePostmutaion, useUpdatePost } from "@/lib/reactquery/queryandmutations"
import {toast} from 'sonner'
import { Loader } from "lucide-react"

export type PostDocument = Models.Document & {
  caption: string
  location?: string
  imageId:string,
  imageUrl: string 

    likes?: Models.Document[] //for poststats
  tags: string[]
  creators:{
    $id:string,
    name:string,
    username?:string,
    imageUrl:string
    accountId:string
  }
}

export type PostFormProps = {
  post?: PostDocument 
  action: "Create" | "Update"

}

const Postform = ({ post,action }: PostFormProps) => {
    const navigate = useNavigate()
    const {mutateAsync: createPost, isPending:isLoading} = useCreatePostmutaion()
    const {mutateAsync: updatePost,isPending: isLoadingUpdate} = useUpdatePost()
    const {user} = useAuthContext()

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post?.caption || "",
      file: [],
      location: post?.location || "",
      tags: post?.tags?.join(",") || "",
    },
  })

   async function onSubmit(values: z.infer<typeof PostValidation>) {
  if (post && action === 'Update'){
    const UpdatePost = await updatePost({
      ...values,
      postId:post.$id,
      imageId:post.imageId,
       imageUrl:post?.imageUrl

    })
    console.log(UpdatePost);
    
    if(!UpdatePost){
       toast.error('try again please', {
      style: {
        backgroundColor:'black',
        color:'white',
        border: '1px solid white'

      }
    });
     

  };
   toast.success('post updated successfully', {
      style: {
        backgroundColor:'black',
        color:'white',
        border: '1px solid white'

      }
    });
  navigate(`/posts/${post.$id}`)
  return;
   
  }
    console.log(values)
       const newPost =  await createPost({
        ...values,
        userId: user.id,
    })
    if(!newPost){
         return  toast('try again plz', {
        style: {
          background: 'black',
          color:'white',
          border: '1px solid white'

        }
        
      })
    }
    toast.success('post created successfullt', {
      style: {
        backgroundColor:'black',
        color:'white',
        border: '1px solid white'

      }
    })
    navigate('/')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white ">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="bg-[#212121] text-white text-xs border-0 h-30"
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl ||''} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="bg-[#212121] text-xs text-white border-0"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="JS, React, NEXTJS"
                  className="bg-[#212121] text-white text-xs border-0"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3 justify-end">
          <Button
            className="text-white px-2 py-2 bg-[#212121] text-xs w-20 rounded-full cursor-pointer"
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="shad-button_primary text-[12px] w-24 flex items-center justify-center gap-2   rounded-2xl cursor-pointer"
            type="submit"
            disabled={ isLoading || isLoadingUpdate}
          >
           {isLoading || isLoadingUpdate && (
            <Loader  className=""/>

           )
            }
        <span>{action} post</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default Postform




