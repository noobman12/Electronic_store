import BannerHome from "@/components/BannerHome";
import BrandHome from "@/components/BrandHome";
import PostBlock from "@/components/PostBlock";
import ProductBlock from "@/components/ProductBlock";

export default function Home() {
  return (
    <>
      <div className="body-content bg-page">
        <div className="container">
          <div className="page-home">
            <BannerHome />
            {/* <div className="row">
              <div className="col-12">
                <div className="boxbanner-64" />  
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="boxbanner-65 owlRespon-3" />
              </div>
            </div>
            <div className="mhome-menu" style={{ display: "none" }}>
              <ul className="list-unstyled" />
            </div>
            <div className="row">
              <div className="col-12">
                <div className="boxbanner-13" />
              </div>
            </div>
            <div className="row">
              <div className="col-12" />
            </div>
            <div className="row">
              <div className="col-12" />
            </div>
            <div className="row">
              <div className="col-12">
                <div className="product-bestseller">
                  <div className="boxbanner-4" />
                </div>
              </div>
            </div> */}
            <BrandHome />
            <ProductBlock />
            <PostBlock />
            
        
            
            
          </div>
        </div>
        <div className="clearfix" />
      </div>
      <div className="clearfix"></div>
    </>
  );
}
