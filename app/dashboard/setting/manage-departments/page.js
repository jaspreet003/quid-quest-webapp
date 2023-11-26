'use client'
import { TrashIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


export default function () {
    const supabase = createClientComponentClient();
    const [newDep, setNewDep] = useState("");
    const [departmentList, setDepartmentList] = useState([])
    const companyID = JSON.parse(localStorage.getItem("companyDetails")).id;

    const getDepartmentList = async () => {
        const { data, error } = await supabase.from("Departments").select("*");
        if (data) {
            setDepartmentList([...data])
            localStorage.setItem('departments', JSON.stringify([...data]));
        }
        if (error) {
            console.log(error)
            alert("unable to fetch departments")
        }
    }

    const deleteDepartment = async (id) => {
        const { error } = await supabase.from("Departments").delete().eq("id", id)
        if (error) {
            alert("Department already in use")
        }
        getDepartmentList();
    }

    const addDepartment = async (e) => {
        e.preventDefault();
        if (!newDep) {
            alert("Please insert a department name");
            return
        }
        const { error } = await supabase.from("Departments").insert({
            name: newDep,
            company: companyID,
        })

        getDepartmentList();
        setNewDep("")

        if (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getDepartmentList();
    }, [])
    return (
        <div className="lg:mx-60">
            <form className="flex flex-row justify-around gap-4 mb-4" onSubmit={addDepartment}>
                <input id="newDep" name="newDep" type="text" autoComplete="newDep" required className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    value={newDep}
                    onChange={(e) => setNewDep(e.target.value)}
                    placeholder="new department name"
                />
                <button
                    type="submit" className="flex w-32 justify-center items-center rounded-md bg-green-600 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Add</button>
            </form>
            <ul role="list" className="divide-y divide-gray-100">
                {departmentList.map((dep) => (
                    <li key={dep.id} className="flex justify-between py-5">
                        <div className="flex w-full justify-between">
                            <p className="mt-1 truncate text-lg leading-5 text-black-500">{dep.name}</p>
                            <button type="button" onClick={() => deleteDepartment(dep.id)}>
                                <TrashIcon className="h-6 w-6 text-gray-400 hover:text-gray-700" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}