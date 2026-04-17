<template>
  <div class="flex flex-col min-h-screen transition-all">
    <Header></Header>
    <div class="hero grow bg-[url(/images/t2_sach_2.jpg)] transition-all duration-300">
      <div class=" hero-overlay backdrop-brightness-60 backdrop-blur-xs"></div>
      <div class="hero-content text-neutral-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold"> eShelf <br /> Kệ sách điện tử</h1>
          <p class="text-2xl my-8">
            Kết nối dễ dàng với kho tàng kiến thức.
          </p>
          <RouterLink to="/books" class="shadow font-bold text-base btn btn-lg hover:underline hover:shadow-md">Truy
            cập
          </RouterLink>

        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
</script>