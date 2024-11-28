import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { SETTINGS } from "../../constants/settings";
import { axiosClient } from "../../lib/axiosClient";
import { useQuery } from "@tanstack/react-query";

const HeaderProfile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const {user, logout} = useAuth()
    const idProfile = user?._id

    const fetchProfile = async (idProfile: string) => {
        const url = `${SETTINGS.URL_API}/v1/staffs/${idProfile}`
        const res = await axiosClient.get(url)
        return res.data.data
    }

    const getProfile =  useQuery({
        queryKey: ["staff", idProfile],
		queryFn: () => fetchProfile(idProfile!),
        enabled: !!idProfile,
    })


    return (
    <>
        {/* Profile menu */}
        <li className="relative">
            <button
                onClick={toggleMenu} 
                className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none" aria-label="Account" aria-haspopup="true" >
                {
                    user?.avatar && user?.avatar !== null  ? (
                        <img className="w-8 h-8 rounded-full object-cover" src= {`${SETTINGS.URL_IMAGE}/${getProfile?.data?.avatar}`} alt={getProfile?.data?.fullname} />
                    ) : (
                        <img className="w-8 h-8 rounded-full object-cover" src="/images/noavatar.png" alt={getProfile?.data?.fullname} />
                    )
                }
            </button>
            {/* Profile menu dropdown */}
            {isOpen && ( <ul
                className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700" aria-label="submenu">
                <li className="flex">
                    <Link to = {`/staff/${user?._id}`} className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200" >
                        <svg className="w-4 h-4 mr-3" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Tài khoản</span>
                    </Link>
                </li>
                {/* <li className="flex">
                <a
                    className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    href="#"
                >
                    <svg
                    className="w-4 h-4 mr-3"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0A8.992 8.992 0 0118 12c0 4.48-3.672 8-8 8s-8-3.52-8-8a8.992 8.992 0 014.675-7.683z" />
                    </svg>
                    <span>Settings</span>
                </a>
                </li> */}
                <li className="flex">
                <a
                     onClick={logout}
                    className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    href="#"
                >
                    <svg
                    className="w-4 h-4 mr-3"
                    aria-hidden="true"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path d="M16 4h2a2 2 0 012 2v2a2 2 0 01-2 2h-2" />
                    <path d="M4 4h2a2 2 0 012 2v2a2 2 0 01-2 2H4" />
                    <path d="M4 16h2a2 2 0 012 2v2a2 2 0 01-2 2H4" />
                    <path d="M16 16h2a2 2 0 012 2v2a2 2 0 01-2 2h-2" />
                    </svg>
                    <span>Đăng xuất</span>
                </a>
                </li>
            </ul>)}
        </li>
    </>
  )
}

export default HeaderProfile
