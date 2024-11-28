import createError from "http-errors";
import Brand from "../models/brands.model";
import { TPayloadBrand } from "../types/modes";

// 1.Get all Brands
const allBrands = async (query: any) => {
    let objSort: any = {};
    const sortBy  = query.sort || 'createdAt'; // Mặc dịnh sắp xếp thep ngày giảm dần
    const orderBy = query.order && query.order == 'ASC' ? 1 : -1
    objSort = { ...objSort,[sortBy]: orderBy }

    // Lọc theo tên thương hiệu
    let objectFilters: any = {};
    if(query.keyword && query.keyword !=''){
        objectFilters = { ...objectFilters, brand_name: new RegExp(query.keyword, 'i')}
    }

    const page_str = query.page
    const limit_str = query.limit
    const page = page_str ? parseInt(page_str as string) : 1
    const limit = limit_str ? parseInt(limit_str as string) : 10

    const totalRecords = await Brand.countDocuments(objectFilters);
    const offset = (page - 1 ) * limit

    const brands = await Brand
    .find({
        ...objectFilters
    })
    .select('-__v -id')
    .sort(objSort)
    .skip(offset)
    .limit(limit)
    return {
        brands_list: brands,
        sort: objSort,
        filters: {
            brand_name: query.keyword || null
        },
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords
        }
    }
}
// 2.Find Brand by Id
const findBrandById = async(id: string)=>{
    const brand = await Brand.findById(id)
    if(!brand){
        throw createError(400, 'Brand Not Found')
    }
    return brand
}

//  Find Brand by slug
const findBrandBySlug = async(slug: string)=>{
    const brand = await Brand.findOne({
        slug: slug
    })
    if(!brand){
        throw createError(400, 'Brand Not Found')
    }
    return brand
}

// 3. Create new brand
const createBrandRecord = async(payload: TPayloadBrand) =>{
    const brand = await Brand.create(payload)
    return brand
}

// 4. update Brand
const updateBrand = async(id:string, payload:TPayloadBrand) =>{
    const brand = await findBrandById(id)
    Object.assign(brand, payload);
    await brand.save()
    return brand
}

const deleteBrand = async(id: string) =>{
    const brand = await findBrandById(id)
    await brand.deleteOne({ _id: brand._id });
    return brand
}


export default {
    allBrands,
    findBrandById,
    findBrandBySlug,
    createBrandRecord,
    updateBrand,
    deleteBrand
}