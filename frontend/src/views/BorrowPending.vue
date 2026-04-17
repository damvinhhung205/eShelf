<script setup>
import { ref, onMounted, computed } from "vue";
import BorrowService from "../services/borrow.service";
import BookService from "../services/book.service";
import { push } from "notivue";
import TableList from "../components/TableList.vue";
import InputSearch from "../components/InputSearch.vue";
import Header from "../components/Header.vue";

const borrowService = new BorrowService();
const bookService = new BookService();
const borrows = ref([]);
const searchText = ref("");
const staffId = sessionStorage.getItem("id");

const fetchBorrows = async () => {
  try {
    let data = await borrowService.getAllBorrows();
    console.log("Fetched borrows:", data);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let updated = false;
    for (const b of data) {
      const returnDate = new Date(b.returnDate);
      returnDate.setHours(0, 0, 0, 0);
      if (now > returnDate && !["returned", "rejected", "return_overdue"].includes(b.status)) {
        await borrowService.updateBorrow(b._id, { status: "overdue" });
        updated = true;
      }
    }
    if (updated) {
      data = await borrowService.getAllBorrows();
    }
    borrows.value = data;
  } catch (error) {
    console.error(error);
    push.error("Lỗi tải đơn mượn");
  }
};

const filteredBorrows = computed(() => {
  if (!searchText.value) return borrows.value;
  const kw = searchText.value.toLowerCase();
  return borrows.value.filter(
    (b) =>
      b.bookID?.title?.toLowerCase().includes(kw) ||
      b.userID?.username?.toLowerCase().includes(kw) ||
      b.userID?.firstName?.toLowerCase().includes(kw) ||
      b.staffID?.fullName?.toLowerCase().includes(kw),
  );
});

const approve = async (borrow) => {
  try {
    if (borrow.status === "pending") {
      // check quantity
      const book = await bookService.getBook(borrow.bookID._id);
      if (book.quantity <= 0) {
        push.error("Sách đã hết, không thể duyệt");
        return;
      }
      await borrowService.updateBorrow(borrow._id, {
        staffID: staffId,
        status: "borrowing",
      });
      await bookService.updateBook(book._id, { quantity: book.quantity - 1 });
      push.success("Duyệt mượn thành công");
    } else if (borrow.status === "return_pending") {
      await borrowService.updateBorrow(borrow._id, {
        staffID: staffId,
        status: "returned",
      });
      const book = await bookService.getBook(borrow.bookID._id);
      await bookService.updateBook(book._id, { quantity: book.quantity + 1 });
      push.success("Duyệt trả thành công");
    } else if (borrow.status === "overdue") {
      await borrowService.updateBorrow(borrow._id, {
        staffID: staffId,
        status: "return_overdue",
      });
      const book = await bookService.getBook(borrow.bookID._id);
      await bookService.updateBook(book._id, { quantity: book.quantity + 1 });
      push.success("Duyệt trả thành công");
    }
    fetchBorrows();
  } catch (error) {
    push.error("Thao tác thất bại");
  }
};

const reject = async (borrow) => {
  try {
    await borrowService.updateBorrow(borrow._id, {
      staffID: staffId,
      status: "rejected",
    });
    push.success("Từ chối thành công");
    fetchBorrows();
  } catch (error) {
    push.error("Từ chối thất bại");
  }
};

const columns = [
  { key: "userID", label: "Người mượn" },
  { key: "bookID", label: "Sách", type: "object", field: "title" },
  { key: "borrowDate", label: "Ngày mượn", type: "date" },
  { key: "returnDate", label: "Ngày trả", type: "date" },
  { key: "status", label: "Trạng thái" },
  { key: "staffID", label: "NV duyệt", type: "object", field: "fullName" },
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
      data-tip="Tìm theo tên sách, người mượn, nhân viên duyệt"
    >
      <InputSearch
        v-model="searchText"
        placeholder="Tìm theo tên sách, người mượn, nhân viên duyệt"
      />
    </div>
    <div v-if="filteredBorrows.length === 0" class="text-center py-8">
      Không có đơn mượn nào.
    </div>
    <TableList :columns="columns" :data="filteredBorrows" :actions="true" :hide-default-actions="true">
      <template #userID="{ row }">
        <span v-if="row.userID">
          {{ row.userID?.lastName || "" }} {{ row.userID?.firstName || "" }} ({{
            row.userID?.username || "N/A"
          }})
        </span>
        <span v-else>Người dùng đã bị xóa</span>
      </template>
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
          v-if="row.status === 'pending'"
          @click="approve(row)"
          class="btn btn-xs btn-success mr-1"
        >
          Duyệt
        </button>
        <button
          v-if="row.status === 'return_pending'|| row.status === 'overdue'"
          @click="approve(row)"
          class="btn btn-xs btn-success mr-1"
        >
          Duyệt trả
        </button>
        <button
          v-if="row.status === 'pending'"
          @click="reject(row)"
          class="btn btn-xs btn-error"
        >
          Từ chối
        </button>
      </template>
    </TableList>
  </div>
</template>
