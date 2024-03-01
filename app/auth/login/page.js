"use client";
import StandardInputWIthLabel from "@/app/lib/Input/StandardInputWIthLabel";
import StandardButtonGreen from "@/app/lib/Buttons/StandardButtonGreen";
import { useState } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();
  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (res.error) {
      console.log("Error while logging in: ", JSON.stringify(res.error));
      setError("Your credentials do not match");
      return;
    }

    // Assuming user is successfully logged in
    // Now we will use an RPC call to get the user related data
    // Here I'm assuming that you have an RPC endpoint set up at '/get_user_data'
    // And that Supabase has been configured to include the user token in its API calls
    try {
      const user = res.data.user;
      const { data, error } = await supabase.rpc('get_user_data', { user_id: user.id });

      if (error) {
        console.error("Error fetching user data: ", JSON.stringify(error));
        setError("Failed to retrieve user details");
        return;
      }

      // Assuming the RPC call returns the necessary data correctly
      // Store the retrieved data in local storage
      const userData = data[0]; // We expect the data array to have one object containing all the user data

      localStorage.setItem('companyDetails', JSON.stringify({ id: userData.company_id, name: userData.company_name }));
      localStorage.setItem('employeeDetails', JSON.stringify({ id: userData.employee_id, firstname: userData.employee_firstname, lastname: userData.employee_lastname }));
      localStorage.setItem('departmentDetails', JSON.stringify({ id: userData.department_id, name: userData.department_name }));
      localStorage.setItem('managerDetails', JSON.stringify({ id: userData.manager_id }));
      localStorage.setItem('categories', JSON.stringify(userData.categories));
      localStorage.setItem('departments', JSON.stringify(userData.departments));

      // Redirect to the dashboard after successful login and data retrieval
      router.push("/dashboard");

    } catch (e) {
      // Handle any exceptions during the RPC call
      console.error("Unexpected error: ", e);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex flex-col justify-centers space-y-6">
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">
        Login
      </h1>

      {error ? (
        <p className="mt-1 font-semibold leading-6 text-center text-lg text-red-500">
          {error}
        </p>
      ) : (
        <></>
      )}
      <StandardInputWIthLabel
        id={"email"}
        label={"Email"}
        name={"email"}
        type={"email"}
        onChange={(e) => setEmail(e.target.value)}
      />

      <StandardInputWIthLabel
        id={"passsword"}
        label={"Password"}
        name={"password"}
        type={"password"}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="h-2" />
      <StandardButtonGreen btnText={"login"} onClick={handleSignIn} />
      <div>
        <h3>Demo Credentials</h3>
        <p>email: demo@manager.com</p>
        <p>password: demo123</p>
      </div>
      <Link
        href="forgot-password"
        className="mt-1 leading-6 text-right text-sm text-green-500 hover:text-green-600"
      >
        Forgot Password?
      </Link>
    </div>
  );
}
