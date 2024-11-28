import { model, Schema } from "mongoose";

// Khởi tạo schema
const brandSchema = new Schema(
  {
    brand_name: {
      type: String,
      require: true, //mặc định là true, nếu ko liệt kê vào
      maxLength: 50, // tối đa 50 ký tự
      unique: true, // chống trùng lặp tên danh mục
      trim: true, // tự động cắt ký tự trắng trước/sau
    },
    description: {
      type: String,
      require: false, //mặc định là true, nếu ko liệt kê vào
      maxLength: 500, // tối đa 500 ký tự
      trim: true, // tự động cắt ký tự trắng trước/sau
    },
    slug: {
      type: String,
      require: true, //mặc định là true, nếu ko liệt kê vào
      maxLength: 50, // tối đa 50 ký tự
      unique: true, // chống trùng lặp tên danh mục
      trim: true, // tự động cắt ký tự trắng trước/sau
    },
    logo_url: {
      type: String,
      require: false,
    },
    order: {
      type: Number,
      default: 50, // giá trị mặc định khi không điền
      min: 1, // giá trị tối thiểu chấp nhận
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Tự động tạo 2 trường createAt và UpdateAt
    //collection: categories
  }
);

// Export một model

const Brand = model("Brand", brandSchema);
export default Brand;
