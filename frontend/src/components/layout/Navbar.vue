<template>
  <v-app-bar class="navbar" elevation="0">
    <v-container class="nav-container">
      <RouterLink to="/" class="brand">
        <div class="brand-mark">
          <img src="/images/pin.svg" alt="Pin" class="brand-icon" />
        </div>
        <span>Descoperă Popa Nan</span>
      </RouterLink>

      <div class="nav-links desktop-links">
        <RouterLink to="/sights">Obiective</RouterLink>
        <RouterLink to="/map">Hartă</RouterLink>
        <RouterLink to="/tours">Tururi</RouterLink>
        <RouterLink to="/contributions">Arhiva comunitară</RouterLink>
        <RouterLink to="/about">Despre noi</RouterLink>

        <div id="google_translate_element" class="translate-desktop"></div>
      </div>

      <div class="mobile-actions">
        <div id="google_translate_element_mobile" class="translate-mobile"></div>

        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" class="mobile-menu">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>

          <v-list bg-color="#181818">
            <v-list-item to="/sights" title="Obiective" />
            <v-list-item to="/map" title="Hartă" />
            <v-list-item to="/tours" title="Tururi" />
            <v-list-item to="/contributions" title="Arhiva comunitară" />
            <v-list-item to="/about" title="Despre noi" />
          </v-list>
        </v-menu>
      </div>
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
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #ff8a00;
  color: #0f0f0f;
  display: grid;
  place-items: center;
  font-weight: 900;
}

.nav-links {
  display: flex;
  align-items: center;
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

.brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon {
  width: 34px;
  height: 34px;
  display: block;
}

.mobile-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.translate-mobile {
  display: none;
}

:deep(.goog-te-gadget) {
  color: transparent !important;
  font-size: 0 !important;
}

:deep(.goog-te-gadget .goog-te-combo) {
  background: #181818;
  color: #f5f5f5;
  border: 1px solid rgba(255, 138, 0, 0.3);
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 13px;
  outline: none;
}

:deep(.goog-logo-link),
:deep(.goog-te-gadget span) {
  display: none !important;
}

:deep(.goog-te-banner-frame) {
  display: none !important;
}

body {
  top: 0 !important;
}

@media (max-width: 768px) {
  .desktop-links {
    display: none;
  }

  .mobile-menu {
    display: inline-flex;
  }

  .translate-mobile {
    display: block;
  }

  .translate-desktop {
    display: none;
  }
}
</style>