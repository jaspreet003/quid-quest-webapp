'use client'
import {
    BellIcon
} from "@heroicons/react/24/solid";
export default function () {
    const notifications = JSON.parse(localStorage.getItem("notifications"))
    return (
        <div className='flex flex-col p-5    '>
            <h2 className='text-2xl text-gray-900 font-medium mb-6'>Notifications</h2>
            <ul>{
                notifications && notifications.map((n) => (
                    <li key={n.id} className="mb-6">
                        <a href={n.link} target='_blank'>
                            <div className='mt-2 border-2 bg-white border-gray-400 rounded-xl shadow-sm '>
                                <div className='flex flex-row px-2 py-1.5 space-x-3 items-center'>
                                    <BellIcon className="h-8 w-8 text-gray-500" />
                                    <div>
                                        <p className='text-lg text-gray-800'>{n.title}</p>
                                        <p className='text-md text-gray-500'>{n.message}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </li>
                ))
            }
            </ul>
        </div>
    )
}