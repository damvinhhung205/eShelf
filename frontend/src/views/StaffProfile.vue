<script setup>
import { ref, onMounted } from "vue";
import StaffService from ".././services/staff.service";
import { useAuth } from ".././composables/useAuth";
import { push } from "notivue";
import Header from "../components/Header.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const staffService = new StaffService();
const { logOut } = useAuth();
const staffId = sessionStorage.getItem("id");
const staff = ref(null);

const fetchProfile = async () => {
  try {
    staff.value = await staffService.getStaff(staffId);
  } catch (error) {
    push.error("Lỗi tải thông tin");
  }
};

onMounted(fetchProfile);
</script>

<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <Header></Header>
    <div class="flex justify-center items-center min-h-[80vh]">
      <div class="card w-full max-w-xl bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl justify-center">
            Thông tin nhân viên
          </h2>
          <div class="grid grid-cols-2 gap-2 mt-4">
            <div class="font-bold">Họ tên:</div>
            <div>{{ staff?.fullName }}</div>
            <div class="font-bold">Tên đăng nhập:</div>
            <div>{{ staff?.username }}</div>
            <div class="font-bold">Địa chỉ:</div>
            <div>{{ staff?.address }}</div>
            <div class="font-bold">Số điện thoại:</div>
            <div>{{ staff?.phone }}</div>
          </div>
          <div class="card-actions justify-end mt-4 gap-5">
            <button
              @click="router.push(`/staff/edit/${staff._id}`)"
              class="btn btn-sm btn-info hover:scale-[1.01]"
            >
              Chỉnh sửa
            </button>
            <button @click="logOut" class="btn btn-sm btn-outline btn-error">Đăng xuất</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
