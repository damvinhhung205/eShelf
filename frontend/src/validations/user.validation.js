import * as yup from "yup";

const birthDateValidate = new Date();
birthDateValidate.setFullYear(birthDateValidate.getFullYear() - 7);

export const userSchema = yup.object({
    firstName: yup.string().required("Vui lòng nhập tên").min(2, "Ít nhất 2 ký tự").max(30, "Tối đa 30 ký tự"),
    lastName: yup.string().required("Vui lòng nhập họ").min(2, "Ít nhất 2 ký tự").max(30, "Tối đa 30 ký tự"),
    username: yup.string().required("Vui lòng nhập tên đăng nhập").min(3, "Ít nhất 3 ký tự").max(30, "Tối đa 30 ký tự"),
    password: yup.string().required("Vui lòng nhập mật khẩu").min(3, "Ít nhất 3 ký tự").max(30, "Tối đa 30 ký tự"),
    birthDate: yup.date().max(birthDateValidate, "Phải ít nhất 7 tuổi").required("Vui lòng chọn ngày sinh").typeError("Ngày sinh không hợp lệ"),
    gender: yup.string().required("Vui lòng chọn giới tính").oneOf(['Male', 'Female'], "Giới tính không hợp lệ"),
    address: yup.string().required("Vui lòng nhập địa chỉ").max(100, "Địa chỉ tối đa 100 ký tự"),
    phone: yup.string().required("Vui lòng nhập số điện thoại").matches(/^(09|03|07|08|05)\d{8}$/, "Số điện thoại không hợp lệ (bắt đầu bằng 09,03,07,08,05 và 10 số)"),
});