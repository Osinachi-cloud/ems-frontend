"use client"
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "0",
    items: [
      {
        icon: "/Vector.png",
        label: "My Dashboard",
        href: "/my-dashboard",
        visible: ["APP_ADMIN", "teacher", "student", "parent", "TENANT"],
      },
      {
        icon: "/Vector.png",
        label: "My Profile",
        href: "/my-profile",
        visible: ["APP_ADMIN", "teacher", "student", "parent", "TENANT"],
      },
      // {
      //   icon: "/Bag.png",
      //   label: "Transactions",
      //   href: "/transaction",
      //   visible: ["APP_ADMIN", "teacher", "TENANT"],
      // },
      {
        icon: "/Bag.png",
        label: "Estate Transactions",
        href: "/estate-transaction-overview",
        visible: ["APP_ADMIN", "teacher", "TENANT"],
      },
      {
        icon: "/Bag.png",
        label: "Users Management",
        href: "/manage-users",
        visible: ["APP_ADMIN", "teacher", "TENANT"],
      },
      {
        icon: "/folder.png",
        label: "Inventory",
        href: "/inventory",
        visible: ["APP_ADMIN", "teacher", "TENANT"],
      },
      // {
      //   icon: "/Activity 2.png",
      //   label: "Analytics",
      //   href: "/Analytics",
      //   visible: ["admin", "teacher"],
      // },
      {
        icon: "/Setting 2.png",
        label: "Account Settings",
        href: "/list/settings",
        visible: ["APP_ADMIN", , "TENANT"],
      },
    ],
  },
  {
    title: "1",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["APP_ADMIN", "teacher", "student", "parent", "TENANT"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["APP_ADMIN", "teacher", "student", "parent", "TENANT"],
      },
    ],
  },
];

const Menu = () => {

    const { getUserDetails } = useLocalStorage("userDetails", null);
    const role = getUserDetails()?.roleDto.name;
  
  return (
    <div className="text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col" key={i.title}>
          <span className="hidden lg:block text-[#000] font-light">
            {/* {i.title} */}
          </span>
          {i.items.map((item: any) => {
            if (item?.visible?.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-[#000] border-b border-t-black-50 py-[1.2rem] md:px-2 rounded-md hover:bg-[#000] hover:text-[#fff]"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  {/* <i className= {`${item.icon} `}></i> */}
                  <i className={`fa fa-user`}></i>
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
