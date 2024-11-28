import { Helmet } from "react-helmet-async";
import CategoryAdd from "../components/CategoryComponents/CategoryAdd";
import CategoryList from "../components/CategoryComponents/CategoryList";

const CategoriesPage = () => {
  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Electronics - Danh mục sản phẩm </title>
        <link rel='canonical' href={window.location.href} />
        <meta name='description' content='Danh mục sản phẩm' />
      </Helmet>
      <main className='h-full overflow-y-auto'>
        <div className='container px-6 mx-auto grid'>
          <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
            Danh mục sản phẩm
          </h2>
          <div className='grid grid-cols-12 md:grid-cols-12 gap-[15px]'>
            <CategoryAdd />
            <CategoryList />
          </div>
        </div>
      </main>
    </>
  );
};

export default CategoriesPage;
