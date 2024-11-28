import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';

const useCheckPageDefault = (typePage: string) => {
    const searchParams = useSearchParams();
    const pageParam = searchParams.get('page');
    if (pageParam === '1') {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('page');
        redirect(`/${typePage}?${params.toString()}`);
    }
};
export default useCheckPageDefault;