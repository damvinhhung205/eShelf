<script setup>
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import PublisherService from "../services/publisher.service";
import BookService from "../services/book.service";
import { push } from "notivue";

const role = computed(() => sessionStorage.getItem("role"));
const router = useRouter();
const publisherService = new PublisherService();
const bookService = new BookService();

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
});

const loading = ref(true);
const title = ref("");

const goToBorrowBook = (bookID) => {
  if (props.book?.quantity <= 0) {
    push.error("Không thể mượn sách do sách đã hết");
  } else {
    router.push(`/borrow/add/${props.book._id}`);
  }
};

const goToEditBook = (bookID) => {
  router.push({ name: "book.edit", params: { id: bookID } });
};

const formatPrice = (price) => (price ? price.toLocaleString() + "đ" : "0đ");
</script>

<template>
    <div class="card-body flex flex-col h-full shadow rounded-lg overflow-hidden hover:shadow-lg hover:scale-[1.001] transition">
      <figure>
        <img
          :src="`https://picsum.photos/seed/${book._id + book.title}/300/200`"
          :alt="book.title"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">{{ book.title }}</h2>
        <p>Tác giả: {{ book.author }}</p>
        <p>Nhà xuất bản: {{ book.publisherID?.name || "Không xác định" }}</p>
        <p>Năm xuất bản: {{ book.publishedYear }}</p>
        <p>Giá: {{ formatPrice(book.price) }}</p>
        <p>Số lượng: {{ book.quantity }}</p>
        <div class="card-actions justify-end">
          <button
            @click="goToBorrowBook"
            class="btn btn-primary"
            :disabled="book.quantity <= 0"
          >
            Mượn
          </button>
        </div>
      </div>
    </div>
</template>
