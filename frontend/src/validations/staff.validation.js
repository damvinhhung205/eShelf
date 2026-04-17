import * as yup from "yup";

export const staffSchema = yup.object({
    fullName: yup.string().required("Vui lòng nhập họ tên").min(3, "Ít nhất 3 ký tự").max(50, "Tối đa 50 ký tự"),
    username: yup.string().required("Vui lòng nhập tên đăng nhập").min(3, "Ít nhất 3 ký tự").max(30, "Tối đa 30 ký tự"),
    password: yup.string().required("Vui lòng nhập mật khẩu").min(3, "Ít nhất 3 ký tự").max(30, "Tối đa 30 ký tự"),
    address: yup.string().required("Vui lòng nhập địa chỉ").max(100, "Địa chỉ tối đa 100 ký tự"),
    phone: yup.string().required("Vui lòng nhập số điện thoại").matches(/^(09|03|07|08|05)\d{8}$/, "Số điện thoại không hợp lệ"),
});