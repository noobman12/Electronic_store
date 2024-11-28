"use client";
import React, { useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationComponentProps {
  totalPages: number;
}
export default function PaginationComponent({
  totalPages,
}: PaginationComponentProps) {
  const [page, setPage] = React.useState(1);
  const searchParams = useSearchParams();
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const router = useRouter();
  const pathname = usePathname();
  // const { query } = router;
  // console.log("query", query);

  // useEffect(() => {
  //   // Kiểm tra và loại bỏ `page=1` khi trang tải lần đầu
  //   console.log("searchParams",searchParams.toString())
  //   if(!searchParams.toString() || searchParams.toString() === ''){
  //     router.push(`/`);
  //   }

  // }, [searchParams,router]);

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    if (page === 1) {
      currentParams.delete("page");
    } else {
      currentParams.set("page", page.toString());
    }

    router.push(`${pathname}?${currentParams.toString()}`);
  }, [page, searchParams, router, pathname]);
 

  return (
    <Stack spacing={2} alignItems="center">
      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        color="primary"
      />
    </Stack>
  );
}
