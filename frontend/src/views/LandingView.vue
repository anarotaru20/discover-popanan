<template>
  <div class="landing-page">
    <section class="hero">
      <div class="hero-overlay" />

      <v-container class="hero-content">
        <div class="eyebrow">Povestea locului meu</div>

        <h1>Descoperă Popa Nan</h1>

        <p>
          Plimbă-te prin istoria ascunsă a Bucureștiului și descoperă poveștile care încă trăiesc pe
          strada Popa Nan.
        </p>

        <div class="hero-actions">
          <v-btn class="hero-btn" color="primary" size="large" rounded="xl" to="/map">
            Explorează harta
          </v-btn>

          <v-btn variant="outlined" color="white" size="large" rounded="xl" to="/tours">
            Începe turul
          </v-btn>
        </div>
      </v-container>
    </section>

    <section class="section">
      <v-container class="content-wrap">
        <div class="section-head">
          <span>Povestea zilei</span>
          <h2>Un detaliu nou, în fiecare zi</h2>
        </div>

        <v-card class="daily-card" rounded="2xl">
          <v-skeleton-loader
            v-if="dailyStoryStore.loading"
            class="daily-skeleton"
            type="image, article"
          />

          <template v-else>
            <div class="daily-image" :style="dailyImageStyle" />

            <div class="daily-content">
              <v-chip class="daily-chip" color="primary" variant="flat" size="small">
                {{ dailyStory?.period || 'Popa Nan' }}
              </v-chip>

              <h3>{{ dailyStory?.title || 'Povestea zilei' }}</h3>

              <p>
                {{
                  dailyStory?.fact ||
                  dailyStory?.shortDescription ||
                  'Descoperim astăzi un nou reper al străzii Popa Nan.'
                }}
              </p>

              <v-alert
                v-if="dailyStoryStore.error"
                type="warning"
                variant="tonal"
                density="compact"
                class="w-100"
              >
                Nu am putut încărca povestea zilei.
              </v-alert>

              <v-btn
                v-if="dailyStory?.locationSlug"
                color="primary"
                variant="tonal"
                rounded="xl"
                :to="dailyStory.link"
                class="mobile-full"
              >
                Descoperă povestea
              </v-btn>
            </div>
          </template>
        </v-card>
      </v-container>
    </section>

    <section class="section alt-section">
      <v-container class="content-wrap">
        <div class="section-head centered">
          <span>Ce poți descoperi?</span>
          <h2>O stradă, mai multe feluri de a o citi</h2>
        </div>

        <v-row class="cards-row">
          <v-col v-for="item in discoverCards" :key="item.title" cols="12" md="4">
            <v-card class="feature-card" rounded="2xl">
              <div class="feature-icon">{{ item.icon }}</div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="section">
      <v-container class="content-wrap">
        <div class="section-head centered">
          <span>Cum funcționează?</span>
          <h2>Pornești de la hartă și ajungi la povești</h2>
        </div>

        <div class="steps">
          <div v-for="(step, index) in steps" :key="step.title" class="step-card">
            <div class="step-number">{{ index + 1 }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </div>
      </v-container>
    </section>

    <section class="section alt-section">
      <v-container class="content-wrap">
        <div class="preview-grid">
          <div class="preview-copy">
            <div class="section-head">
              <span>Harta poveștilor</span>
              <h2>Urmele trecutului pe hartă</h2>
            </div>

            <p class="preview-text">
              Explorează o hartă construită din locuri istorice, fragmente de memorie urbană și
              povești care au modelat atmosfera străzii Popa Nan.
            </p>

            <v-btn
              style="color: black; font-weight: 700"
              color="primary"
              rounded="xl"
              to="/map"
              class="mobile-full"
            >
              Vezi harta
            </v-btn>
          </div>

          <div class="map-preview">
            <div class="map-glow" />
            <div class="map-line" />

            <div class="pin pin-1">
              <span />
              <small>Biserica Popa Nan</small>
            </div>

            <div class="pin pin-2">
              <span />
              <small>Electrecord</small>
            </div>

            <div class="pin pin-3">
              <span />
              <small>Fabrica de Mătase</small>
            </div>
          </div>
        </div>
      </v-container>
    </section>

    <section class="cta">
      <v-container class="content-wrap cta-content">
        <h2>Ești pregătit să vezi Popa Nan altfel?</h2>

        <p>
          Intră în experiență și descoperă cum o stradă obișnuită poate ascunde povești
          extraordinare.
        </p>

        <v-btn
          style="color: black; font-weight: 700"
          color="primary"
          size="large"
          rounded="xl"
          to="/map"
          class="mobile-full"
        >
          Intră în experiență
        </v-btn>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useDailyStoryStore } from '@/stores/dailyStory'

const dailyStoryStore = useDailyStoryStore()
const { story: dailyStory } = storeToRefs(dailyStoryStore)

const discoverCards = [
  {
    icon: '🗺️',
    title: 'Hărți interactive',
    text: 'Explorează clădiri, străzi și repere istorice direct pe hartă.',
  },
  {
    icon: '🎧',
    title: 'Tururi audio',
    text: 'Ascultă povești scurte și atmosferice în timp ce descoperi zona.',
  },
  {
    icon: '🕰️',
    title: 'Arhivă comunitară',
    text: 'Vezi amintiri, contribuții și detalii trimise de oamenii locului.',
  },
]

const steps = [
  {
    title: 'Alegi un traseu',
    text: 'Pornești de la harta principală sau din lista de tururi tematice.',
  },
  {
    title: 'Pornești explorarea',
    text: 'Urmezi pin-urile și descoperi locurile importante de pe stradă.',
  },
  {
    title: 'Descoperi povești',
    text: 'Fiecare punct de pe hartă spune o poveste despre oamenii, clădirile și trecutul străzii.',
  },
  {
    title: 'Contribui',
    text: 'Poți lăsa o amintire, o fotografie sau o poveste care să devină parte din memoria străzii.',
  },
]

const dailyImageStyle = computed(() => {
  const image = dailyStory.value?.image || '/images/hero-popa-nan.jpg'

  return {
    backgroundImage: `linear-gradient(to bottom, rgba(15, 15, 15, 0.08), rgba(15, 15, 15, 0.72)), url("${image}")`,
  }
})

onMounted(() => {
  dailyStoryStore.fetchDailyStory()
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: #0f0f0f;
  color: #f5f5f5;
}

.hero {
  position: relative;
  min-height: calc(100svh - 64px);
  display: flex;
  align-items: center;
  overflow: hidden;
  background:
    linear-gradient(90deg, rgba(15, 15, 15, 0.9), rgba(15, 15, 15, 0.52), rgba(15, 15, 15, 0.82)),
    radial-gradient(circle at 72% 42%, rgba(255, 138, 0, 0.36), transparent 34%),
    radial-gradient(circle at 18% 72%, rgba(255, 138, 0, 0.14), transparent 28%),
    url('/images/cover2.jpg');
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(15, 15, 15, 0.08), rgba(15, 15, 15, 0.42), #0f0f0f),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.018) 0,
      rgba(255, 255, 255, 0.018) 1px,
      transparent 1px,
      transparent 4px
    );
  pointer-events: none;
}

.hero-content,
.content-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1180px;
}

.eyebrow,
.section-head span {
  color: #ff8a00;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.eyebrow {
  margin-bottom: 18px;
}

h1 {
  max-width: 980px;
  margin: 0;
  color: #f5f5f5;
  font-size: clamp(3.4rem, 6.6vw, 6.35rem);
  line-height: 0.92;
  letter-spacing: -0.07em;
  white-space: nowrap;
}

.hero p {
  max-width: 620px;
  margin: 28px 0 0;
  color: rgba(245, 245, 245, 0.76);
  font-size: clamp(1.05rem, 2vw, 1.45rem);
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 36px;
}

.hero-btn {
  min-height: 48px;
  color: #0f0f0f;
  font-weight: 700;
}

.section {
  padding: 80px 0;
}

.alt-section {
  background:
    radial-gradient(circle at top right, rgba(255, 138, 0, 0.12), transparent 34%), #121212;
}

.section-head {
  margin-bottom: 34px;
}

.section-head.centered {
  max-width: 780px;
  margin-inline: auto;
  text-align: center;
}

.section-head h2,
.cta h2 {
  margin: 12px 0 0;
  color: #f5f5f5;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.05;
  letter-spacing: -0.05em;
}

.daily-card {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  overflow: hidden;
  background: #181818;
  border: 1px solid rgba(255, 138, 0, 0.18);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
}

.daily-skeleton {
  grid-column: 1 / -1;
  background: #181818;
}

.daily-image {
  min-height: 360px;
  background-size: cover;
  background-position: center;
}

.daily-chip {
  color: #0f0f0f;
  font-weight: 700;
}

.daily-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 18px;
  padding: clamp(28px, 5vw, 54px);
}

.daily-content h3,
.feature-card h3,
.step-card h3 {
  margin: 0;
  color: #f5f5f5;
  font-size: clamp(1.25rem, 2.2vw, 1.65rem);
  line-height: 1.15;
}

.daily-content p,
.feature-card p,
.step-card p,
.preview-text,
.cta p {
  margin: 0;
  color: rgba(245, 245, 245, 0.72);
  line-height: 1.7;
}

.cards-row {
  row-gap: 18px;
}

.feature-card {
  height: 100%;
  padding: 30px;
  background: #181818;
  border: 1px solid rgba(255, 138, 0, 0.14);
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 138, 0, 0.45);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
}

.feature-icon {
  margin-bottom: 18px;
  font-size: 42px;
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.step-card {
  padding: 26px;
  background: #181818;
  border: 1px solid rgba(255, 138, 0, 0.14);
  border-radius: 24px;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease;
}

.step-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 138, 0, 0.36);
}

.step-number {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  margin-bottom: 22px;
  border-radius: 14px;
  background: #ff8a00;
  color: #0f0f0f;
  font-weight: 900;
}

.preview-grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 48px;
  align-items: center;
}

.preview-copy {
  min-width: 0;
}

.preview-text {
  max-width: 560px;
  margin-bottom: 26px;
}

.map-preview {
  position: relative;
  min-height: 430px;
  overflow: hidden;
  border: 1px solid rgba(255, 138, 0, 0.2);
  border-radius: 32px;
  background:
    linear-gradient(rgba(15, 15, 15, 0.78), rgba(15, 15, 15, 0.82)),
    radial-gradient(circle at 25% 30%, rgba(255, 138, 0, 0.28), transparent 16%),
    radial-gradient(circle at 70% 60%, rgba(255, 138, 0, 0.2), transparent 18%),
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.06) 0,
      rgba(255, 255, 255, 0.06) 1px,
      transparent 1px,
      transparent 24px
    );
  box-shadow: inset 0 0 80px rgba(0, 0, 0, 0.3);
}

.map-glow {
  position: absolute;
  inset: 18%;
  border-radius: 999px;
  background: rgba(255, 138, 0, 0.1);
  filter: blur(38px);
}

.map-line {
  position: absolute;
  width: 70%;
  height: 3px;
  left: 14%;
  top: 52%;
  background: linear-gradient(90deg, transparent, #ff8a00, transparent);
  transform: rotate(-18deg);
  opacity: 0.75;
}

.pin {
  position: absolute;
  display: flex;
  align-items: center;
  max-width: 180px;
  gap: 10px;
  color: #f5f5f5;
  font-size: 0.82rem;
  font-weight: 700;
}

.pin span {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  border-radius: 50%;
  background: #ff8a00;
  box-shadow: 0 0 0 10px rgba(255, 138, 0, 0.16);
  animation: pulse 1.8s infinite;
}

.pin small {
  padding: 6px 10px;
  border: 1px solid rgba(255, 138, 0, 0.16);
  border-radius: 999px;
  background: rgba(15, 15, 15, 0.62);
  backdrop-filter: blur(10px);
}

.pin-1 {
  left: 20%;
  top: 28%;
}

.pin-2 {
  right: 12%;
  top: 48%;
}

.pin-3 {
  left: 34%;
  bottom: 20%;
}

.cta {
  padding: 100px 0;
  text-align: center;
  background: radial-gradient(circle at center, rgba(255, 138, 0, 0.24), transparent 36%), #0f0f0f;
}

.cta-content {
  max-width: 820px;
}

.cta p {
  max-width: 620px;
  margin: 20px auto 34px;
}

.mobile-full {
  min-height: 44px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 138, 0, 0.4);
  }

  100% {
    box-shadow: 0 0 0 18px rgba(255, 138, 0, 0);
  }
}

@media (max-width: 1120px) {
  h1 {
    white-space: normal;
  }
}

@media (max-width: 960px) {
  .daily-card,
  .preview-grid {
    grid-template-columns: 1fr;
  }

  .steps {
    grid-template-columns: repeat(2, 1fr);
  }

  .map-preview {
    min-height: 360px;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: calc(100svh - 356px);
    align-items: center;
    padding: 42px 0 0px;
    background:
      linear-gradient(90deg, rgba(15, 15, 15, 0.9), rgba(15, 15, 15, 0.52), rgba(15, 15, 15, 0.82)),
      radial-gradient(circle at 72% 42%, rgba(255, 138, 0, 0.36), transparent 34%),
      radial-gradient(circle at 18% 72%, rgba(255, 138, 0, 0.14), transparent 28%),
      url('/images/cover2.jpg');
    background-size: cover;
    background-position: center;
  }

  .hero-content {
    padding-inline: 20px;
  }

  .eyebrow,
  .section-head span {
    font-size: 0.7rem;
    letter-spacing: 0.14em;
  }

  h1 {
    max-width: 360px;
    font-size: clamp(3.1rem, 16vw, 4.6rem);
    line-height: 0.94;
    white-space: normal;
  }

  .hero p {
    max-width: 100%;
    margin-top: 22px;
    font-size: 1rem;
    line-height: 1.65;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-top: 30px;
  }

  .hero-btn,
  .mobile-full {
    width: 100%;
    min-height: 48px;
  }

  .section {
    padding: 15px 0;
  }

  .section-head {
    margin-bottom: 26px;
  }

  .section-head.centered {
    text-align: left;
  }

  .section-head h2,
  .cta h2 {
    font-size: clamp(2rem, 10vw, 2.75rem);
    line-height: 1.08;
  }

  .daily-card {
    border-radius: 26px !important;
  }

  .daily-image {
    min-height: 240px;
  }

  .daily-content {
    padding: 24px;
    gap: 16px;
  }

  .feature-card,
  .step-card {
    padding: 22px;
    border-radius: 22px;
  }

  .feature-card:hover,
  .step-card:hover {
    transform: none;
  }

  .feature-icon {
    margin-bottom: 14px;
    font-size: 34px;
  }

  .steps {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .step-number {
    width: 38px;
    height: 38px;
    margin-bottom: 16px;
    border-radius: 12px;
  }

  .preview-grid {
    gap: 30px;
  }

  .preview-text {
    margin-bottom: 22px;
  }

  .map-preview {
    min-height: 300px;
    border-radius: 26px;
  }

  .map-line {
    width: 86%;
    left: 7%;
    top: 53%;
  }

  .pin {
    gap: 8px;
    font-size: 0.72rem;
  }

  .pin span {
    width: 14px;
    height: 14px;
    flex-basis: 14px;
  }

  .pin small {
    padding: 5px 8px;
    max-width: 130px;
  }

  .pin-1 {
    left: 10%;
    top: 24%;
  }

  .pin-2 {
    right: 6%;
    top: 48%;
  }

  .pin-3 {
    left: 18%;
    bottom: 18%;
  }

  .cta {
    padding: 72px 0;
  }
}

@media (max-width: 420px) {
  .hero {
    min-height: calc(100svh - 56px);
    padding: 28px 0 34px;
  }

  .hero-content {
    padding-inline: 16px;
  }

  .section {
    padding: 46px 0;
  }

  h1 {
    font-size: clamp(2.85rem, 17vw, 3.7rem);
  }

  .daily-image {
    min-height: 210px;
  }

  .map-preview {
    min-height: 270px;
  }

  .pin small {
    max-width: 112px;
    white-space: normal;
  }

  .pin-1 {
    left: 8%;
  }

  .pin-2 {
    right: 4%;
  }

  .pin-3 {
    left: 12%;
  }
}
</style>
