import BrandEdit from "../pages/BrandEdit";
import BrandPage from "../pages/BrandPage";
import CategoriesPage from "../pages/CategoriesPage";
import CategoryEdit from "../pages/CategoryEdit";
import CustomerAdd from "../pages/CustomerAdd";
import CustomerEdit from "../pages/CustomerEdit";
import CustomersPage from "../pages/CustomersPage";
import Dashboard from "../pages/Dashboard";
import NoPage from "../pages/NoPage";
import OrderEdit from "../pages/OrderEdit";
import OrderPage from "../pages/OrderPage";
import PostAdd from "../pages/PostAdd";
import PostEdit from "../pages/PostEdit";
import PostPage from "../pages/PostPage";
import ProductAdd from "../pages/ProductAdd";
import ProductEdit from "../pages/ProductEdit";
import ProductPage from "../pages/ProductPage";
import StaffAdd from "../pages/StaffAdd";
import StaffEdit from "../pages/StaffEdit";
import StaffsPage from "../pages/StaffsPage";
import TopicEdit from "../pages/TopicEdit";
import TopicPage from "../pages/TopicPage";

const routesPage = [
  { path: "/", element: <Dashboard />, exact: true },
  { path: "/product", element: <ProductPage /> },
  { path: "/product/add", element: <ProductAdd /> },
  { path: "/product/:id", element: <ProductEdit /> },
  { path: "/category", element: <CategoriesPage /> },
  { path: "/category/:id", element: <CategoryEdit /> },
  { path: "/brand", element: <BrandPage /> },
  { path: "/brand/:id", element: <BrandEdit /> },
  { path: "/staffs", element: <StaffsPage /> },
  { path: "/staff/add", element: <StaffAdd /> },
  { path: "/staff/:id", element: <StaffEdit /> },
  { path: "/customers", element: <CustomersPage /> },
  { path: "/customer/add", element: <CustomerAdd /> },
  { path: "/customers/:id", element: <CustomerEdit /> },
  { path: "/order", element: <OrderPage/>},
  { path: "/order/:id", element: <OrderEdit/>},


  { path: "/post", element: <PostPage /> },
  { path: "/post/add", element: <PostAdd /> },
  { path: "/post/:id", element: <PostEdit /> },
  { path: "/topic", element: <TopicPage /> },
  { path: "/topic/:id", element: <TopicEdit /> },

  { path: "*", element: <NoPage /> },
];

const menuItems = [
  {
    title: "Dashboard",
    link: "/",
    svg: (
      <svg
        className="w-5 h-5"
        aria-hidden="true"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
      </svg>
    ),
  },
  {
    title: "Sản phẩm",
    link: "/product",
    svg: (
      <svg
        className="w-5 h-5"
        aria-hidden="true"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path>
        <path d="M2 12h20M12 2c2.5 2 5 6 5 10s-2.5 8-5 10c-2.5-2-5-6-5-10s2.5-8 5-10z"></path>
      </svg>
    ),
    submenu: [
      { title: "Tất cả sản phẩm", link: "/product" },
      { title: "Thêm mới", link: "/product/add" },
      { title: "Danh mục", link: "/category" },
      { title: "Thương hiệu", link: "/brand" },
    ],
  },
  {
    title: "Đơn hàng",
    link: "/order",
    svg: (
      <svg
        className="w-6 h-6"
        aria-hidden="true"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <rect
          x="4"
          y="2"
          width="16"
          height="20"
          rx="2"
          ry="2"
          stroke="currentColor"
        />
        <path d="M8 6h8" stroke="currentColor" />
        <path d="M8 10h8" stroke="currentColor" />
        <path d="M8 14h5" stroke="currentColor" />
        <path d="M12 18h4" stroke="currentColor" />
      </svg>
    ),
  },
  {
    title: "Khách hàng",
    link: "/customers",
    svg: (
      <svg
        className="w-6 h-6"
        aria-hidden="true"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M12 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
        <path d="M16 16c0-2.21-1.79-4-4-4s-4 1.79-4 4" />
        <path d="M6 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
        <path d="M9 14c0-1.66-1.34-3-3-3S3 12.34 3 14" />
        <path d="M18 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
        <path d="M21 14c0-1.66-1.34-3-3-3s-3 1.34-3 3" />
      </svg>
    ),
  },
  {
    title: "Bài viết",
    link: "/post",
    svg: (
      <svg
        className="w-5 h-5"
        aria-hidden="true"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M2 12l10 10L22 12V4H12L2 12z"></path>
        <circle cx="12" cy="8" r="1.5"></circle>
      </svg>
    ),
    submenu: [
      { title: "Tất cả bài viết", link: "/post" },
      { title: "Thêm mới", link: "/post/add" },
      { title: "Danh mục bài viết", link: "/topic" },
    ],
  },
  {
    title: "Thành viên",
    link: "/staffs",
    svg: (
      <svg
        className="w-5 h-5"
        aria-hidden="true"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M12 14c4.418 0 8 3.582 8 8H4c0-4.418 3.582-8 8-8z" />
        <path d="M12 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
      </svg>
    ),
  },
];

export { routesPage, menuItems };
