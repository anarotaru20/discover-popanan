<template>
  <v-app>
    <Navbar />

    <v-main>
      <RouterView />
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup>
import Navbar from "@/components/layout/Navbar.vue";
import Footer from "@/components/layout/Footer.vue";
</script>