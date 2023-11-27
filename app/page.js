'use client'
import Link from "next/link"
import { useState } from "react"

const features = [
  {
    title: "Real-Time Expense Reporting",
    subTitle: "Employees can log expenses as they occur, with the ability to upload receipts and add details, ensuring timely and accurate financial tracking.",
    image: "/images/dashboard.png"
  },
  {
    title: "Secure Authentication",
    subTitle: "With bust login systems and JWT token authentication, users can be assured of secure access to their expense data",
    image: "/images/login.png"
  },
  {
    title: "Managerial Oversight",
    subTitle: "Managers have the ability to approve or disapprove reported expenses, providing control over budget and expenditure within different departments.",
    image: "/images/approve.png"
  },
  {
    title: "Categorized Expenses",
    subTitle: "Users can classify expenses into predefined categories, simplifying analysis and reporting for both personal and business financial insights.",
    image: "/images/category.png"
  },
  {
    title: "Invitation and Role Management",
    subTitle: "Managers can invite new employees to the platform and assign roles, streamlining the onboarding process and maintaining the organizational structure within the app.",
    image: "/images/invite.png"
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(features[0])
  return (

    <div>

      {/* header */}
      <header className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="relative z-50 flex justify-between">
            <div className="flex items-center md:gap-x-12">
              <img className="h-10 w-auto" src="/images/logo.png"></img>
              <div className="hidden md:flex md:gap-x-6">
                <a className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="#features">Features</a>
                <a className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="#features">Contact Us</a>
              </div>
            </div>
            <div className="flex items-center gap-x-5 md:gap-x-8">
              <Link href="/auth/login" className="rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-green-600 text-white hover:text-slate-100 hover:bg-green-500 active:bg-green-800 active:text-green-100 focus-visible:outline-green-600" >Login</Link>
            </div>
          </nav>
        </div>

      </header>

      {/* Main */}
      <div className="flex justify-center lg:bg-cover lg:bg-no-repeat items-top bg-center"
        style={{
          backgroundImage: "url('/images/backgroundMainLaunch.png')",
        }}>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-6 pb-16 pt-20 text-center md:text-left lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium drop-shadow-2xl tracking-tight text-slate-900 sm:text-7xl"><p className="text-green-700">Empowers</p> your business <p>expenses</p></h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">Experience streamlined expense management with a professional, user-friendly interface designed for simplicity and efficient financial tracking.</p>
        </div>

      </div>

      {/* feature section */}
      <section id="features" className="relative overflow-hidden bg-gradient-to-br from-green-900 mt-10 to-green-200 pb-28 pt-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">

          {/* heading line */}
          <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl ">Explore Advanced Features Tailored for Efficient Expense Management</h2>
          </div>

          {/* features div*/}
          <div className="mt-10 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20">

            {/* feature row */}
            <div className="mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
              <div className="relative z-10 flex gap-x-4 whitespace-normal px-4 sm:mx-auto sm:px-0 " role="tablist" aria-orientation="horizontal">
                {/* setting up each feature */}
                {
                  features.map((feature) =>
                  (
                    <div className={classNames(activeFeature.title == feature.title ? "group relative rounded-full px-2 py-2 lg:px-6 lg:py-2 bg-green-900 text-white border-2 border-green-900 shadow-md w-[400px] lg:w-auto" : "group relative rounded-full py-1 lg:px-6 lg:py-2 bg-white border-2 border-white")}>
                      <span
                        onClick={() => setActiveFeature(feature)}
                        className="font-display text-lg lg:text-xl ui-not-focus-visible:outline-none text-center px-4 lg:px-0" type="button">{feature.title}</span>
                    </div>
                  )
                  )
                }
              </div>

            </div>
          </div>
          {/* screenshot */}
          <div className="py-4  m-6 rounded-lg shadow-md">
            <p className="m-auto bg-white text-green-900 rounded-lg py-4 px-4 text-lg mb-4">{activeFeature.subTitle}</p>
            <img src={activeFeature.image} className="rounded-b-lg  border-t-2 border-gray-400" />
          </div>
        </div>
      </section>



    </div>
  )
}
