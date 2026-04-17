<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import PublisherService from '.././services/publisher.service';
import { push } from 'notivue';
import TableList from '.././components/TableList.vue';
import InputSearch from '.././components/InputSearch.vue';
import Header from '../components/Header.vue';

const router = useRouter();
const publisherService = new PublisherService();
const role = computed(() => sessionStorage.getItem("role"));

const publishers = ref([]);
const searchText = ref("");

const fetchPublishers = async () => {
  try {
    const data = await publisherService.getAllPublishers();
    publishers.value = data;
  } catch (error) {
    push.error("Lỗi tải danh sách nhà xuất bản");
  }
};

const filteredPublishers = computed(() => {
  if (!searchText.value) return publishers.value;
  const kw = searchText.value.toLowerCase();
  return publishers.value.filter(publisher =>
    publisher.name?.toLowerCase().includes(kw) ||
    publisher.address?.toLowerCase().includes(kw)
  );
});

const goToAdd = () => router.push("/publisher/add");
const goToEdit = (publisher) => router.push(`/publisher/edit/${publisher._id}`);
const deletePublisher = async (publisher) => {
  if (confirm(`Xóa nhà xuất bản "${publisher.name}"?`)) {
    try {
      await publisherService.delete(publisher._id);
      push.success("Xóa nhà xuất bản thành công");
      fetchPublishers();
    } catch (error) {
      push.error("Xóa nhà xuất bản thất bại");
    }
  }
};
const deleteAll = async () => {
  if (confirm("Xóa tất cả nhà xuất bản?")) {
    try {
      await publisherService.deleteAll();
      push.success("Xóa tất cả nhà xuất bản thành công");
      fetchPublishers();
    } catch (error) {
      push.error("Xóa tất cả thất bại");
    }
  }
};

const staffColumns = [
  { key: 'name', label: 'Tên nhà xuất bản' },
  { key: 'address', label: 'Địa chỉ' },
];

onMounted(fetchPublishers);
</script>

<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <Header></Header>
    <div class="flex justify-end items-center mb-4">
      <!-- <div class="w-full text-center"></div> -->
      <div v-if="role === 'staff'" class="flex gap-2">
        <button @click="goToAdd" class="btn btn-primary">Thêm NXB</button>
        <button @click="deleteAll" class="btn btn-error">Xóa tất cả</button>
      </div>
    </div>

    <!-- Thanh tìm kiếm -->
    <div
      class="mb-4 tooltip w-full max-w-md mx-auto flex justify-center"
      data-tip="Tên nhà xuất bản, địa chỉ"
    >
      <InputSearch
        v-model="searchText"
        placeholder="Tên nhà xuất bản, địa chỉ"
      />
    </div>

    <!-- Staff view: table -->
    <div v-if="role === 'staff'">
      <TableList :columns="staffColumns" :data="filteredPublishers" :actions="true" @edit="goToEdit" @delete="deletePublisher" />
    </div>
  </div>
</template>