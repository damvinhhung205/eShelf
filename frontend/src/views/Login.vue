<script setup>
import { useRouter } from 'vue-router';
import UserService from '.././services/user.service';
import StaffService from '.././services/staff.service';
import { push } from 'notivue';
import { useForm, useField } from "vee-validate";
import { loginSchema } from '.././validations/login.validation';

const router = useRouter();
const userService = new UserService();
const staffService = new StaffService();

const { handleSubmit } = useForm({ validationSchema: loginSchema });
const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");

const saveAuthAndRedirect = (data) => {
  const { token, account } = data;
  sessionStorage.setItem("authenticateToken", token);
  sessionStorage.setItem("username", account.username);
  sessionStorage.setItem("id", account._id);
  sessionStorage.setItem("role", account.role);
  push.success("Đăng nhập thành công");
  router.push(account.role === 'staff' ? "/books" : "/");
};

const handleLogin = handleSubmit(async () => {
  try {
    const data = await userService.login(username.value, password.value);
    if (data?.token) {
      saveAuthAndRedirect(data);
      return;
    }
  } catch (error) {
    // fallback to staff
  }
  try {
    const data = await staffService.login(username.value, password.value);
    if (data?.token) {
      saveAuthAndRedirect(data);
      return;
    }
  } catch (error) {
    push.error("Tên đăng nhập hoặc mật khẩu không đúng");
  }
});
</script>

<template>
  <div class="bg-cover bg-[url(/images/t2_de_sach_sau_khi_doc.jpg)] transition-all duration-300">
    <div class="backdrop-brightness-50 backdrop-blur-xs grid place-items-center h-screen">
      <form @submit.prevent="handleLogin">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 text-base shadow-xl">
          <h1 class="font-bold text-2xl text-center mb-4">Đăng Nhập</h1>
          <label class="label">Tên đăng nhập</label>
          <input v-model="username" type="text" class="input" placeholder="Nhập tên đăng nhập" />
          <span class="text-red-600 text-sm">{{ usernameError }}</span>

          <label class="label">Mật khẩu</label>
          <input v-model="password" type="password" class="input" placeholder="Nhập mật khẩu" />
          <span class="text-red-600 text-sm">{{ passwordError }}</span>

          <button type="submit" class="btn btn-primary mt-4">Đăng Nhập</button>
          <span class="mt-8 text-center w-full block">Bạn chưa có tài khoản?
            <strong class="hover:underline"><RouterLink to="/user/register">Đăng ký</RouterLink></strong>
          </span>
          <div class="divider">HOẶC</div>
          <a href="http://localhost:3000/api/auth/google" class="btn bg-white text-black border-black w-full">
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
            Đăng nhập bằng Google</a>
        </fieldset>
      </form>
    </div>
  </div>
</template>