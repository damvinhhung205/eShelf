import * as yup from "yup";

export const publisherSchema = yup.object({
    name: yup.string().required("Vui lòng nhập tên").min(3, "Vui lòng nhập ít nhất 3 ký tự").max(30, "Tên người dùng tối đa 30 ký tự"),
    address: yup.string().required("Vui lòng nhập địa chỉ").min(3, "Vui lòng nhập ít nhất 3 ký tự").max(100, "Địa chỉ tối đa 100 ký tự."),
});