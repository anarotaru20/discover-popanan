<template>
  <v-app-bar class="navbar" elevation="0">
    <v-container class="nav-container">
      <RouterLink to="/" class="brand">
        <span class="brand-mark">D</span>
        <span>Discover PopaNan</span>
      </RouterLink>

      <div class="nav-links desktop-links">
        <RouterLink to="/map">Hartă</RouterLink>
        <RouterLink to="/tours">Tururi</RouterLink>
        <RouterLink to="/about">Despre noi</RouterLink>
      </div>

      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            variant="text"
            class="mobile-menu"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list bg-color="#181818">
          <v-list-item to="/map" title="Hartă" />
          <v-list-item to="/tours" title="Tururi" />
          <v-list-item to="/about" title="Despre noi" />
        </v-list>
      </v-menu>
    </v-container>
  </v-app-bar>
</template>

<style scoped>
.navbar {
  background: rgba(15, 15, 15, 0.82) !important;
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 138, 0, 0.18);
}

.nav-container {
  max-width: 1180px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  color: #f5f5f5;
  text-decoration: none;
  font-weight: 800;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #ff8a00;
  color: #0f0f0f;
  display: grid;
  place-items: center;
  font-weight: 900;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-links a {
  color: rgba(245, 245, 245, 0.78);
  text-decoration: none;
  font-weight: 600;
  transition: 0.2s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #ff8a00;
}

.mobile-menu {
  display: none;
}

@media (max-width: 768px) {
  .desktop-links {
    display: none;
  }

  .mobile-menu {
    display: inline-flex;
  }
}
</style>