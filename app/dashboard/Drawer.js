"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  Cog6ToothIcon,
  ChevronUpIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  ChartPieIcon
} from "@heroicons/react/24/outline";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
const settingsNav = [
  {
    name: "Update Password",
    href: "/dashboard/setting/update-password",
  },
  {
    name: "Manage Departments",
    href: "/dashboard/setting/manage-departments",
  },
  {
    name: "Manage Categories ",
    href: "/dashboard/setting/manage-categories",
  },
  {
    name: "Update Profile",
    href: "/dashboard/setting/update-profile",
  }
]
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: false },
  {
    name: "Employees",
    href: "/dashboard/employees",
    icon: UsersIcon,
    current: false,
  },
  {
    name: "Expenses",
    href: "/dashboard/expenses",
    icon: FolderIcon,
    current: false,
  },
  {
    name: "Setting",
    href: "/dashboard/setting",
    icon: Cog6ToothIcon,
    current: false,
    internalMenu: settingsNav,
  },
];



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Drawer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(false);
  const [internalMenuState, setInterMenuState] = useState(navigation.map((_) => false))

  const router = useRouter();
  const path = usePathname();

  if (path.includes("setting")) {
    internalMenuState[3] = true;
  }
  const supabase = createClientComponentClient();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  const handleInternalMenuToggle = (i) => {
    let newState = [...internalMenuState];
    newState[i] = !newState[i];
    setInterMenuState(newState);
  }
  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-green-950" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-green-950 px-6 pb-2 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-11 w-auto pt-2"
                      src="/images/logo.png"
                      alt="Your Company"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item, i) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                className={classNames(
                                  currentPage
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <item.icon
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-green-950 px-6">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-12 w-auto pt-2"
              src="/images/logo.png"
              alt="Your Company"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item, i) => (
                    <li key={item.name}>
                      {!item.internalMenu ? <a
                        href={item.href}
                        className={"text-gray-400 hover:text-white hover:bg-green-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"}
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a> :
                        <>
                          <button type="button"
                            className={"text-gray-400 hover:text-white hover:bg-green-800 w-full group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"}
                            onClick={() => handleInternalMenuToggle(i)}
                          >
                            <div className="w-full flex flex-row justify-between">
                              <div className="flex flex-row gap-x-3">
                                <item.icon
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </div>
                              {!internalMenuState[i] ? <ChevronDownIcon className="w-6 h-6" /> :
                                <ChevronUpIcon className="w-6 h-6" />}

                            </div>
                          </button>
                          <ul role="list" className="w-full space-y-2 mt-2 ml-2">
                            {internalMenuState[i] && item.internalMenu.map((inItem) => {
                              return (
                                <li key={inItem.name} className="w-full">
                                  <a href={inItem.href} className=" hover:bg-green-900  text-white py-3 text-sm px-8">
                                    {inItem.name}
                                  </a>
                                </li>
                              )
                            })}
                          </ul>
                        </>
                      }
                    </li>
                  ))}
                </ul>
              </li>
              <li key={"logout"}>
                <button
                  className={
                    "text-gray-400 hover:text-white hover:bg-green-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  }
                  onClick={handleLogout}
                >
                  {"Logout"}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-green-950 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-white">
          Dashboard
        </div>
        <a href="#">
          <span className="sr-only">Your profile</span>
          <img
            className="h-8 w-8 rounded-full bg-gray-800"
            src="https://picsum.photos/200"
            alt=""

          />
        </a>
      </div>
    </>
  );
}
