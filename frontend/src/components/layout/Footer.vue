<template>
  <footer class="footer">
    <v-container class="footer-container">
      <div>
        <strong>Descoperă Popa Nan</strong>
        <p> O arhivă digitală dedicată memoriei urbane, poveștilor și locurilor care
          păstrează spiritul străzii Popa Nan.</p>
      </div>

      <span>© 2026 Memoria Popa Nan</span>
    </v-container>
  </footer>
</template>

<style scoped>
.footer {
  background: #0f0f0f;
  border-top: 1px solid rgba(255, 138, 0, 0.16);
  padding: 28px 0;
  color: rgba(245, 245, 245, 0.7);
}

.footer-container {
  max-width: 1180px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

strong {
  color: #f5f5f5;
}

p {
  margin: 6px 0 0;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
  }
}
</style>