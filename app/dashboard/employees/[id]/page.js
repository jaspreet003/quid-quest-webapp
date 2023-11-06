'use client'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function () {
    const supabase = createClientComponentClient();
    const { id } = useParams();
    const router = useRouter();

    const [fn, setfn] = useState("");
    const [ln, setln] = useState("");
    const [accNum, setAccNum] = useState("");
    const [transNum, setTransNum] = useState("");
    const [insNum, setInsNum] = useState("");
    const [pic, setPic] = useState(null);

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
            updateEmployeePicture(imageUrl);
        }
    };
    const updateEmployeePicture = async (imageUrl) => {
        const { data, error } = await supabase
            .from('employeedata')
            .update({ picture: imageUrl })
            .eq('id', id);

        if (error) {
            console.error('Error updating employee picture: ', error.message);
        }
    };
    const updateEmployee = async (fname, lname, acc, trans, inst) => {
        const { data, error } = await supabase
            .from('employeedata')
            .update({
                firstname: fname,
                lastname: lname,
                accountnumber: acc,
                transitnumber: trans,
                institutenumber: inst
            })
            .eq('id', id);
        router.push('/dashboard/employees')
        if (error) {
            console.error('Error updating employee data: ', error.message);
        }
    };
    const getEmployee = async () => {
        const { data, error } = await supabase.from('employeedata').select('*').filter('id', 'eq', id)
        if (error) {
            console.log('error getting employyeee:  ', error)
        } else {
            const emp = data[0];
            setfn(emp.firstname)
            setln(emp.lastname)
            setAccNum(emp.accountnumber)
            setTransNum(emp.transitnumber)
            setInsNum(emp.institutenumber)
            setPic(emp.picture)
        }
    }
    useEffect(() => {
        getEmployee();
    }, [])

    return <>
        <form>
            <div className="space-y-12 sm:space-y-16">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                    <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                        <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6">
                            <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                                Photo
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <div className="flex items-center gap-x-3">
                                    {
                                        pic ? <img src={pic} className="inline-block h-12 w-12 rounded-full"
                                        /> :
                                            <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
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
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                    <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                First name
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <input
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-3"
                                    value={fn}
                                    onChange={(e) => setfn(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Last name
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <input
                                    type="text"
                                    name="last-name"
                                    id="last-name"
                                    autoComplete="family-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-3"
                                    value={ln}
                                    onChange={(e) => setln(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Banking Information</h2>
                    <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Account number
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <input
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-3"
                                    value={accNum}
                                    onChange={(e) => setAccNum(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Transit number
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <input
                                    type="text"
                                    name="last-name"
                                    id="last-name"
                                    autoComplete="family-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-3"
                                    value={transNum}
                                    onChange={(e) => setTransNum(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Institute number
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <input
                                    type="text"
                                    name="last-name"
                                    id="last-name"
                                    autoComplete="family-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-3"
                                    value={insNum}
                                    onChange={(e) => setInsNum(e.target.value)}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900"
                    onClick={() => router.push('/dashboard/employees')}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => updateEmployee(fn, ln, accNum, transNum, insNum)}
                >
                    Save
                </button>
            </div>
        </form>
    </>
}