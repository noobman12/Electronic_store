import BannerAdv from "../BannerAdv"
import BannerSlider from "../BannerSlider"

const BannerHome = () => {

    return (
    <div className="row">
        <div className="col-12">
            <div id="home-slide" className="row">
                <BannerSlider />
                <BannerAdv />
            </div>
        </div>
    </div>
    )
}

export default BannerHome
