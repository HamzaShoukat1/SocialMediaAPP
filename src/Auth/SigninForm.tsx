import z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Loader from "@/components/ui/shared/Loader";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { SigninValidation } from "@/lib/validation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useSigninAccountMutation } from "@/lib/reactquery/queryandmutations";
import { useAppDispatch } from "@/Store/usehook";
import { checkCurrentUser } from "@/Store/AuthThunk";

const SigninForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { mutateAsync: signInAccount, isPending: isSignin } =
    useSigninAccountMutation();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    try {
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        toast("Invalid email or password", {
          style: {
            background: "black",
            color: "white",
            border: "1px solid white",
          },
        });
        return;
      }

      await dispatch(checkCurrentUser());

      toast("Signed in successfully!", {
        style: {
          background: "black",
          color: "white",
          border: "1px solid white",
        },
      });

      navigate("/");
    } catch (error) {
      console.error("Signin error", error);
      toast("Something went wrong", {
        style: {
          background: "black",
          color: "white",
          border: "1px solid white",
        },
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex items-center flex-col">
        <img src="/assets/icons/images/logo.svg" />
        <h2 className="h3-bold md:h2-bold pt-5 text-white">
          Log in to your account
        </h2>
        <p className="text-gray-200 mt-2">
          Welcome back! Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full md:w-1/4 mt-3"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-bold">
                  Email
                </FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-bold">
                  Password
                </FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary mt-2">
            {isSignin ? (
              <div className="flex items-center gap-1">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>

          <p className="flex justify-center mt-2 text-white">
            Don&apos;t have an account?
            <Link to="/sign-up" className="text-purple-300 ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
