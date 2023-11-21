"use client";
import StandardInputWIthLabel from "@/app/lib/Input/StandardInputWIthLabel";
import StandardButtonGreen from "@/app/lib/Buttons/StandardButtonGreen";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams, useRouter } from "next/navigation";
  
export default function ResetPassword() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [apiError, setApiError] = useState(false);
  const params = useParams();
  const { id } = params;
  const supabase = createClientComponentClient();
  const router = useRouter();

  const getEmail = async () => {
    const { data, error } = await supabase
      .from("onboarding")
      .select("*") // selects all columns
      .eq("id", id) // filters rows where the column "id" equals the variable id
      .single(); // expects a single row in response
    if (error) {
      console.error("Error fetching onboarding data:", error);
      return;
    } else {
      return data.email;
    }
  };

  const handleCreateNewUser = async () => {
    const email = await getEmail();
    console.log(email, confirmPassword);
    if (!email) {
      setApiError(true);
      return;
    }
    const res = await supabase.auth.signUp({
      email: email,
      password: confirmPassword,
    });
    if (res.data) {
      router.push("/auth/login");
    } else {
      setApiError(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!password) {
      setError(true);
      return;
    }
    if (password != confirmPassword) {
      setError(true);
      return;
    }

    handleCreateNewUser();
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col justify-centers space-y-6">
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">
        Create your Password
      </h1>

      {error ? (
        <p className="mt-1 font-semibold leading-6 text-center text-lg text-red-500">
          Your password does not match !
        </p>
      ) : (
        <></>
      )}
      {apiError ? (
        <p className="mt-1 font-semibold leading-6 text-center text-lg text-red-500">
          Something went wrong on backend!
        </p>
      ) : (
        <></>
      )}

      <StandardInputWIthLabel
        id={"password"}
        label={"Password"}
        name={"password"}
        type={"password"}
        onChange={(e) => setPassword(e.target.value)}
      />

      <StandardInputWIthLabel
        id={"confirmPasssword"}
        label={"Confirm Password"}
        name={"pconfirmPassword"}
        type={"password"}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <div className="h-2" />
      <StandardButtonGreen btnText={"Submit"} onClick={handleSubmit} />
    </div>
  );
}
