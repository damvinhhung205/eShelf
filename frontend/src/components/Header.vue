<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const username = computed(() => sessionStorage.getItem("username"));
const role = computed(() => sessionStorage.getItem("role"));
const displayName = "";
const router = useRouter();
const { logOut } = useAuth();

const goToProfile = () => {
  if (role.value === "staff") {
    router.push("/staffprofile");
  } else {
    router.push("/userprofile");
  }
};
</script>

<template>
  <div class="navbar bg-base-100 shadow">
    <div class="navbar-start">
      <div class="dropdown" v-if="role === 'user' || role === 'staff'">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
          <li v-if="role === 'staff'"><RouterLink to="/books">Danh mục sách</RouterLink></li>
          <li v-if="role === 'staff'"><RouterLink to="/borrowpending">Đơn mượn sách</RouterLink></li>
          <li v-if="role === 'staff'"><RouterLink to="/publishers">Nhà xuất bản</RouterLink></li>
          <li v-if="role === 'staff'"><RouterLink to="/users">Người dùng</RouterLink></li>
          <!-- <li v-if="role === 'staff'"><RouterLink to="/staffs">Nhân viên</RouterLink></li> -->
          <li v-if="role === 'user'"><RouterLink to="/books">Danh mục sách</RouterLink></li>
          <li v-if="role === 'user'"><RouterLink to="/borrowcheck">Kiểm tra đơn mượn</RouterLink></li>
        </ul>
      </div>
      <RouterLink to="/" class="ml-2 text-base md:text-lg lg:text-xl font-bold ">eShelf</RouterLink>
    </div>

    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal gap-5 px-1 text-base">
        <li v-if="role === 'staff'"><RouterLink to="/books" exact-active-class="menu-active text-base font-bold transition-all duration-200 ease-in-out">Danh mục sách</RouterLink></li>
        <li v-if="role === 'staff'"><RouterLink to="/borrowpending" exact-active-class="menu-active text-base font-bold transition-all duration-200 ease-in-out">Đơn mượn sách</RouterLink></li>
        <li v-if="role === 'staff'"><RouterLink to="/publishers" exact-active-class="menu-active text-base font-bold transition-all duration-200 ease-in-out">Nhà xuất bản</RouterLink></li>
        <li v-if="role === 'staff'"><RouterLink to="/users" exact-active-class="menu-active text-base font-bold transition-all duration-200 ease-in-out">Người dùng</RouterLink></li>
        <!-- <li v-if="role === 'staff'"><RouterLink to="/staffs">Nhân viên</RouterLink></li> -->
        <li v-if="role === 'user'"><RouterLink to="/books" exact-active-class="menu-active text-base font-bold transition-all duration-200 ease-in-out">Danh mục sách</RouterLink></li>
        <li v-if="role === 'user'"><RouterLink to="/borrowcheck" exact-active-class="menu-active text-base font-bold transition-all duration-200 ease-in-out">Kiểm tra đơn mượn</RouterLink></li>
      </ul>
    </div>

    <div class="navbar-end">
      <template v-if="!username">
        <RouterLink to="/auth/login" class="btn btn-primary px-4 text-base mr-2">Đăng Nhập</RouterLink>
      </template>
      <template v-else>
        <button @click="goToProfile" class="mr-2 text-base font-bold hover:underline">Xin chào, {{ username }}</button>
        <button @click="logOut" class="btn btn-outline btn-xs btn-error">Đăng xuất</button>
      </template>
    </div>
  </div>
</template>