'use client'

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function () {
    const supabase = createClientComponentClient();
    const [pass, setPass] = useState(null);
    const [confirmPass, setConfirmPass] = useState(null);

    const handleFormSubmission = (e) => {
        e.preventDefault();
        if (pass == confirmPass) {
            supabase.auth.updateUser({
                password: pass
            })
            alert("password updated")
        } else {
            alert("please check if password match")
        }
    }

    return <>
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Change your password below</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={(e) => handleFormSubmission(e)}>
                    {/* new password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">New Password</label>
                        <div className="mt-2">
                            <input id="password" name="password" type="password" autoComplete="password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                onChange={(e) => setPass(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* confirm new password */}
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">Confirm new Password</label>
                        <div className="mt-2">
                            <input id="" name="newPassword" type="password" autoComplete="newPassword" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                onChange={(e) => setConfirmPass(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-green-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Update Password</button>
                    </div>
                </form>
            </div>
        </div></>;
}

