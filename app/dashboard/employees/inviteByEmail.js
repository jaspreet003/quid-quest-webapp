"use client";
import StandardButtonGreen from "@/app/lib/Buttons/StandardButtonGreen";
import DropdownBoxFunction from "@/app/lib/Dropdown/DropdownWithScroll";
import EmptyFieldError from "@/app/lib/Errors/EmptyFieldError";
import StandardInputWIthLabel from "@/app/lib/Input/StandardInputWIthLabel";
import InputFieldModal from "@/app/lib/Modals/InputFieldModal";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function InviteByEmail({ showModal, setShowModal }) {
  const supabase = createClientComponentClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [fnError, setFnError] = useState(false);
  const [lnError, setLnError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [apiError, setApiError] = useState(false);

  const [sent, setSent] = useState(false);
  const departments = JSON.parse(localStorage.getItem("departments"))

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate your input fields here, for example:
    if (!firstName) {
      setFnError(true);
      return;
    }
    if (!lastName) {
      setLnError(true);
      return;
    }
    if (!email) {
      setEmailError(true);
      return;
    }

    // If all fields are valid, make the API calls
    const onboardingId = await createOnBoarding();
    if (!onboardingId) return;
    const link = `https://www.quid.quest/onboarding/${onboardingId}/welcome`;
    await sendInviteEmail(link);
  };
  const sendInviteEmail = async (link) => {
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          email: email,
          link: link,
        }),
      });

      const data = await response.json();
      if (data.error) {
        // Handle error
        console.error(data.error);
      } else {
        // Handle success
        console.log(data);
        setSent(true);
        // Maybe reset the form or provide feedback to the user
      }
    } catch (error) {
      setApiError(true);
      console.error("Error sending email:", error);
    }
  };
  const createOnBoarding = async () => {
    const res = await supabase
      .from("onboarding")
      .insert({
        firstname: firstName,
        lastname: lastName,
        email: email,
        department: "Tech",
        title: "Fronte end Developer",
      })
      .select();

    if (res.error) {
      setApiError(true);
      console.log("error creating onbaording", res.error);
    } else {
      console.log("res", res.data);
      return res.data[0].id;
    }
  };

  return (
    <InputFieldModal open={showModal} setOpen={setShowModal}>
      {sent ? (
        <div className="p-8 bg-white w-auto flex flex-col space-y-6 justify-center items-center">
          <p className="text-lg text-center font-semibold text-black">
            {"Email Sent to the employee."}
          </p>
          <button
            className="w-min px-6 py-2 bg-green-700 text-bold text-white rounded-md"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-centers space-y-6 px-6 py-10 rounded-xl shadow-xl w-full h-full">
          <div className="flex flex-row">
            <h1 className="text-center text-2xl font-bold text-gray-800 mb-4 w-full">
              Invite Employee
            </h1>
            <span className="inline-block px-4 pt-2 hover:cursor-pointer"
              onClick={() => setShowModal(false)}
            >X</span>
          </div>
          {apiError ? (
            <EmptyFieldError
              errorMessage={"Something went wrong with backend"}
            />
          ) : (
            <></>
          )}
          <div>
            <StandardInputWIthLabel
              id={"firstName"}
              label={"First Name"}
              name={"firstName"}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {fnError ? (
              <EmptyFieldError errorMessage={"Enter the first Name"} />
            ) : (
              <></>
            )}
          </div>

          <div>
            <StandardInputWIthLabel
              id={"lastName"}
              label={"Last Name"}
              name={"lastName"}
              onChange={(e) => setLastName(e.target.value)}
            />

            {lnError ? (
              <EmptyFieldError errorMessage={"Enter the last Name"} />
            ) : (
              <></>
            )}
          </div>
          <div>
            <StandardInputWIthLabel
              id={"email"}
              label={"Email"}
              name={"email"}
              onChange={(e) => setEmail(e.target.value)}
            />

            {emailError ? (
              <EmptyFieldError errorMessage={"Enter the email"} />
            ) : (
              <></>
            )}
          </div>
          <div>
            <span className="text-lg font-bold">Department</span>
            <DropdownBoxFunction list={departments}></DropdownBoxFunction>
          </div>
          <div className="h-2" />
          <StandardButtonGreen
            btnText={"send invitation"}
            onClick={handleSubmit}
          />
        </div>
      )}
    </InputFieldModal>
  );
}
