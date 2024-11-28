import { NavLink } from "react-router-dom"
import { menuItems } from "../../routes"
import { useState } from "react"
import useAuth from "../../hooks/useAuth"

const SidebarSm = () => {
  const [isShow, setIsShow] = useState<number>(-1)
  const showSubMenu = (index: number) => {
    setIsShow(isShow === index ? -1 : index);
  }
  const { user } = useAuth()
  return (
    <>
      {/* Mobile sidebar */}
      {/* Backdrop */}
        {/* <div className="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"></div> */}
        <aside className="fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden">
          <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#" >
              Electronics
          </a>
          
            { menuItems && (<ul className="mt-6">
            {
              menuItems.map((item, index) => (
                item.link === "/staffs" && user?.role !== 1 ? null : (
                  <li key = {index} className="relative px-6 py-3">
                      {
                        item.submenu ? (
                          <button
                            onClick={() => showSubMenu(index)}
                            className="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"  aria-haspopup="true"
                    >
                            <span className="inline-flex items-center">
                              {item.svg}
                              <span className="ml-4">{ item.title }</span>
                            </span>
                            <svg className="w-4 h-4" aria-hidden="true" fill="currentColor"  viewBox="0 0 20 20" >
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" ></path>
                            </svg>
                          </button>
                        ) : (
                          <NavLink  to= {item.link} 
                          className={({ isActive }) =>
                              `inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${isActive ? "dark:text-gray-100" : ""}`
                          }
                          >
                            {item.svg}
                            <span className="ml-4">{item.title}</span>
                          </NavLink>
                          
                        )
                      }
                      
                      {
                        item.submenu && isShow === index && (
                          <ul className=" overflow-hidden p-2 mt-2 space-y-2 text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900" aria-label="submenu" >
                          {
                            item.submenu.map((item_child, i) =>(
                              <li key = {i} className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                                <NavLink  to= {item_child.link} 
                                  className={({ isActive }) =>
                                      `w-full ${isActive ? "dark:text-gray-100" : ""}`
                                  }
                                  >
                                    {item_child.title}
                                  </NavLink>
                                
                              </li>
                            ))
                          }
                          
                        </ul>
                        )
                      }
                    
                  </li>
                )
              ))
            }
            
            </ul>
            )}
            
          </div>
        </aside>
    </>
  )
}

export default SidebarSm
