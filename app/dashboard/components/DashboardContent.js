'use client'
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DashboardContent() {
    const [activeTab, setActiveTab] = useState('category'); // Default to 'category', can also be 'department'
    const [filter, setFilter] = useState('this month')
    const [expenseData, setExpenseData] = useState(null);
    const supabase = createClientComponentClient(); // Make sure you initialize this properly
    const companyID = JSON.parse(localStorage.getItem("companyDetails")).id;


    const fetchExpensesData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.id) {
            const { data, error } = await supabase.rpc('dashboard_expenses_v2', { user_id: user.id, time_period: filter });
            if (!error && data) {
                setExpenseData(data);
            }
        }
    };
    useEffect(() => {
        fetchExpensesData();
    }, [filter]);
    const buttonClass = (f) => {
        return f === filter
            ? "bg-green-500 text-white px-5 py-2 rounded"
            : "border border-green-500 text-green-500 px-5 py-2 rounded";
    };
    const buttonDashboardTimeClass = (f) => {
        return f === filter
            ? "bg-gradient-to-t from-green-900 to-green-500 text-white px-5 py-2 rounded shadow-sm"
            : "border border-green-500 text-green-500 px-5 py-2 rounded";
    };
    if (!expenseData) {
        return <p>Loading...</p>;
    }
    return (

        <div className='flex flex-row space-x-2 mt-1'>
            <div className="container mx-auto lg:m-6 lg:w-2/3 lg:border-r-2 border-gray-100 lg:pr-3">
                {/* Time Filter */}
                <div className="flex mb-5 space-x-4">
                    <button
                        className={buttonDashboardTimeClass("this week")}
                        onClick={() => setFilter("this week")}
                    >Weekly</button>
                    <button
                        className={buttonDashboardTimeClass("this month")}
                        onClick={() => setFilter("this month")}
                    >Monthly</button>
                    <button
                        className={buttonDashboardTimeClass("last month")}
                        onClick={() => setFilter("last month")}
                    >Last Month</button>
                </div>

                {/* Total Expense */}
                <div className="bg-gradient-to-t from-cyan-100 to-green-300  p-10 mb-5 text-gray-900 text-center rounded-lg shadow-md">
                    <h2 className="text-3xl">Total Expense</h2>
                    <p className="text-4xl  font-medium">${expenseData.grand_total ? expenseData.grand_total : 0}</p>
                </div>

                {/* Department and Employee Count */}
                <div className="grid grid-cols-2 gap-5 mb-5 text-center">
                    <div className="border p-5 rounded-lg bg-gradient-to-t from-yellow-100 to-lime-200">
                        <p className="text-gray-700">Total Department</p>
                        <p className="text-xl font-semibold">{expenseData.total_departments}</p>
                    </div>
                    <div className="border p-5 rounded-lg bg-gradient-to-t from-yellow-100 to-lime-200">
                        <p className="text-gray-700">Total Employees</p>
                        <p className="text-xl font-semibold">{expenseData.total_employees}</p>
                    </div>
                </div>

                {/* Category & Department Tabs */}
                <div className=' border-2 rounded-lg shadow-sm '>
                    <div className="mb-5 flex text-center space-x-4 border-b border-gray-300">
                        <div
                            onClick={() => setActiveTab('category')}
                            className={`w-1/2 px-5 py-3 cursor-pointer ${activeTab === 'category' ? 'text-white bg-green-900 rounded-tl-lg  ' : 'text-gray-500'}`}
                        >
                            Category
                        </div>
                        <div
                            onClick={() => setActiveTab('department')}
                            className={`w-1/2 px-5 py-3 cursor-pointer ${activeTab === 'department' ? 'bg-green-900 rounded-tr-lg text-white' : 'text-gray-500'}`}
                        >
                            Department
                        </div>
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === 'category' ? (
                        <div className=" px-5">
                            {expenseData.expenses_by_categories && expenseData.expenses_by_categories.length > 0 ? (
                                expenseData.expenses_by_categories.map((expense, index) => (
                                    <div key={index} className="flex flex-row justify-between items-center border-b pb-2 mb-2">
                                        <div className="flex items-center">
                                            <img src="/images/fast-food-sharp.svg" alt={`${expense.name} Icon`} className="mr-2" />
                                            <p>{expense.name}</p>
                                        </div>
                                        <p>${expense.total}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No categories available.</p>
                            )}
                        </div>
                    ) : (
                        <div className="px-5">
                            {expenseData.expenses_by_departments && expenseData.expenses_by_departments.length > 0 ? (
                                expenseData.expenses_by_departments.map((expense, index) => (
                                    <div key={index} className="flex justify-between mb-2 border-b pb-2 items-center">
                                        <div className="flex items-center">
                                            <img src="/images/fast-food-sharp.svg" alt={`${expense.name} Icon`} className="mr-2" />
                                            <p>{expense.name}</p>
                                        </div>
                                        <p>${expense.total}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No departments available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* notification tab */}
            <div className='hidden lg:flex flex-col border-2 rounded-xl p-5 border-gray-200 shadow-lg bg-slate-100 w-1/3'>
                <h2 className='text-2xl text-gray-900 font-medium'>Notifications</h2>
                <ul>{
                    expenseData.notifications && expenseData.notifications.map((n) => (
                        <li key={n.id}>
                            <a href={n.link} target='_blank'>
                                <div className='mt-2 border-2 bg-white border-gray-400 rounded-xl shadow-sm '>
                                    <div className='flex flex-row px-2 py-1.5 space-x-3 items-center'>
                                        <div className='w-10 h-10 rounded-full bg-slate-800'></div>
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
                {/* item */}
            </div>
        </div>


    );
}
