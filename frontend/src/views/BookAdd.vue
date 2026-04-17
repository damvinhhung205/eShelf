<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

import PublisherService from '../services/publisher.service';
import BookService from "../services/book.service";
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { push } from 'notivue';
import { useForm, useField } from "vee-validate";
import { bookSchema } from '../validations/book.validation';

const bookService = new BookService();
const publisherService = new PublisherService();
const router = useRouter();
const role = computed(() => sessionStorage.getItem("role"));

const { handleSubmit } = useForm({
  validationSchema: bookSchema,
  initialValues: {
    title: "",
    author: "",
    price: undefined,
    publishedYear: undefined,
    quantity: undefined,
    publisherID: "",
  }
});

const { value: title, errorMessage: titleError } = useField("title");
const { value: author, errorMessage: authorError } = useField("author");
const { value: price, errorMessage: priceError } = useField("price");
const { value: publishedYear, errorMessage: publishedYearError } = useField("publishedYear");
const { value: publisherID, errorMessage: publisherIDError } = useField("publisherID");
const { value: quantity, errorMessage: quantityError } = useField("quantity");

const publishers = ref([]);

const fetchPublishers = async () => {
  try {
    const publishers_data = await publisherService.getAllPublishers();
    publishers.value = publishers_data;
  } catch (error) {
    console.log(error);
  }
};

const handleCreateBook = handleSubmit(async (values) => {
  try {
    await bookService.createBook(values);

    push.success("Thêm sách thành công");
    router.push("/books");
  } catch (error) {
    console.log(error);
    if (error.response.status === 400) {
      push.error("Vui lòng điền thông tin");
      return;
    } else {
      push.error("Đã xảy ra lỗi khi thêm sách");
    }
  }
});

onMounted(async () => {
  if (role.value !== "staff") {
    router.push("/");
  }
  fetchPublishers();
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header></Header>
    <div class="flex grow justify-center items-center">
      <form @submit.prevent=" handleCreateBook ">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 text-base">
          <legend class="fieldset-legend text-xl">Thêm mới sách</legend>
          <label class="label" for="title">Tựa sách</label>
          <input v-model=" title " type="text" class="input" id="title" placeholder="Nhập tựa sách" />
          <span class="text-sm text-red-600">{{ titleError }}</span>

          <label class="label" for="author">Tác giả</label>
          <input v-model=" author " type="text" class="input" id="author" placeholder="Nhập tác giả" />
          <span class="text-sm text-red-600">{{ authorError }}</span>

          <label class="label" for="publisher">Nhà xuất bản</label>
          <select v-model=" publisherID " class="select" id="publisher">
            <option disabled value="">Chọn nhà xuất bản</option>
            <option v-for=" publisher in publishers " :key=" publisher._id " :value=" publisher._id ">
              {{ publisher.name }}
            </option>
          </select>
          <span class="text-sm text-red-600">{{ publisherIDError }}</span>

          <label class="label" for="published_year">Năm xuất bản</label>
          <input v-model=" publishedYear " type="number" class="input" id="published_year"
            placeholder="Nhập năm xuất bản" />
          <span class="text-sm text-red-600">{{ publishedYearError }}</span>

          <label class="label" for="price">Đơn giá</label>
          <input v-model=" price " type="number" class="input" id="price" placeholder="Nhập đơn giá" />
          <span class="text-sm text-red-600">{{ priceError }}</span>

          <label class="label" for="quantity">Số lượng</label>
          <input v-model=" quantity " type="number" class="input" id="quantity" placeholder="Nhập số lượng" />
          <span class="text-sm text-red-600">{{ quantityError }}</span>

          <button type="submit"
            class="btn btn-primary mt-4 hover:scale-[1.01] hover:text-white text-base">Thêm sách</button>

          <span class="mt-4">
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