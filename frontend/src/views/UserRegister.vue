<script setup>
import { useRouter } from 'vue-router';
import UserService from '.././services/user.service';
import { push } from 'notivue';
import { useForm, useField } from "vee-validate";
import { userSchema } from '.././validations/user.validation';

const router = useRouter();
const userService = new UserService();

const { handleSubmit } = useForm({ validationSchema: userSchema });
const { value: firstName, errorMessage: firstNameError } = useField("firstName");
const { value: lastName, errorMessage: lastNameError } = useField("lastName");
const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: birthDate, errorMessage: birthDateError } = useField("birthDate");
const { value: gender, errorMessage: genderError } = useField("gender", { initialValue: 'Male' });
const { value: address, errorMessage: addressError } = useField("address");
const { value: phone, errorMessage: phoneError } = useField("phone");

const handleRegister = handleSubmit(async (values) => {
  try {
    await userService.register(values);
    push.success("Đăng ký thành công");
    router.push("/auth/login");
  } catch (error) {
    if (error.response?.status === 409) {
      push.error("Tên đăng nhập đã tồn tại");
    } else {
      push.error("Đăng ký thất bại");
    }
  }
});
</script>

<template>
  <div class="bg-cover bg-[url(/images/t2_khu_vuc_tu_hoc_2.jpg)]">
    <div class="backdrop-brightness-50 backdrop-blur-xs flex justify-center items-center min-h-screen py-8">
      <form @submit.prevent="handleRegister">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 text-base shadow">
          <h1 class="font-bold text-2xl text-center">Đăng Ký</h1>
          <label class="label">Họ lót</label>
          <input v-model="lastName" type="text" class="input" placeholder="Nhập họ lót" />
          <span class="text-red-600 text-sm">{{ lastNameError }}</span>

          <label class="label">Tên</label>
          <input v-model="firstName" type="text" class="input" placeholder="Nhập tên" />
          <span class="text-red-600 text-sm">{{ firstNameError }}</span>

          <label class="label">Ngày sinh</label>
          <input v-model="birthDate" type="date" class="input" />
          <span class="text-red-600 text-sm">{{ birthDateError }}</span>

          <label class="label">Giới tính</label>
          <div class="flex gap-8">
            <label><input v-model="gender" type="radio" value="Male" class="radio mr-1" /> Nam</label>
            <label><input v-model="gender" type="radio" value="Female" class="radio mr-1" /> Nữ</label>
          </div>
          <span class="text-red-600 text-sm">{{ genderError }}</span>

          <label class="label">Địa chỉ</label>
          <input v-model="address" type="text" class="input" placeholder="Nhập địa chỉ" />
          <span class="text-red-600 text-sm">{{ addressError }}</span>

          <label class="label">Số điện thoại</label>
          <input v-model="phone" type="text" class="input" placeholder="Nhập số điện thoại" />
          <span class="text-red-600 text-sm">{{ phoneError }}</span>

          <label class="label">Tên đăng nhập</label>
          <input v-model="username" type="text" class="input" placeholder="Nhập tên đăng nhập" />
          <span class="text-red-600 text-sm">{{ usernameError }}</span>

          <label class="label">Mật khẩu</label>
          <input v-model="password" type="password" class="input" placeholder="Nhập mật khẩu" />
          <span class="text-red-600 text-sm">{{ passwordError }}</span>

          <button type="submit" class="btn btn-primary mt-4">Đăng Ký</button>
          <span class="mt-8 text-center w-full block">Bạn đã có tài khoản?
            <strong class="hover:underline"><RouterLink to="/auth/login">Đăng nhập</RouterLink></strong>
          </span>
        </fieldset>
      </form>
    </div>
  </div>
</template>