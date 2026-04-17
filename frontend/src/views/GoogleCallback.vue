<script setup>
import { useRoute, useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { push } from "notivue";

const route = useRoute();
const router = useRouter();

const token = route.query.token;

if (token) {
  try {
    const decoded = jwtDecode(token);
    // decoded có dạng: { id, username, role, iat, exp }
    sessionStorage.setItem('authenticateToken', token);   // key như trong auth.service
    sessionStorage.setItem('token', token);               // dự phòng
    sessionStorage.setItem('username', decoded.username);
    sessionStorage.setItem('id', decoded.id);
    sessionStorage.setItem('role', decoded.role);
    sessionStorage.setItem('user', JSON.stringify({ _id: decoded.id, username: decoded.username, role: decoded.role }));
    push.success("Đăng nhập thành công");
    router.push(decoded.role === "staff" ? "/books" : "/");
  } catch (e) {
    console.error(e);
    push.error("Đăng nhập Google thất bại");
    router.push("/login");
  }
} else {
  push.error("Không nhận được token");
  router.push("/login");
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class="text-center">Đang xử lý đăng nhập...</div>
  </div>
</template>
