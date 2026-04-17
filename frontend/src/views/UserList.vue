<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import UserService from "../services/user.service";
import { push } from "notivue";
import TableList from ".././components/TableList.vue";
import InputSearch from ".././components/InputSearch.vue";
import Header from "../components/Header.vue";

const router = useRouter();
const userService = new UserService();
const role = computed(() => sessionStorage.getItem("role"));
const users = ref([]);
const searchText = ref("");

const fetchUsers = async () => {
  try {
    users.value = await userService.getAllUsers();
  } catch (error) {
    push.error("Lỗi tải danh sách người dùng");
  }
};

const filteredUsers = computed(() => {
  if (!searchText.value) return users.value;
  const kw = searchText.value.toLowerCase();
  return users.value.filter(
    (u) =>
      u.username?.toLowerCase().includes(kw) ||
      u.firstName?.toLowerCase().includes(kw) ||
      u.lastName?.toLowerCase().includes(kw) ||
      u.phone?.includes(kw),
  );
});

const goToAdd = () => router.push("/user/add");
const goToEdit = (user) => router.push(`/userprofile/edit/${user._id}`);
const deleteUser = async (user) => {
  if (confirm(`Xóa người dùng ${user.username}?`)) {
    try {
      await userService.deleteUser(user._id);
      push.success("Xóa thành công");
      fetchUsers();
    } catch (error) {
      push.error("Xóa thất bại");
    }
  }
};
const deleteAll = async () => {
  if (confirm("Xóa tất cả người dùng?")) {
    try {
      await userService.deleteAll();
      push.success("Xóa tất cả thành công");
      fetchUsers();
    } catch (error) {
      push.error("Xóa tất cả thất bại");
    }
  }
};

const columns = [
  { key: "username", label: "Tên đăng nhập" },
  { key: "lastName", label: "Họ lót" },
  { key: "firstName", label: "Tên" },
  { key: "gender", label: "Giới tính", type: "gender" },
  { key: "birthDate", label: "Ngày sinh", type: "date" },
  { key: "phone", label: "SĐT" },
  { key: "address", label: "Địa chỉ" },
];

onMounted(fetchUsers);
</script>

<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <Header></Header>
    <div class="flex justify-end items-center mb-4">
      <!-- <div class="w-full text-center"></div> -->
      <div v-if="role === 'staff'" class="flex gap-2">
        <button @click="goToAdd" class="btn btn-primary">
          Thêm người dùng
        </button>
        <button @click="deleteAll" class="btn btn-error">Xóa tất cả</button>
      </div>
    </div>

    <!-- Thanh tìm kiếm -->
    <div
      class="mb-4 tooltip w-full max-w-md mx-auto flex justify-center"
      data-tip="Tìm theo tên, username, SĐT"
    >
      <InputSearch
        v-model="searchText"
        placeholder="Tìm theo tên, username, SĐT"
      />
    </div>
    <TableList
      :columns="columns"
      :data="filteredUsers"
      :actions="true"
      @edit="goToEdit"
      @delete="deleteUser"
    />
  </div>
</template>
