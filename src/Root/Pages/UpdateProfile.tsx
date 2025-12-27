import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate,useParams } from "react-router-dom"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileValidation } from "@/lib/validation";
import {ProfileUploader} from "@/components/ui/shared/ProfileUploader";
import { usegetUserDetails } from "@/lib/reactquery/queryandmutations";
import { useUpdateUser } from "@/lib/reactquery/queryandmutations";
import Loader from "@/components/ui/shared/Loader";
import { useAppDispatch, useAppSelector } from "@/Store/usehook";
import { updateUser } from "@/Store/AuthSlice";

const UpdateProfile = () => {
    const { user } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
  
  const navigate = useNavigate()
  const {id} = useParams()
    const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: null,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });

  const {data:currentUser} = usegetUserDetails(id || "")
  
  const {mutateAsync: updateProfile,isPending:isLoadingUpdate} = useUpdateUser()

  if(!currentUser){
    return (
      <div className="flex items-center w-full h-full">
        <Loader />
      </div>
    )
  };
  //handler

  const handleUpdate = async(
    value: z.infer<typeof ProfileValidation>)=> {
  try {
      const updatedUser = await updateProfile({
        userId: currentUser.$id,
        name:value.name,
        bio: value.bio,

        file: value.file ?? undefined,
        imageUrl:currentUser.imageUrl,
        imageid:currentUser.imageid,
      })
      
  
      if(!updatedUser){
       toast("Update user failed, please try again");
       return
  
      };
      // setUser({
      //   ...user,
      //   name:updatedUser?.name,
      //   bio:updatedUser?.bio,
      //   imageUrl:updatedUser?.imageUrl
      // });
      dispatch(
        updateUser({
          name:updatedUser.name,
          bio:updatedUser.bio,
          imageUrl:updatedUser.imageUrl
        })
        
      )
      return navigate(`/profile/${id}`)
  } catch (error) {
        toast("Something went wrong. Please try again.");
    
  }

  }


  return (
   <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label ">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input text-gr00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4 cursor-pointer"
                onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate}>
                {isLoadingUpdate && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
  


export default UpdateProfile