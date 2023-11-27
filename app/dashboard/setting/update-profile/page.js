'use client'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function () {
    const supabase = createClientComponentClient();
    const [fn, setFn] = useState("");
    const [ln, setLn] = useState("");
    const [email, setEmail] = useState('');
    const [aNum, setANum] = useState("");
    const [transNum, setTransNum] = useState("");
    const [insNum, setInsNum] = useState("");
    const [pic, setPic] = useState("");


    const id = JSON.parse(localStorage.getItem("employeeDetails")).id;

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Perform the upload
            await uploadToSupabase(file);
        }
    };

    const uploadToSupabase = async (file) => {
        const { data, error } = await supabase.storage
            .from('avatars') // Use the appropriate 'bucket' name where you want to store the images
            .upload(`public/${file.name}`, file);

        if (error) {
            console.error('Error uploading the file: ', error.message);
        } else {
            // Assuming your 'employeedata' table has a 'picture' column to store the image URL
            const imageUrl = supabase.storage.from('avatars').getPublicUrl(`public/${file.name}`).data.publicUrl;
            // Update the state and possibly the database record for the employee
            setPic(imageUrl);
            // Optionally, update the employee record with the new picture URL
        }
    };

    const getEmployeeData = async () => {
        const { data: empData, error: empError } = await supabase.from("employeedata").select("*").eq('id', id).single();
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (empData && userData) {
            setFn(empData.firstname);
            setLn(empData.lastname);
            setANum(empData.accountnumber);
            setTransNum(empData.transitnumber);
            setInsNum(empData.institutenumber);
            setEmail(userData.user.email);
            setPic(empData.picture);
        }
        if (empError && userError) {
            console.log(empError, userError)
            alert("error getting data")
        }
    }

    const handleFormSubmission = async () => {
        if (!fn || !ln || !email || !aNum || !transNum || !insNum) {
            alert("one or more fields are empty")
            return;
        };
        const { error } = await supabase.from("employeedata").update({
            firstname: fn,
            lastname: ln,
            accountnumber: aNum,
            transitnumber: transNum,
            institutenumber: insNum,
            picture: pic
        }).eq('id', id);
        const authDetailsUpdate = await supabase.auth.updateUser({
            email,
        })
        await supabase.from("notifications").insert({
            title: `profile update`,
            message: `${fn} ${ln} updated his profile`,
            company: companyID,
            employee: id
        })
        if (error || authDetailsUpdate.error) {
            console.log(error, authDetailsUpdate.error)
            alert("error occured while processing request")
        }
    }

    useEffect(() => {
        getEmployeeData()
    }, [])
    return (
        <div className='lg:flex lg:justify-center'>
            <div className="space-y-10 divide-y divide-gray-900/10 lg:w-2/3 lg:flex lg:flex-col">

                {/* personal details */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                    <div className="px-4 sm:px-0">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Update your personal details here.</p>
                    </div>

                    <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">

                        <div className="px-4 py-6 sm:p-8">
                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                {/* profile pic */}
                                <div className="col-span-full">
                                    <div className="mt-2 flex items-center gap-x-3">
                                        {
                                            pic ? <img src={pic} className="h-32 w-32 rounded-full" /> :
                                                <UserCircleIcon className="h-32 w-32 text-gray-300" aria-hidden="true" />
                                        }
                                        <button
                                            type="button"
                                            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            onClick={() => document.getElementById('file-upload').click()}
                                        >
                                            Change
                                        </button>
                                        <input
                                            type="file"
                                            id="file-upload"
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>

                                {/* first name */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        First name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            autoComplete="given-name"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                                            value={fn}
                                            onChange={(e) => setFn(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* last name */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Last name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="last-name"
                                            id="last-name"
                                            autoComplete="family-name"
                                            className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={ln}
                                            onChange={(e) => setLn(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* email */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* phone number */}
                                {/* <div className="sm:col-span-2">
                                    <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                                        Phone Number
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="postal-code"
                                            id="postal-code"
                                            autoComplete="postal-code"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </form>
                </div>

                {/* account details */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                    <div className="px-4 sm:px-0">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Account Details</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Please enter your bank details in accurately.
                        </p>
                    </div>

                    <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                        <div className="px-4 py-6 sm:p-8 space-y-8">

                            {/* account number */}
                            <div className="sm:col-span-2">
                                <label htmlFor="account-num" className="block text-sm font-medium leading-6 text-gray-900">
                                    Account Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="account-num"
                                        id="account-num"
                                        autoComplete="account-num"
                                        className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={aNum}
                                        onChange={(e) => setANum(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* transit number */}
                            <div className="sm:col-span-2">
                                <label htmlFor="trans-num" className="block text-sm font-medium leading-6 text-gray-900">
                                    Transit Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="trans-num"
                                        id="trans-num"
                                        autoComplete="trans-num"
                                        className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={transNum}
                                        onChange={(e) => setTransNum(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* instituion number */}
                            <div className="sm:col-span-2">
                                <label htmlFor="inst-num" className="block text-sm font-medium leading-6 text-gray-900">
                                    Institution Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="inst-num"
                                        id="inst-num"
                                        autoComplete="inst-num"
                                        className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={insNum}
                                        onChange={(e) => setInsNum(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">

                    <button
                        type="button"
                        className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        onClick={handleFormSubmission}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>

    )
}

