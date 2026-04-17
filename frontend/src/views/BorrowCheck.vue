<script setup>
import { ref, onMounted, computed } from "vue";
import BorrowService from ".././services/borrow.service";
import { push } from "notivue";
import InputSearch from ".././components/InputSearch.vue";
import Header from "../components/Header.vue";
import TableList from "../components/TableList.vue";

const borrowService = new BorrowService();
const borrows = ref([]);
const searchText = ref("");
const userId = sessionStorage.getItem("id");

const fetchBorrows = async () => {
  try {
    let all = await borrowService.getAllBorrows();
    let myBorrows = all.filter(b => b.userID?._id === userId);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let updated = false;
    for (const b of myBorrows) {
      const returnDate = new Date(b.returnDate);
      returnDate.setHours(0, 0, 0, 0);
      if (now > returnDate && !["returned", "rejected", "return_overdue"].includes(b.status)) {
        await borrowService.updateBorrow(b._id, { status: "overdue" });
        updated = true;
      }
    }
    if (updated) {
      all = await borrowService.getAllBorrows();
      myBorrows = all.filter(b => b.userID?._id === userId);
    }
    borrows.value = myBorrows;
  } catch (error) {
    console.error(error);
    push.error("Lỗi tải đơn mượn");
  }
};

const filteredMyBorrows = computed(() => {
  let list = borrows.value;
  if (searchText.value) {
    const kw = searchText.value.toLowerCase();
    list = list.filter((b) => b.bookID?.title?.toLowerCase().includes(kw));
  }
  return list;
});

const returnBook = async (borrow) => {
  try {
    await borrowService.updateBorrow(borrow._id, { status: "return_pending" });
    push.info("Yêu cầu trả sách đã gửi");
    fetchBorrows();
  } catch (error) {
    push.error("Yêu cầu trả thất bại");
  }
};

const columns = [
  { key: "bookID", label: "Sách", type: "object", field: "title" },
  { key: "borrowDate", label: "Ngày mượn", type: "date" },
  { key: "returnDate", label: "Ngày trả", type: "date" },
  { key: "status", label: "Trạng thái" },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return "badge-warning";
    case "borrowing":
      return "badge-info";
    case "return_pending":
      return "badge-warning";
    case "returned":
      return "badge-success";
    case "rejected":
      return "badge-error";
    case "overdue":
      return "badge-error";
    case "return_overdue":
      return "badge-success"
    default:
      return "";
  }
};

const getStatus = (status) => {
  switch (status) {
    case "pending":
      return "Chờ duyệt";
    case "return_pending":
      return "Chờ duyệt trả";
    case "borrowing":
      return "Đang mượn";
    case "returned":
      return "Đã trả";
    case "rejected":
      return "Từ chối";
    case "overdue":
      return "Quá hạn";
    case "return_overdue":
      return "Đã trả (quá hạn)"
    default:
      return "";
  }
};

onMounted(fetchBorrows);
</script>

<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <Header></Header>
    <div class="flex justify-between items-center mb-4"></div>
    <div
      class="mb-4 tooltip w-full max-w-md mx-auto flex justify-center"
      data-tip="Tìm theo tên sách"
    >
      <InputSearch
        v-model="searchText"
        placeholder="Tìm theo tên sách"
      />
    </div>
    <TableList :columns="columns" :data="filteredMyBorrows" :actions="true" :hide-default-actions="true">
      <template #status="{ row }">
        <span
          v-if="row && row.status"
          :class="['badge', getStatusBadge(row.status)]"
        >
          {{ getStatus(row.status) }}
        </span>
        <span v-else class="badge">N/A</span>
      </template>
      <template #actions="{ row }">
          <button
            v-if="row.status === 'borrowing' || row.status === 'overdue'"
            @click="returnBook(row)"
            class="btn btn-xs btn-primary"
          >
            Trả sách
          </button>
        </template>
    </TableList>
  </div>
</template>
