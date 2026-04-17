<script setup>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { push } from "notivue";
import { userSchema } from "../validations/user.validation";
import UserService from "../services/user.service";
import { useForm, useField } from "vee-validate";

const userService = new UserService();
const router = useRouter();
const route = useRoute();
const role = computed(() => sessionStorage.getItem("role"));

const { handleSubmit, resetForm } = useForm({
  validationSchema: userSchema,
});

const userID = route.params.id;

const handleUserProfileEdit = handleSubmit(async (values) => {
  try {
    await userService.updateUser(userID, values);
    push.success("Cập nhật thông tin người dùng thành công");
    if (role.value === "staff") {
      router.push("/users");
    } else {
      router.push("/userprofile");
    }
  } catch (error) {
    console.log(error);
    if (error.response.status === 400) {
      push.error("Vui lòng điền đầy đủ thông tin");
    } else if (error.response.status === 409) {
      push.error("Tên đăng nhập đã tồn tại");
    } else {
      push.error("Đã xảy ra lỗi khi cập nhật thông tin người dùng");
    }
  }
});

const handleUserProfileDelete = async (userID) => {
  try {
    if (confirm("Xác nhận xóa tài khoản?")) {
      await userService.deleteUser(userID);
      push.success("Xóa tài khoản thành công");
      sessionStorage.clear();
      push.info("Bạn đã đăng xuất do tài khoản bị xóa");
      router.push("/");
    }
  } catch (error) {
    push.error("Đã xảy ra lỗi khi xóa tài khoản");
  }
};

const { value: firstName, errorMessage: firstNameError } = useField("firstName");
const { value: lastName, errorMessage: lastNameError } = useField("lastName");
const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: birthDate, errorMessage: birthDateError } = useField("birthDate");
const { value: gender, errorMessage: genderError } = useField("gender");
const { value: address, errorMessage: addressError } = useField("address");
const { value: phone, errorMessage: phoneError } = useField("phone");

onMounted(async () => {
  const userData = await userService.getUser(userID);
  console.log();
  resetForm({
    values: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      gender: userData.gender,
      address: userData.address,
      birthDate: new Date(userData.birthDate).toISOString().slice(0, 10),
      phone: userData.phone,
      username: userData.username,
      // password: userData.password
    },
  });
});
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header></Header>
    <div class="flex justify-center items-center grow">
      <form @submit.prevent>
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 text-base shadow">
          <legend class="fieldset-legend text-xl">Cập nhật người dùng</legend>
          
          <label class="label">Họ lót</label>
          <input v-model="lastName" type="text" class="input" placeholder="Nhập họ lót" />
          <span class="text-sm text-red-600">{{ lastNameError }}</span>

          <label class="label">Tên</label>
          <input v-model="firstName" type="text" class="input" placeholder="Nhập tên" />
          <span class="text-sm text-red-600">{{ firstNameError }}</span>

          <label class="label">Ngày sinh</label>
          <input v-model="birthDate" type="date" class="input" />
          <span class="text-sm text-red-600">{{ birthDateError }}</span>

          <label class="label">Giới tính</label>
          <div class="flex gap-8">
            <label><input v-model="gender" type="radio" value="Male" class="radio mr-1" /> Nam</label>
            <label><input v-model="gender" type="radio" value="Female" class="radio mr-1" /> Nữ</label>
          </div>
          <span class="text-sm text-red-600">{{ genderError }}</span>

          <label class="label">Địa chỉ</label>
          <input v-model="address" type="text" class="input" placeholder="Nhập địa chỉ" />
          <span class="text-sm text-red-600">{{ addressError }}</span>

          <label class="label">Số điện thoại</label>
          <input v-model="phone" type="text" class="input" placeholder="Nhập số điện thoại" />
          <span class="text-sm text-red-600">{{ phoneError }}</span>

          <label class="label">Tên đăng nhập</label>
          <input v-model="username" type="text" class="input" placeholder="Nhập tên đăng nhập" />
          <span class="text-sm text-red-600">{{ usernameError }}</span>

          <label class="label">Mật khẩu</label>
          <input v-model="password" type="password" class="input" placeholder="Nhập mật khẩu" />
          <span class="text-sm text-red-600">{{ passwordError }}</span>

          <div class="grid grid-cols-1 gap-2">
            <button @click="handleUserProfileEdit(userID)" class="btn btn-primary mt-4">Lưu thay đổi</button>
            
          </div>

          <div class="grid grid-cols-2 gap-2">
            <strong class="hover:underline mt-5">
              <RouterLink :to="role === 'staff' ? '/users' : '/userprofile'" class="text-base">Quay lại</RouterLink>
            </strong>
            <button @click="handleUserProfileDelete(userID)" class="btn btn-sm btn-error mt-4">Xóa</button>
          </div>
        </fieldset>
      </form>
    </div>
    <Footer></Footer>
  </div>
</template>
