'use client'
import { signOut, useSession } from "next-auth/react";
import { useCart } from '@/stores/useCart';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";

const HeaderMain = () => {
    const { getTotalNumber } = useCart()
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    const { data: session, status } = useSession();
    const isLoggedIn = status === "authenticated";

    const router = useRouter();

    const [searchKey, setSearchKey] = useState("");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchKey.trim()) {
          router.push(`/products?s=${encodeURIComponent(searchKey)}`);
        }
    };

    return (
        <div className="bgcolor-main">
            
            <div className="container">
                <div className="row header-body flex flex-content-spacebetween">
                    <div className="col-md-3 col-9">
                        <div className="box-logo">
                            <Link className="flex flex-items-center" href="/">
                                <span></span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-5 col-3 box-utilities">
                        <div className="flex flex-content-spacearound">
                            <div className="box-contact">
                                <a href="tel:19006788">
                                    <b>1900 6788</b> <span>Tư vấn bán hàng</span>
                                </a>
                            </div>
                            <div className="box-location">
                                <a href="/he-thong-sieu-thi">
                                    <b>Tìm Siêu Thị</b> <span>Mở cửa: 8:00 - 21:30</span>
                                </a>
                            </div>
                            <div className="box-cart">
                                <div className="cart-badge badge-icons pull-right">
                                    <Link href="/cart">
                                        <i className="fa fa-shopping-cart"></i>
                                        <span>Giỏ hàng</span>
                                    </Link>
                                    {
                                        isClient && getTotalNumber() > 0 && (
                                            <span className="badge badge-sea rounded-x">{ getTotalNumber() }</span>
                                        )
                                    }
                                    
                                    <div className="badge-open"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-12 box-search">
                        <div className="row">
                            <div className="col-12 col-md-12">
                                <div className="menuhead-news flex flex-content-right">
                                    <ul className="login">
                                        <li className="nav-item">
                                            {
                                                isLoggedIn ? (<a  className="nav-link">Chào, {session?.user?.first_name }</a>) :(<Link rel="nofollow" className="nav-link" href="/login"> Đăng nhập </Link>)
                                            }
                                        </li>
                                        {
                                            isLoggedIn ? (
                                                <li className="nav-item">
                                                    <a rel="nofollow" 
                                                     onClick={(e) => {
                                                        e.preventDefault();
                                                        signOut({ callbackUrl: "/login" });
                                                    }}
                                                    className="nav-link" href="#"> Đăng xuất </a>
                                                </li>
                                            ) :(
                                                <li className="nav-item">
                                                    <a rel="nofollow" className="nav-link" href="/signup"> Đăng ký </a>
                                                </li>
                                            )
                                        }
                                        
                                    </ul>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-1 col-md-0"></div>
                            <div className="col-11 col-md-12">
                                <form className="form-inline" onSubmit={handleSubmit}>
                                    <div className="form-group search-input">
                                    <input
                                    name="key"
                                    className="form-control"
                                    placeholder="Bạn tìm gì..."
                                    value={searchKey}
                                    onChange={(e) => setSearchKey(e.target.value)}
                                    />
                                    </div>
                                    <button className="search-btn">
                                        <i className="fa fa-search" aria-hidden="true"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default HeaderMain
