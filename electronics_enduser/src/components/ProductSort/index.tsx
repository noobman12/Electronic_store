"use client"
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ProductSort = () => {
    const pathname = usePathname()
    const searchParams   = useSearchParams()
    
    const sort = searchParams.get('sort');
    const order = searchParams.get('order');
    const [ isMaxPrice, setIsMaxPrice ] = useState(false)
    const [ isMinPrice, setIsMinPrice ] = useState(false)
    

    const handleClickSortPrice = (type: string) => {
        if (type === "maxPrice") {
            setIsMaxPrice(!isMaxPrice);
            setIsMinPrice(false);
        } else {
            setIsMinPrice(!isMinPrice);
            setIsMaxPrice(false);
        }
    }
    
    useEffect(() => {
        if (sort === 'price' && order === 'ASC') {
            setIsMinPrice(true);
            setIsMaxPrice(false);
        } else if (sort === 'price' && order === 'DESC') {
            setIsMaxPrice(true);
            setIsMinPrice(false);
        } else {
            setIsMaxPrice(false);
            setIsMinPrice(false);
        }

    }, [pathname, searchParams, sort, order]); 


    const generateUrl = (sortType: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', 'price');
        params.set('order', sortType);

        return `${pathname}?${params.toString()}`;
    };
     

  return (
    <div className="row">
        <div className="col-12 col-md-12">
            <ul id="sort-by-full" className="list-unstyled">
                <li>
                    <b>Sắp xếp theo:</b>
                </li>
                <li>
                    <Link 
                        onClick={ () => handleClickSortPrice('minPrice')}
                        className={isMinPrice ? 'active' : ''}
                        href={generateUrl('ASC')}>
                        
                        <i className="fa fa-sort-amount-asc" />
                        &nbsp;Giá thấp
                    </Link>
                </li>
                <li>
                    <Link 
                        onClick={ () => handleClickSortPrice('maxPrice')}
                        className={isMaxPrice ? 'active' : ''}
                        href={generateUrl('DESC')}>
                        <i className="fa fa-sort-amount-desc" />
                        &nbsp;Giá cao
                    </Link>
                </li>
            
            </ul>
        </div>
    </div>
  )
}

export default ProductSort
