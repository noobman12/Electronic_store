import Breadcrumb from "@/components/Breadcrumb";
import ProductDetail from "@/components/ProducDetail";
import ProductDesc from "@/components/ProductDesc";
import ProductGalleries from "@/components/ProductGalleries";
import ProductSpecifications from "@/components/ProductSpecifications";
import { SETTINGS } from "@/constants/setting";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function fetchProductData(slug: string) {
  try {
    const res = await fetch(`${SETTINGS.URL_API}/v1/products/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const product = await fetchProductData(slug);
  if (product.statusCode === 400) notFound();

  return {
    title: `${product.data?.product_name}`,
    description: `${product?.data?.product_name} cao cấp`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const product = await fetchProductData(slug);

  const product_name = product.data?.product_name;
  return (
    <>
      <div className='body-content bg-page'>
        <div className='container'>
          <div className='wrap-product'>
            <Breadcrumb pageName={product_name} />
            <div className='clearfix'></div>
            <div className='row'>
              <div className='col-12'>
                <div className='pdetail-name'>
                  <h1> {product_name} </h1>
                  <div className='pdetail-social' />
                </div>
              </div>
            </div>
            <div className='clearfix'></div>
            <div className='product-detail'>
              <div className='row'>
                <ProductGalleries imageUrl={product.data?.thumbnail} />
                <ProductDesc product={product.data} />
              </div>
            </div>

            <div className='clearfix'></div>
            <div className='product-detail-content-border'></div>

            <div className='row'>
              <ProductDetail product={product.data} />
              <ProductSpecifications product={product.data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}