import { Helmet } from "react-helmet-async";
import TopicAdd from "../components/TopicComponents/TopicAdd";
import TopicList from "../components/TopicComponents/TopicList";

const TopicPage = () => {
    return (
        <>
          <Helmet>
            <meta charSet='utf-8' />
            <title>Electronics - Danh mục bài viết </title>
            <link rel='canonical' href={window.location.href} />
            <meta name='description' content='Danh mục bài viết' />
          </Helmet>
          <main className='h-full overflow-y-auto'>
            <div className='container px-6 mx-auto grid'>
              <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
                Danh mục bài viết
              </h2>
              <div className='grid grid-cols-12 md:grid-cols-12 gap-[15px]'>
                <TopicAdd />
                <TopicList />
              </div>
            </div>
          </main>
        </>
      );
};

export default TopicPage;
