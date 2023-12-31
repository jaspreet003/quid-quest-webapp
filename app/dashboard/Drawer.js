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
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { BellIcon } from "@heroicons/react/24/solid";
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
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  {
    name: "Employees",
    href: "/dashboard/employees",
    icon: UsersIcon,
  },
  {
    name: "Expenses",
    href: "/dashboard/expenses",
    icon: FolderIcon,
  },
  {
    name: "Setting",
    href: "/dashboard/setting",
    icon: Cog6ToothIcon,
    internalMenu: settingsNav,
  },
];

export default function Drawer() {
  const path = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [internalMenuState, setInterMenuState] = useState(navigation.map((_) => false))

  const router = useRouter();
  const checkPathForMenuName = (name) => path.includes(name);
  const notificationCount = localStorage.getItem("notificationCount");

  if (checkPathForMenuName("setting")) {
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

  const findNameFromPath = (path, menu) => {
    const menuItem = menu.find(item => path === item.href);
    return menuItem ? menuItem.name : '';
  };

  const findSubmenuName = (path, mainMenu) => {
    const mainItem = mainMenu.find(item => path.startsWith(item.href) && item.internalMenu);
    return mainItem ? findNameFromPath(path, mainItem.internalMenu) : '';
  };

  const convertPathToBreadcrumb = (path) => {
    const pathParts = path.split('/').filter(Boolean);
    let breadcrumb = [];

    for (let i = 0; i < pathParts.length; i++) {
      let currentPath = `/${pathParts.slice(0, i + 1).join('/')}`;

      let name = findNameFromPath(currentPath, navigation);
      if (!name) {
        name = findSubmenuName(currentPath, navigation);
      }

      if (name) {
        breadcrumb.push(name);
      }
    }

    return breadcrumb.join(' > ');
  };

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
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-green-950">
                  <div className="flex h-16 shrink-0 items-center px-6">
                    <img
                      className="h-11 w-auto pt-2"
                      src="/images/logo.png"
                      alt="Your Company"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col ">
                    <ul role="list" className="flex flex-1 flex-col justify-between">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1 px-6">
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
                      <li key={"logout"} >
                        <button
                          className={
                            "group text-gray-400 w-full flex py-3 px-6 text-sm font-semibold mb-1 hover:text-white hover:bg-green-800 "

                          }
                          onClick={handleLogout}
                        >
                          <ArrowLeftOnRectangleIcon className="h-6 w-6 text-gray-400 mr-2" />
                          {"Logout"}
                        </button>
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
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-green-950">
          <div className="flex h-16 shrink-0 items-center px-6">
            <img
              className="h-12 w-auto pt-2"
              src="/images/logo.png"
              alt="Your Company"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col justify-between ">
              <li>
                <ul role="list" className="-mx-2 space-y-1 px-6">
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
              <li key={"logout"} >
                <button
                  className={
                    "group text-gray-400 w-full flex py-3 px-6 text-sm font-semibold mb-1 hover:text-white hover:bg-green-800 "
                  }
                  onClick={handleLogout}
                >
                  <ArrowLeftOnRectangleIcon className="h-6 w-6 text-gray-400 mr-2 " />
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
          {convertPathToBreadcrumb(path)}
        </div>
        <a href="/dashboard/notifications">
          <span className="absolute right-3 top-0 px-2 rounded-full bg-red-400 text-white font-semibold text-lg">{notificationCount}</span>
          <BellIcon className="h-8 w-8 text-white" />
        </a>
      </div>
    </>
  );
}
