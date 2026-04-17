<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserService from ".././services/user.service";
import { useAuth } from ".././composables/useAuth";
import { push } from "notivue";
import Header from "../components/Header.vue";

const router = useRouter();
const userService = new UserService();
const { logOut } = useAuth();
const userId = sessionStorage.getItem("id");
const user = ref(null);

const fetchProfile = async () => {
  try {
    user.value = await userService.getUser(userId);
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
            Thông tin người dùng
          </h2>
          <div class="grid grid-cols-2 gap-2 mt-4">
            <div class="font-bold">Họ lót:</div>
            <div>{{ user?.lastName || "—" }}</div>
            <div class="font-bold">Tên:</div>
            <div>{{ user?.firstName || "—" }}</div>
            <div class="font-bold">Tên đăng nhập:</div>
            <div>{{ user?.username }}</div>
            <div class="font-bold">Ngày sinh:</div>
            <div>
              {{
                user?.birthDate
                  ? new Date(user.birthDate).toLocaleDateString("vi-VN")
                  : "—"
              }}
            </div>
            <div class="font-bold">Giới tính:</div>
            <div>
              {{
                user?.gender === "Male"
                  ? "Nam"
                  : user?.gender === "Female"
                    ? "Nữ"
                    : "—"
              }}
            </div>
            <div class="font-bold">Địa chỉ:</div>
            <div>{{ user?.address || "—" }}</div>
            <div class="font-bold">Số điện thoại:</div>
            <div>{{ user?.phone || "—" }}</div>
          </div>
          <div class="card-actions justify-end mt-4 gap-5">
            <button
              @click="router.push(`/userprofile/edit/${user._id}`)"
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
