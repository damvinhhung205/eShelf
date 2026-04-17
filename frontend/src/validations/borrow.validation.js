import * as yup from "yup";

const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 14);

export const borrowSchema = yup.object({
    returnDate: yup.date().required("Vui lòng chọn ngày trả").min(new Date(), "Ngày trả phải sau ngày mượn").max(maxDate, "Chỉ được mượn tối đa 14 ngày").typeError("Vui lòng chọn ngày trả"),
});