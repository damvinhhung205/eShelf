<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <Header></Header>
    <div class="flex justify-end items-center mb-4">
      <!-- <div class="w-full text-center"></div> -->
      <div v-if="role === 'staff'" class="flex gap-2">
        <button @click="goToAdd" class="btn btn-primary">Thêm sách</button>
        <button @click="deleteAll" class="btn btn-error">Xóa tất cả</button>
      </div>
    </div>

    <!-- Thanh tìm kiếm -->
    <div
      class="mb-4 tooltip w-full max-w-md mx-auto flex justify-center"
      data-tip="Tựa sách, tác giả, năm xuất bản"
    >
      <InputSearch
        v-model="searchText"
        placeholder="Tìm theo tên, tác giả, năm xuất bản"
      />
    </div>

    <!-- Staff view: table (không phân trang) -->
    <template v-if="role === 'staff'">
      <TableList
        :columns="staffColumns"
        :data="filteredBooks"
        :actions="true"
        @edit="goToEdit"
        @delete="deleteBook"
      />
    </template>

    <!-- User view: cards + phân trang -->
    <template v-else>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
      >
        <BookCard
          v-for="book in paginatedBooks"
          :key="book._id"
          :book="book"
          class="card card-sm bg-base-100 shadow-xl"
        >
          
        </BookCard>
      </div>
      <!-- Phân trang user -->
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:current-page="currentPage = $event"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import BookService from "../services/book.service";
import { push } from "notivue";
import TableList from "../components/TableList.vue";
import InputSearch from "../components/InputSearch.vue";
import Header from "../components/Header.vue";
import Pagination from "../components/Pagination.vue";
import BookCard from "../components/BookCard.vue";

const router = useRouter();
const bookService = new BookService();
const role = computed(() => sessionStorage.getItem("role"));

const books = ref([]);
const searchText = ref("");
const currentPage = ref(1);
const pageSize = 12;

const fetchBooks = async () => {
  try {
    const data = await bookService.getAllBooks();
    books.value = data;
    currentPage.value = 1;
  } catch (error) {
    push.error("Lỗi tải danh sách sách");
  }
};

// Lọc theo searchText
const filteredBooks = computed(() => {
  if (!searchText.value) return books.value;
  const kw = searchText.value.toLowerCase();
  return books.value.filter(
    (book) =>
      book.title?.toLowerCase().includes(kw) ||
      book.author?.toLowerCase().includes(kw) ||
      book.publishedYear?.toString().includes(kw),
  );
});

// Phân trang cho user
const totalPages = computed(() =>
  Math.ceil(filteredBooks.value.length / pageSize),
);
const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredBooks.value.slice(start, end);
});

// Reset trang khi tìm kiếm
watch(searchText, () => {
  currentPage.value = 1;
});

const goToAdd = () => router.push("/book/add");
const goToEdit = (book) => router.push(`/book/edit/${book._id}`);
const deleteBook = async (book) => {
  if (confirm(`Xóa sách "${book.title}"?`)) {
    try {
      await bookService.delete(book._id);
      push.success("Xóa sách thành công");
      fetchBooks();
    } catch (error) {
      push.error("Xóa sách thất bại");
    }
  }
};
const deleteAll = async () => {
  if (confirm("Xóa tất cả sách?")) {
    try {
      await bookService.deleteAll();
      push.success("Xóa tất cả sách thành công");
      fetchBooks();
    } catch (error) {
      push.error("Xóa tất cả thất bại");
    }
  }
};

const staffColumns = [
  { key: "title", label: "Tên sách" },
  { key: "author", label: "Tác giả" },
  { key: "publishedYear", label: "Năm xuất bản" },
  { key: "publisherID", label: "Nhà xuất bản", type: "object", field: "name" },
  { key: "price", label: "Đơn giá", type: "currency" },
  { key: "quantity", label: "Số lượng" },
];

onMounted(fetchBooks);
</script>
