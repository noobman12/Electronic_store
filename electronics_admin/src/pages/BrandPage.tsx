import { Helmet } from "react-helmet-async";
import BrandAdd from "../components/BrandComponents/BrandAdd";
import BrandList from "../components/BrandComponents/BrandList";

const BrandPage = () => {
  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Electronics - Thương hiệu </title>
        <link rel='canonical' href={window.location.href} />
        <meta name='description' content='Thương hiệu' />
      </Helmet>
      <main className='h-full overflow-y-auto'>
        <div className='container px-6 mx-auto grid'>
          <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
            Thương hiệu
          </h2>
          <div className='grid grid-cols-12 md:grid-cols-12 gap-[15px]'>
            <BrandAdd />
            <BrandList />
          </div>
        </div>
      </main>
    </>
  );
};

export default BrandPage;
