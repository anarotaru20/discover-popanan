<template>
  <div class="landing-page">
    <section class="hero">
      <div class="hero-overlay" />

      <v-container class="hero-content">
        <div class="eyebrow">Povestea locului meu</div>

        <h1>Discover PopaNan</h1>

        <p>
          Plimbă-te prin istoria ascunsă a Bucureștiului și descoperă poveștile
          care încă trăiesc pe strada Popa Nan.
        </p>

        <div class="hero-actions">
          <v-btn color="primary" size="large" rounded="xl" to="/map">
            Explorează harta
          </v-btn>

          <v-btn variant="outlined" size="large" rounded="xl" to="/tours">
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
          <div class="daily-image" :style="dailyImageStyle" />

          <div class="daily-content">
            <v-chip color="primary" variant="flat" size="small">
              {{ dailyStory?.period || "Popa Nan" }}
            </v-chip>

            <h3>
              {{
                dailyStoryStore.loading
                  ? "Se încarcă povestea..."
                  : dailyStory?.title || "Povestea zilei"
              }}
            </h3>

            <p>
              {{
                dailyStory?.fact ||
                dailyStory?.shortDescription ||
                "Descoperim astăzi un nou reper al străzii Popa Nan."
              }}
            </p>

            <v-alert
              v-if="dailyStoryStore.error"
              type="warning"
              variant="tonal"
              density="compact"
              class="mb-4"
            >
              Nu am putut încărca povestea zilei.
            </v-alert>

            <v-btn
              v-if="dailyStory?.locationSlug"
              color="primary"
              variant="tonal"
              rounded="xl"
              :to="dailyStory.link"
            >
              Descoperă povestea
            </v-btn>
          </div>
        </v-card>
      </v-container>
    </section>

    <section class="section alt-section">
      <v-container class="content-wrap">
        <div class="section-head centered">
          <span>Ce poți descoperi?</span>
          <h2>O stradă, mai multe feluri de a o citi</h2>
        </div>

        <v-row>
          <v-col
            v-for="item in discoverCards"
            :key="item.title"
            cols="12"
            md="4"
          >
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
          <div
            v-for="(step, index) in steps"
            :key="step.title"
            class="step-card"
          >
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
          <div>
            <div class="section-head">
              <span>Preview map</span>
              <h2>Pin-uri istorice, povești și trasee</h2>
            </div>

            <p class="preview-text">
              Harta interactivă grupează reperele importante ale străzii Popa
              Nan: biserica, fabricile, casele vechi și locurile care încă
              păstrează memoria cartierului.
            </p>

            <v-btn color="primary" rounded="xl" to="/map">
              Vezi harta
            </v-btn>
          </div>

          <div class="map-preview">
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
          Intră în experiență și descoperă cum o stradă obișnuită poate ascunde
          povești extraordinare.
        </p>

        <v-btn color="primary" size="large" rounded="xl" to="/map">
          Intră în experiență
        </v-btn>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useDailyStoryStore } from "@/stores/dailyStory";

const dailyStoryStore = useDailyStoryStore();
const { story: dailyStory } = storeToRefs(dailyStoryStore);

const discoverCards = [
  {
    icon: "🗺️",
    title: "Hărți interactive",
    text: "Explorează clădiri, străzi și repere istorice direct pe hartă.",
  },
  {
    icon: "🎧",
    title: "Tururi audio",
    text: "Ascultă povești scurte și atmosferice în timp ce descoperi zona.",
  },
  {
    icon: "🕰️",
    title: "Arhivă comunitară",
    text: "Vezi amintiri, contribuții și detalii trimise de oamenii locului.",
  },
];

const steps = [
  {
    title: "Alegi un traseu",
    text: "Pornești de la harta principală sau din lista de tururi tematice.",
  },
  {
    title: "Pornești explorarea",
    text: "Urmezi pin-urile și descoperi locurile importante de pe stradă.",
  },
  {
    title: "Descoperi povești",
    text: "Fiecare punct are imagini, timeline, audio și detalii istorice.",
  },
  {
    title: "Contribui",
    text: "Poți adăuga o amintire, o sursă nouă sau un mesaj pentru viitor.",
  },
];

const dailyImageStyle = computed(() => {
  const image = dailyStory.value?.image || "/images/hero-popa-nan.jpg";

  return {
    backgroundImage: `linear-gradient(to bottom, rgba(15, 15, 15, 0.1), rgba(15, 15, 15, 0.65)), url("${image}")`,
  };
});

onMounted(() => {
  dailyStoryStore.fetchDailyStory();
});
</script>

<style scoped>
.landing-page {
  background: #0f0f0f;
  color: #f5f5f5;
}

.hero {
  position: relative;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  overflow: hidden;
  background:
    linear-gradient(90deg, rgba(15, 15, 15, 0.96), rgba(15, 15, 15, 0.68)),
    radial-gradient(circle at 75% 50%, rgba(255, 138, 0, 0.28), transparent 35%),
    url("/images/hero-popa-nan.jpg");
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(15, 15, 15, 0.25), #0f0f0f),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.02) 0,
      rgba(255, 255, 255, 0.02) 1px,
      transparent 1px,
      transparent 4px
    );
  pointer-events: none;
}

.hero-content,
.content-wrap {
  position: relative;
  z-index: 1;
  max-width: 1180px;
}

.eyebrow,
.section-head span {
  color: #ff8a00;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.eyebrow {
  margin-bottom: 18px;
}

h1 {
  max-width: 760px;
  font-size: clamp(48px, 8vw, 108px);
  line-height: 0.95;
  letter-spacing: -0.07em;
  margin: 0;
  color: #f5f5f5;
}

.hero p {
  max-width: 620px;
  margin: 28px 0 0;
  font-size: clamp(18px, 2vw, 23px);
  line-height: 1.6;
  color: rgba(245, 245, 245, 0.76);
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 36px;
}

.section {
  padding: 96px 0;
}

.alt-section {
  background:
    radial-gradient(circle at top right, rgba(255, 138, 0, 0.12), transparent 34%),
    #121212;
}

.section-head {
  margin-bottom: 34px;
}

.section-head.centered {
  text-align: center;
}

.section-head h2,
.cta h2 {
  font-size: clamp(32px, 4vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.05em;
  margin: 12px 0 0;
  color: #f5f5f5;
}

.daily-card {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  overflow: hidden;
  background: #181818;
  border: 1px solid rgba(255, 138, 0, 0.18);
}

.daily-image {
  min-height: 360px;
  background-size: cover;
  background-position: center;
}

.daily-content {
  padding: clamp(28px, 5vw, 54px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 18px;
}

.daily-content h3,
.feature-card h3,
.step-card h3 {
  color: #f5f5f5;
  font-size: 26px;
  line-height: 1.15;
  margin: 0;
}

.daily-content p,
.feature-card p,
.step-card p,
.preview-text,
.cta p {
  color: rgba(245, 245, 245, 0.72);
  line-height: 1.7;
  margin: 0;
}

.feature-card {
  height: 100%;
  padding: 30px;
  background: #181818;
  border: 1px solid rgba(255, 138, 0, 0.14);
  transition: transform 0.22s ease, border-color 0.22s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 138, 0, 0.45);
}

.feature-icon {
  font-size: 42px;
  margin-bottom: 18px;
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.step-card {
  background: #181818;
  border: 1px solid rgba(255, 138, 0, 0.14);
  border-radius: 24px;
  padding: 26px;
}

.step-number {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #ff8a00;
  color: #0f0f0f;
  display: grid;
  place-items: center;
  font-weight: 900;
  margin-bottom: 22px;
}

.preview-grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 48px;
  align-items: center;
}

.map-preview {
  position: relative;
  min-height: 430px;
  border-radius: 32px;
  overflow: hidden;
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
  border: 1px solid rgba(255, 138, 0, 0.2);
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
  gap: 10px;
  color: #f5f5f5;
  font-size: 13px;
  font-weight: 700;
}

.pin span {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ff8a00;
  box-shadow: 0 0 0 10px rgba(255, 138, 0, 0.16);
  animation: pulse 1.8s infinite;
}

.pin-1 {
  left: 20%;
  top: 28%;
}

.pin-2 {
  right: 18%;
  top: 48%;
}

.pin-3 {
  left: 38%;
  bottom: 22%;
}

.cta {
  padding: 100px 0;
  text-align: center;
  background:
    radial-gradient(circle at center, rgba(255, 138, 0, 0.24), transparent 36%),
    #0f0f0f;
}

.cta-content {
  max-width: 820px;
}

.cta p {
  margin: 20px auto 34px;
  max-width: 620px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 138, 0, 0.4);
  }

  100% {
    box-shadow: 0 0 0 18px rgba(255, 138, 0, 0);
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
}

@media (max-width: 768px) {
  .hero {
    min-height: calc(100vh - 56px);
    align-items: flex-end;
    padding-bottom: 56px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .section {
    padding: 68px 0;
  }

  .steps {
    grid-template-columns: 1fr;
  }

  .daily-image,
  .map-preview {
    min-height: 280px;
  }
}
</style>