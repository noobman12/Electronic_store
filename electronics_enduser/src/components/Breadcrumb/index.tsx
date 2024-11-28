import Link from "next/link";
import React from "react";

const Breadcrumb = ({ pageName }: { pageName: string }) => {
  return (
    <>
      <div className='row'>
        <div className='col-12'>
          <h1 className='breadcrumb-highlight'>{pageName}</h1>
          <nav>
            <ol
              className='breadcrumb'
              itemType='https://schema.org/BreadcrumbList'
            >
              <li
                className='breadcrumb-item'
                itemProp='itemListElement'
                itemType='https://schema.org/ListItem'
              >
                <Link href='/' itemProp='item'>
                  <span itemProp='name'>Trang chủ</span>
                  <meta itemProp='position' />
                </Link>
              </li>
              <li className='breadcrumb-item active'>
                <span>{pageName}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div className='clearfix pt-3'></div>
    </>
  );
};

export default Breadcrumb;
