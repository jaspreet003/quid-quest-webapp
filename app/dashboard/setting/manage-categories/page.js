'use client'
import { TrashIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


export default function () {
    const supabase = createClientComponentClient();
    const [newCat, setNewCat] = useState("");
    const [categoriesList, setCategoriesList] = useState([])

    async function getCategoryList() {
        const { data, error } = await supabase.from("Categories").select("*");
        if (data) {
            setCategoriesList(data)
        }
        if (error) {
            console.log(error)
            alert("unable to fetch categories")
        }
    }

    async function deleteCategory(id) {
        const { error } = await supabase.from("Categories").delete().eq("id", id)
        if (error) {
            console.log(error)
            getCategoryList();
        } else {
            alert("deleted it")
        }
    }

    async function addCategory() { }

    useEffect(() => {
        getCategoryList();
    }, [])
    return (
        <div className="lg:mx-60">
            <form className="flex flex-row justify-around gap-4 mb-4">
                <input id="newCat" name="newCat" type="text" autoComplete="newCat" required className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    placeholder="new category name"
                />
                <button type="submit" className="flex w-32 justify-center items-center rounded-md bg-green-600 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Add</button>
            </form>
            <ul role="list" className="divide-y divide-gray-100">
                {categoriesList.map((cat) => (
                    <li key={cat.id} className="flex justify-between py-5">
                        <div className="flex w-full justify-between">
                            <p className="mt-1 truncate text-lg leading-5 text-black-500">{cat.name}</p>
                            <button type="button" onClick={() => deleteCategory(cat.id)}>
                                <TrashIcon className="h-6 w-6 text-gray-400 hover:text-gray-700" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}