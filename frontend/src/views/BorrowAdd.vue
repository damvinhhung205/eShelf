<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BookService from '../services/book.service';
import BorrowService from '../services/borrow.service';
import PublisherService from '../services/publisher.service';
import { push } from 'notivue';
import { useForm, useField } from "vee-validate";
import { borrowSchema } from '../validations/borrow.validation';

const bookService = new BookService();
const borrowService = new BorrowService();
const publisherService = new PublisherService();

const route = useRoute();
const router = useRouter();

const userID = computed(() => sessionStorage.getItem("id"));
const role = computed(() => sessionStorage.getItem("role"));
const bookID = route.params.id;
const book = ref([]);
const quantity = ref(1);

const { handleSubmit } = useForm({
  validationSchema: borrowSchema,
});

const { value: returnDate, errorMessage: returnDateError } = useField("returnDate");

const handleCreateBorrow = handleSubmit(async () => {
  // debug code
  // console.log(return_date.value);

  try {
    const data = {
      userID: userID.value,
      bookID: bookID,
      returnDate: returnDate.value,
      quantity: quantity.value
    };

    await borrowService.createBorrow(data);
    push.success("Tạo đơn mượn sách thành công");
    router.push("/books");
  } catch (error) {
    console.log(error);
    if (error.response.status === 422) {
      push.warning("Bạn đã mượn tối đa 3 quyển sách này");
    }
    else if (error.response.status === 409) {
      push.warning("Bạn chỉ có thể mượn tối đa 10 quyển sách");
    }
    else {
      push.error("Đã có lỗi xảy ra trong quá trình tạo đơn mượn");
    }
  }
});


onMounted(async () => {
  if (role.value !== "user") {
    router.push("/");
  }
  try {
    const book_data = await bookService.getBook(bookID);
    book.value = book_data;
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header></Header>
    <div class="flex grow justify-center items-center">
      <form @submit.prevent=" handleCreateBorrow ">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 text-base">
          <legend class="fieldset-legend text-xl">Thêm đơn mượn sách</legend>

          <label class="label" for="title">Tựa sách</label>
          <input type="text" class="input" id="title" readonly :value=" book.title " />

          <label class="label" for="author">Tác giả</label>
          <input type="text" class="input" id="author" readonly :value=" book.author ">

          <label class="label" for="publisher">Tên nhà xuất bản</label>
          <input type="text" class="input" id="publisher" readonly :value=" book.publisherID?.name ">

          <label class="label" for="quantity">Số quyển</label>
          <input v-model=" quantity " type="number" class="input" id="quantity" readonly value="1" />

          <label class="label" for="borrow_date">Ngày mượn</label>
          <input type="date" class="input" id="borrow_date" readonly :value=" new Date().toISOString().slice( 0, 10 ) ">

          <label class="label" for="return_date">Ngày trả sách</label>
          <input v-model=" returnDate " type="date" class="input" id="return_date" />
          <span class="text-red-600 text-sm">{{ returnDateError }}</span>

          <button type="submit" class="btn btn-primary mt-4 hover:scale-[1.01] text-base">Thêm phiếu mượn</button>

          <span class="mt-8">
            <strong class="hover:underline">
              <RouterLink to="/books" class="text-base">Quay lại</RouterLink>
            </strong>
          </span>
        </fieldset>
      </form>
    </div>
    <Footer></Footer>
  </div>
</template>