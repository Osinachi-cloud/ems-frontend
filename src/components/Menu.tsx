"use client"
import { useEffect, useState } from "react";
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
                visible: ["TENANT"],
            },
            {
                icon: "/Vector.png",
                label: "My Profile",
                href: "/my-profile",
                visible: ["APP_ADMIN", "TENANT", "LANDLORD"],
            },
            {
                icon: "/Bag.png",
                label: "Estate Transactions",
                href: "/estate-transaction-overview",
                visible: ["APP_ADMIN", "ESTATE_ADMIN", "SUPERADMIN_ADMIN"],
            },
            {
                icon: "/Bag.png",
                label: "Users Management",
                href: "/manage-users",
                visible: ["APP_ADMIN", "ESTATE_ADMIN", "SUPERADMIN_ADMIN"],

            },
            {
                icon: "/folder.png",
                label: "Inventory",
                href: "/inventory",
                visible: ["APP_ADMIN", "teacher", "TENANT"],
            },
            {
                icon: "/folder.png",
                label: "Manage Address",
                href: "/manage-addresses",
                visible: ["APP_ADMIN", "teacher", "TENANT"]
            },
            {
                icon: "/folder.png",
                label: "Financial Reports",
                href: "/financial-reports",
                visible: ["APP_ADMIN"]
            },
            {
                icon: "/Setting 2.png",
                label: "Account Settings",
                href: "/list/settings",
                visible: ["APP_ADMIN", "TENANT"]
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
    const [mounted, setMounted] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const { getUserDetails } = useLocalStorage("userDetails", null);

    useEffect(() => {
        setMounted(true);
        // Get role only on client side
        const userDetails = getUserDetails();
        setRole(userDetails?.roleDto?.name || null);
    }, []);

    // Server-side render or initial client render
    if (!mounted) {
        // Return ALL menu items without filtering for skeleton
        // This ensures the same HTML on server and client initially
        return (
            <div className="text-sm">
                {menuItems.map((section) => (
                    <div className="flex flex-col" key={section.title}>
                        {section.items.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center justify-center lg:justify-start gap-4 text-[#000] border-b border-t-black-50 py-[1.2rem] md:px-2 rounded-md"
                            >
                                <div className="w-5 h-5 bg-gray-200 rounded" /> {/* Placeholder */}
                                <span className="hidden lg:block">{item.label}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    // Client-side render with actual role-based filtering
    return (
        <div className="text-sm">
            {menuItems.map((section) => (
                <div className="flex flex-col" key={section.title}>
                    {section.items.map((item) => {
                        // Only show items that are visible for this role
                        if (role && item?.visible?.includes(role)) {
                            return (
                                <Link
                                    href={item.href}
                                    key={item.label}
                                    className="flex items-center justify-center lg:justify-start gap-4 text-[#000] border-b border-t-black-50 py-[1.2rem] md:px-2 rounded-md hover:bg-[#000] hover:text-[#fff] transition-colors"
                                >
                                    <Image
                                        src={item.icon}
                                        alt=""
                                        width={20}
                                        height={20}
                                        className="w-5 h-5"
                                    />
                                    <span className="hidden lg:block">{item.label}</span>
                                </Link>
                            );
                        }
                        return null;
                    })}
                </div>
            ))}
        </div>
    );
};

export default Menu;