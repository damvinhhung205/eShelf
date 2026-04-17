<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

import PublisherService from '../services/publisher.service';
import BookService from "../services/book.service";
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { push } from 'notivue';
import { useForm, useField } from "vee-validate";
import { bookSchema } from '../validations/book.validation';

const bookService = new BookService();
const publisherService = new PublisherService();
const router = useRouter();
const route = useRoute();
const publishers = ref([]);
const book = ref({});

const bookID = route.params.id;
const role = computed(() => sessionStorage.getItem("role"));

const { handleSubmit, resetForm } = useForm({
    validationSchema: bookSchema,
});

const { value: title, errorMessage: titleError } = useField("title");
const { value: author, errorMessage: authorError } = useField("author");
const { value: price, errorMessage: priceError } = useField("price");
const { value: publishedYear, errorMessage: publishedYearError } = useField("publishedYear");
const { value: publisherID, errorMessage: publisherIDError } = useField("publisherID");
const { value: quantity, errorMessage: quantityError } = useField("quantity");

const fetchBook = async () => {
    try {
        const book_data = await bookService.getBook(bookID);
        resetForm({
            values: {
                title: book_data.title,
                author: book_data.author,
                price: book_data.price,
                publishedYear: book_data.publishedYear,
                publisherID: book_data.publisherID?._id,
                quantity: book_data.quantity
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const fetchPublishers = async () => {
    try {
        const publishers_data = await publisherService.getAllPublishers();
        publishers.value = publishers_data;
    } catch (error) {
        console.log(error);
    }
};


const handleUpdateBook = handleSubmit(async (values) => {
    try {
        await bookService.updateBook(bookID, values);

        push.success("Cập nhật sách thành công");
        router.push("/books");
    } catch (error) {
        console.log(error);
        push.error("Đã xảy ra lỗi khi cập nhật sách");
    }
});

const handleDeleteBook = async (bookID) => {
    try {
        if (confirm("Xác nhận xóa sách?")) {
            await bookService.deleteBook(bookID);
            push.success("Xóa sách thành công");
            router.push("/books");
        }
    } catch (error) {
        console.log(error);
        push.error("Đã xảy ra lỗi khi xóa sách");
    }
};

onMounted(async () => {
    if (role.value !== "staff") {
        router.push("/");
    }
    fetchBook();
    fetchPublishers();
});
</script>

<template>
    <div class="flex flex-col min-h-screen">
        <Header></Header>
        <div class="flex grow justify-center items-center">
            <form @submit.prevent>
                <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 text-base">
                    <legend class="fieldset-legend text-xl">Cập nhật sách</legend>
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
                    <input v-model=" publishedYear " type="number" class="input" id="published_year" placeholder="Nhập năm xuất bản" />
                    <span class="text-sm text-red-600">{{ publishedYearError }}</span>

                    <label class="label" for="price">Đơn giá</label>
                    <input v-model=" price " type="number" class="input" id="price" placeholder="Nhập đơn giá" />
                    <span class="text-sm text-red-600">{{ priceError }}</span>

                    <label class="label" for="quantity">Số lượng</label>
                    <input v-model=" quantity " type="number" class="input" id="quantity" placeholder="Nhập số lượng" />
                    <span class="text-sm text-red-600">{{ quantityError }}</span>

                    <div class="grid grid-cols-2 gap-2">
                        <button @click="handleUpdateBook( bookID )"
                            class="btn btn-primary mt-4 hover:scale-[1.01] text-base">Cập
                            nhật</button>
                        <button class="btn btn-error mt-4 hover:scale-[1.01] text-base"
                            @click=" handleDeleteBook( bookID )">Xóa</button>
                    </div>

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