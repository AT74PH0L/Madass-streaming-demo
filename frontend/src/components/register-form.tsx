
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button1";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as yup from "yup";
import { registerApi } from "@/api/registerApi";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import NotificationToast from "./ui/NotificationToast";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const formik = useFormik({
    initialValues: {
      email: "",
      fname: "",
      lname: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Invalid email").required("Email is required"),
      fname: yup.string().required("First name is required"),
      lname: yup.string().required("Last name is required"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      const response = await registerApi(
        values.fname,
        values.lname,
        values.email,
        values.password
      );
      if (response instanceof AxiosError) {
        toast.error(response.response?.data.message);
      } else {
        toast.success("Register success");
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
            {/* Email */}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                {...formik.getFieldProps("email")}
                id="email"
                type="email"
                placeholder="m@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>

            {/* First Name & Last Name */}
            <div className="flex flex-row gap-4">
              <div className="w-1/2 grid gap-3">
                <Label htmlFor="fname">First Name</Label>
                <Input
                  {...formik.getFieldProps("fname")}
                  id="fname"
                  type="text"
                  placeholder="John"
                />
                {formik.touched.fname && formik.errors.fname && (
                  <p className="text-red-500 text-sm">{formik.errors.fname}</p>
                )}
              </div>
              <div className="w-1/2 grid gap-3">
                <Label htmlFor="lname">Last Name</Label>
                <Input
                  {...formik.getFieldProps("lname")}
                  id="lname"
                  type="text"
                  placeholder="Doe"
                />
                {formik.touched.lname && formik.errors.lname && (
                  <p className="text-red-500 text-sm">{formik.errors.lname}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                {...formik.getFieldProps("password")}
                id="password"
                type="password"
                placeholder="Enter password"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                {...formik.getFieldProps("confirmPassword")}
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>

          {/* Sign-in Link */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/" className="underline underline-offset-4">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>

      <NotificationToast/>
    </div>
  );
}
