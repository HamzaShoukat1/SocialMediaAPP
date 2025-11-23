import z from 'zod'
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Loader from '@/components/ui/shared/Loader';
import { toast } from "sonner"
import { useNavigate } from 'react-router-dom';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Signupvalidation } from "@/lib/validation";
import { Link } from 'react-router-dom';
import { usecreateAccountMutation, useSigninAccountMutation } from '@/lib/reactquery/queryandmutations';
import { useAuthContext } from '@/context/Authcontext/AuthContext';


const SignupForm = () => {
  const navigate = useNavigate()
  //context
  const {checkCurrentUser,isLoading:isUserLoading} = useAuthContext()

  // query
  const {mutateAsync: createUserAccount,isPending: isCreatingUser} = usecreateAccountMutation()
  const {mutateAsync:SigninAccount} = useSigninAccountMutation()
  // 1. Define your form.
  const form = useForm<z.infer<typeof Signupvalidation>>({
    resolver: zodResolver(Signupvalidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: ""
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof Signupvalidation>) {
    const newUser = await createUserAccount(values)
    if(!newUser) {
      return toast('Sign up failed.plz try again', {
        style: {
          background: 'black',
          color:'white',
          border: '1px solid white'

        }
      })

    }
    const signinsession = await SigninAccount({
      email:values.email,
      password:values.password
    })
    if(!signinsession) {
      toast('Sign in failed.plz try again', {
        style: {
          background: 'black',
          color:'white',
          border: '1px solid white'

        }
        
      })
    }
    const isLoggedIn = await checkCurrentUser()
    if(isLoggedIn){
      form.reset()
      toast("Sign up successfully!",{
        style: {
          background: 'black',
          color:'white',
          border: '1px solid white'
          
        }
        
      })
      navigate('/')
    }else{
        return  toast('Sign in failed.plz try again', {
        style: {
          background: 'black',
          color:'white',
          border: '1px solid white'
          
        }
        
      })
    }
      
      


    console.log(newUser);
  }
  return (
    <Form {...form}>
      <div className='sm:w-420 flex items-center  flex-col'>
        <img src='/assets/icons/images/logo.svg' />
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-4 text-white'>Create a new Account</h2>
        <p className='text-light-3 small-medium  md:base-regular text-gray-200 mt-2' >To use snapgram,enter your details</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full md:w-1/4 mt-3 ">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white  font-bold text-base'>name</FormLabel>
              <FormControl>
                <Input type='text' className='shad-input'{...field} />
              </FormControl>
             
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
           <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white  font-bold text-base'>Username</FormLabel>
              <FormControl>
                <Input type='text' className='shad-input'{...field} />
              </FormControl>
             
              <FormMessage  className='text-red-500'/>
            </FormItem>
          )}
        />
             <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white  font-bold text-base'>Email</FormLabel>
              <FormControl>
                <Input type='email' className='shad-input'{...field} />
              </FormControl>
             
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
             <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white  font-bold text-base'>Password</FormLabel>
              <FormControl>
                <Input type='password' className='shad-input'{...field} />
              </FormControl>
             
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        <Button type="submit" className='shad-button_primary mt-2 '>
          {isCreatingUser ? (
            <div className='flex items-center gap-1'>
              <Loader /> loading...

            </div>
          ) : "Sign up"}
          </Button>
<p className='text-base  flex justify-center items-center mt-2 text-white' >
  Already have an account?
  <Link to='/sign-in' className='text-purple-300 text-base ml-1'>
  Log in

  </Link>

</p>
      </form>
      </div>

    </Form>
  );
};

export default SignupForm;
