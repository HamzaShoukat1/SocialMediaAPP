import z from 'zod'
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Loader from '@/components/ui/shared/Loader';
import { toast } from "sonner"
import { useNavigate } from 'react-router-dom';
import { SigninValidation } from '@/lib/validation';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import {  useSigninAccountMutation } from '@/lib/reactquery/queryandmutations';
import { useAuthContext } from '@/context/Authcontext/AuthContext';

const SigninForm = () => {
  const navigate = useNavigate()
  //context
  const {checkCurrentUser} = useAuthContext()

  // query
  const {mutateAsync:SigninAccount,isPending:isSignin} = useSigninAccountMutation()
  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const signinsession = await SigninAccount({
      email:values.email,
      password:values.password
    })
    if(!signinsession) {
     return  toast('Sign in failed.plz try again', {
        style: {
          background: 'black',
          color:'white',
          border: '1px solid white'

        }
        
      })
    }
    const isLoggedIn = await checkCurrentUser()

    
    if(isLoggedIn){
      form.reset();
      toast("Signed in successfully!",{
        style: {
          background: 'black',
          color:'white',
          border: '1px solid white'
          
        }
        
      })
      navigate('/')
    }
    else{
        return  toast('Sign in failed.plz try again', {
        style: {
          background: 'black',
          color:'white',
          border: '1px solid white'
          
        }
        
      })
    }
      
      


  }
  return (
    <Form {...form}>
      <div className='sm:w-420 flex items-center  flex-col'>
        <img src='/assets/icons/images/logo.svg' />
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-4 text-white'>log in to your acount</h2>
        <p className='text-light-3 small-medium  md:base-regular text-gray-200 mt-2' >Welcome back!,plz enter your details</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full md:w-1/4 mt-3 ">
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
          {isSignin ? (
            <div className='flex items-center gap-1'>
              <Loader /> loading...

            </div>
          ) : "Sign in"}
          </Button>
<p className='text-base  flex justify-center items-center mt-2 text-white' >
  Don't have an account?
  <Link to='/sign-up' className='text-purple-300 text-base ml-1'>
  Sign up

  </Link>

</p>
      </form>
      </div>

    </Form>
  );
};

export default SigninForm;
