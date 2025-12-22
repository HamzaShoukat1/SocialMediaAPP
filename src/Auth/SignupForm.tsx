import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/shared/Loader"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Signupvalidation } from "@/lib/validation"
import {
  usecreateAccountMutation,
  useSigninAccountMutation,
} from "@/lib/reactquery/queryandmutations"
import { useAuthContext } from "@/context/Authcontext/AuthContext"

const SignupForm = () => {
  const navigate = useNavigate()
  const { checkCurrentUser } = useAuthContext()

  const { mutateAsync: createUserAccount, isPending } =
    usecreateAccountMutation()
  const { mutateAsync: signInAccount } = useSigninAccountMutation()

  const form = useForm<z.infer<typeof Signupvalidation>>({
    resolver: zodResolver(Signupvalidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof Signupvalidation>) {
    try {
      // 1. Create account
      await createUserAccount(values)

      // 2. Sign in
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      })

      if (!session) {
        throw new Error("Signin failed")
      }

      // 3. Update auth context
      await checkCurrentUser()

      // 4. Success
      form.reset()
      toast("Sign up successful!", {
        style: {
          background: "black",
          color: "white",
          border: "1px solid white",
        },
      })

      navigate("/")
    } catch (error) {
      toast("Sign up failed. Please try again", {
        style: {
          background: "black",
          color: "white",
          border: "1px solid white",
        },
      })
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex flex-col items-center">
        <img src="/assets/icons/images/logo.svg" />

        <h2 className="h3-bold md:h2-bold pt-5 text-white">
          Create a new Account
        </h2>
        <p className="text-gray-200 mt-2">
          To use snapgram, enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full md:w-1/4 mt-3"
        >
          {["name", "username", "email", "password"].map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-bold capitalize">
                    {fieldName}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={fieldName === "password" ? "password" : "text"}
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="shad-button_primary mt-2">
            {isPending ? (
              <div className="flex items-center gap-1">
                <Loader /> loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>

          <p className="text-white flex justify-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-purple-300 ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
