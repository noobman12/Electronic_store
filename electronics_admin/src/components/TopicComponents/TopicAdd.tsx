function TopicAdd() {
  return (
    <div className="col-span-12 md:col-span-5">
        <h3 className="mb-3  text-gray-700 dark:text-gray-200">
            Thêm mới
        </h3>
        <form action="">
            <div className="form-group">
                <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">
                        Tên danh mục
                    </span>
                    <input
                    className="pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                    placeholder="Jane Doe"
                    />
                </label>
            </div>
            <div className="form-group">
                <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">
                        Đường dẫn
                    </span>
                    <input
                    className="pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                    placeholder="Jane Doe"
                    />
                </label>
            </div>
            <div className="form-group">
                <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">
                        Mô tả
                    </span>
                    <textarea rows = {5}
                    className="pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                    placeholder="Jane Doe"
                    ></textarea>
                </label>
            </div>
            <button className=" mt-3 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                Thêm mới
            </button>
        </form>
    </div>
  )
}

export default TopicAdd
