import * as yup from "yup";

export const bookSchema = yup.object({
    title: yup.string().required("Vui lòng nhập tựa sách").min(3, "Ít nhất 3 ký tự").max(50, "Tối đa 50 ký tự"),
    author: yup.string().required("Vui lòng nhập tác giả").min(3, "Ít nhất 3 ký tự").max(30, "Tối đa 30 ký tự"),
    quantity: yup.number().required("Vui lòng nhập số lượng").min(1, "Số lượng tối thiểu 1").max(200, "Tối đa 200").typeError("Số lượng phải là số"),
    publisherID: yup.string().required("Vui lòng chọn nhà xuất bản"),
    price: yup.number().required("Vui lòng nhập đơn giá").min(0, "Đơn giá tối thiểu 0").max(2000000, "Tối đa 2.000.000").typeError("Đơn giá phải là số"),
    publishedYear: yup.number().required("Vui lòng nhập năm xuất bản").min(1500, "Năm không hợp lệ").max(new Date().getFullYear(), "Năm không được vượt quá hiện tại").typeError("Năm xuất bản phải là số"),
});