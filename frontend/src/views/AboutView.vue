<template>
  <main class="about-page">
    <section class="about-hero">
      <div class="hero-glow hero-glow-one"></div>
      <div class="hero-glow hero-glow-two"></div>

      <v-container class="content-wrap">
        <div class="hero-content">
          <p class="eyebrow">Despre proiect</p>

          <h1>Descoperă Popa Nan</h1>

          <p class="hero-subtitle">
            O experiență digitală dedicată uneia dintre străzile ascunse ale Bucureștiului. Prin
            povești, imagini, hărți și locuri reale, aplicația reconstruiește memoria unei zone care
            a trecut prin generații, transformări și contraste urbane.
          </p>

          <div class="motto-card">
            <span class="motto-title">Motto</span>
            <blockquote style="text-align: center">
              „Orașul nu dispare niciodată.
              <br />Se ascunde în clădiri, străzi, amintiri și povești uitate.”
            </blockquote>
          </div>
        </div>
      </v-container>
    </section>

    <section class="story-section">
      <v-container class="content-wrap">
        <div class="section-header">
          <p class="eyebrow">Cine suntem</p>
          <h2>O echipă care caută trecutul prin tehnologie</h2>
        </div>

        <div class="story-grid">
          <article class="glass-card large-card">
            <h3>Istoria urbană spusă digital</h3>

            <p style="text-align: justify">
              Descoperă Popa Nan este un proiect care redă vocea unui București ascuns printre
              fațade, curți vechi și urmele timpului. Prin imagini, povești și fragmente de memorie
              urbană, aplicația transformă strada Popa Nan într-o experiență care poate fi explorată
              pas cu pas.
            </p>

            <p style="text-align: justify">
              Fiecare loc păstrează ceva din trecut — o arhitectură uitată, o atmosferă veche sau o
              poveste rămasă între ziduri. Proiectul îmbină documentarea urbană cu tehnologia pentru
              a aduce aceste detalii mai aproape de oameni.
            </p>

            <p style="text-align: justify">
              Scopul aplicației nu este doar informarea, ci păstrarea unei memorii urbane care riscă
              să se piardă printre clădiri moderne, străzi aglomerate și ritmul grăbit al orașului.
              Descoperă Popa Nan încearcă să readucă în lumină fragmente din trecut și să transforme
              explorarea Bucureștiului într-o experiență personală, vie și apropiată de oameni.
            </p>
          </article>

          <article class="quote-card">
            <span>Ideea principală</span>
            <h3 style="font-size: 1.85rem">Orașul devine viu atunci când îi descoperi poveștile.</h3>
            <p style="text-align: justify">
              Descoperă Popa Nan transformă explorarea urbană într-o experiență vizuală și
              interactivă.
              <br />
              Prin hărți, imagini și elemente multimedia, aplicația reconstruiește atmosfera unei
              străzi care încă păstrează memoria Bucureștiului de altădată.
            </p>
          </article>
        </div>
      </v-container>
    </section>

    <section class="why-section">
      <v-container class="content-wrap">
        <div class="section-header centered">
          <p class="eyebrow">De ce Popa Nan?</p>
          <h2>O stradă mică, dar cu o memorie mare</h2>
          <p>
            Strada Popa Nan păstrează urme ale Bucureștiului de altădată — între arhitectură veche,
            transformări urbane și povești uitate. Deși discretă, zona ascunde o identitate
            puternică și o atmosferă care merită redescoperită.
          </p>
        </div>

        <div class="text-columns">
          <article>
            <h3>Între trecut și orașul modern</h3>
            <p style="text-align: justify">
              Strada Popa Nan păstrează încă fragmente din Bucureștiul vechi, chiar dacă orașul din
              jurul ei s-a schimbat constant de-a lungul timpului. În zonă pot fi observate case
              construite în stiluri diferite, curți ascunse, clădiri cu detalii arhitecturale vechi
              și urme ale unei atmosfere urbane care contrastează puternic cu ritmul modern al
              capitalei. Fiecare clădire și fiecare stradă laterală reflectă o parte din evoluția
              orașului și felul în care acesta s-a adaptat noilor perioade istorice.
            </p>
            <p style="text-align: justify">
              În același timp, Popa Nan nu este doar o zonă legată de trecut. Strada continuă să fie
              parte activă din Bucureștiul actual, unde spațiile istorice coexistă cu elemente
              moderne, trafic urban și schimbări continue. Tocmai acest contrast dintre memoria
              locului și prezentul orașului transformă zona într-un spațiu interesant de explorat și
              documentat, în care trecutul poate fi observat direct în peisajul urban de astăzi.
            </p>
          </article>

          <article>
            <h3>Un loc care încă păstrează memorie</h3>
            <p style="text-align: justify">
              Multe dintre poveștile străzii Popa Nan nu mai sunt vizibile la prima vedere. Unele
              clădiri și-au schimbat rolul, alte locuri au fost renovate sau transformate, iar
              anumite detalii au rămas ascunse în spatele fațadelor actuale. Cu toate acestea, zona
              continuă să păstreze o identitate aparte, construită din fragmente de istorie,
              arhitectură și amintiri urbane care încă fac parte din atmosfera locului.
            </p>
            <p style="text-align: justify">
              Prin această aplicație, strada este privită nu doar ca un spațiu de tranzit, ci ca un
              loc care poate fi redescoperit prin observație și context. Hărțile, imaginile și
              informațiile integrate în proiect încearcă să reconstruiască legătura dintre trecut și
              prezent, oferind utilizatorului posibilitatea de a înțelege mai bine transformările
              zonei și poveștile care au contribuit la identitatea ei actuală.
            </p>
          </article>
        </div>
      </v-container>
    </section>

    <section class="process-section">
      <v-container class="content-wrap">
        <div class="section-header">
          <p class="eyebrow">Proces de cercetare</p>
          <h2>Cum am reconstruit povestea stăzii</h2>
        </div>

        <div class="timeline">
          <article v-for="step in researchSteps" :key="step.title" class="timeline-card">
            <span>{{ step.number }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </article>
        </div>
      </v-container>
    </section>

    <section class="sources-section">
      <v-container class="content-wrap">
        <div class="section-header centered">
          <p class="eyebrow">Surse și documentare</p>
          <h2>Memoria orașului din mai multe perspective</h2>
          <p>
            Proiectul combină informații istorice, observație directă, fotografii de teren, hărți
            vechi și materiale disponibile public.
          </p>
        </div>

        <div class="sources-grid">
          <article v-for="source in sources" :key="source.title" class="source-card">
            <div class="source-icon">{{ source.icon }}</div>
            <h3>{{ source.title }}</h3>
            <p>{{ source.description }}</p>
          </article>
        </div>
      </v-container>
    </section>

    <section class="field-section">
      <v-container class="content-wrap">
        <div class="field-content">
          <div>
            <p class="eyebrow">Poze de teren</p>
            <h2 style="text-align: center">„Orașul se descoperă la pas”</h2>
            <p style="text-align: justify">
              O parte importantă a proiectului a fost observarea directă a zonei. Fotografiile de
              teren ajută la înțelegerea stării actuale a obiectivelor, a detaliilor arhitecturale
              și a felului în care trecutul este încă vizibil în prezent.
            </p>
            <p style="text-align: justify">
              Prin pozele realizate la fața locului, aplicația păstrează o legătură reală cu spațiul
              urban. Nu este doar o prezentare teoretică, ci o explorare ancorată în locuri
              existente, în texturi, fațade, porți, străzi și repere concrete.
            </p>
          </div>

          <div class="photo-grid">
            <div class="photo-placeholder big">
              <img src="/images/teren/teren1.jpg" alt="Foto teren 1" />
            </div>
            <div class="photo-placeholder">
              <img src="/images/teren/teren2.jpg" alt="Foto teren 2" />
            </div>
            <div class="photo-placeholder">
              <img src="/images/teren/teren3.jpg" alt="Foto teren 3" />
            </div>
          </div>
        </div>
      </v-container>
    </section>

    <section class="team-section">
      <v-container class="content-wrap">
        <div class="section-header centered">
          <p class="eyebrow">Echipă</p>
          <h2>Roluri în proiect</h2>
          <p>
            Proiectul a fost organizat pe mai multe direcții: cercetare, conținut, design,
            dezvoltare frontend, backend și integrare cu hărți interactive.
          </p>
        </div>

        <div class="roles-grid">
          <article v-for="role in roles" :key="role.title" class="role-card">
            <span>{{ role.icon }}</span>
            <h3>{{ role.title }}</h3>
            <p>{{ role.description }}</p>
          </article>
        </div>
      </v-container>
    </section>

    <section class="ai-section">
      <v-container class="content-wrap">
        <div class="ai-card">
          <div>
            <p class="eyebrow">AI în proiect</p>
            <h2>Cum am folosit inteligența artificială</h2>
          </div>

          <div class="ai-text">
            <p>
              Inteligența artificială a fost utilizată ca instrument de sprijin în organizarea
              informațiilor, structurarea conținutului și rafinarea componentelor vizuale și
              tehnice.
            </p>

            <p>
              AI-ul a contribuit la generarea unor idei de design, optimizarea textelor și asistarea
              procesului de dezvoltare frontend, fără a înlocui cercetarea sau procesul creativ al
              proiectului.
            </p>

            <p>
              Toate informațiile și materialele finale au fost selectate, adaptate și verificate în
              contextul aplicației
            </p>
          </div>
        </div>
      </v-container>
    </section>

    <section class="closing-section">
      <v-container class="content-wrap">
        <div class="closing-card">
          <p class="eyebrow">Concluzie</p>
          <h2>Descoperă Popa Nan este o invitație la redescoperirea orașului.</h2>
          <p>
            Aplicația propune o altă modalitate de a privi Bucureștiul — nu doar ca spațiu urban, ci
            ca o colecție de povești, urme și memorii ascunse în străzi și clădiri. Prin explorare
            digitală și documentare urbană, strada Popa Nan devine un traseu al trecutului
            reinterpretat pentru prezent.
          </p>
        </div>
      </v-container>
    </section>
  </main>
</template>

<script setup>
const researchSteps = [
  {
    number: '01',
    title: 'Explorarea zonei',
    description:
      'Am ales strada Popa Nan pentru identitatea sa urbană și pentru contrastul dintre trecut și prezent.',
  },
  {
    number: '02',
    title: 'Documentare',
    description:
      'Au fost analizate surse istorice, hărți, fotografii și informații despre evoluția zonei.',
  },
  {
    number: '03',
    title: 'Observație pe teren',
    description:
      'Locurile au fost fotografiate și analizate pentru a surprinde atmosfera actuală și detaliile autentice. De asemenea au fost realizate interviuri cu localnici din diferite categorii de vârstă, pentru a surprinde evoluția străzii Popa Nan de-a lungul timpului.',
  },
  {
    number: '04',
    title: 'Organizarea poveștii',
    description:
      'Informațiile au fost transformate într-o experiență digitală structurată în obiective, tururi și povești interactive.',
  },
  {
    number: '05',
    title: 'Dezvoltarea aplicației',
    description:
      'Conținutul a fost integrat într-o aplicație web modernă, construită pentru explorare vizuală și interactivă.',
  },
]

const sources = [
  {
    icon: '🏛️',
    title: 'Muzee și arhive',
    description:
      'Surse istorice, materiale documentare și referințe culturale care ajută la contextualizarea obiectivelor.',
  },
  {
    icon: '🗺️',
    title: 'Hărți istorice',
    description:
      'Hărți vechi în format digital, folosite pentru a compara traseul actual al străzilor cu reprezentări istorice.',
  },
  {
    icon: '📷',
    title: 'Fotografii de teren',
    description:
      'Imagini realizate în zonă pentru documentarea stării actuale a obiectivelor și a atmosferei urbane.',
  },
  {
    icon: '📚',
    title: 'Surse bibliografice',
    description:
      'Informații despre patrimoniu, istorie urbană, personalități și evoluția Bucureștiului.',
  },
  {
    icon: '💬',
    title: 'Memorie comunitară',
    description:
      'Amintiri, observații, contribuții și detalii locale care pot completa perspectiva istorică oficială.',
  },
  {
    icon: '🌐',
    title: 'Resurse digitale',
    description:
      'Materiale disponibile online, hărți, articole, baze de date și platforme de documentare urbană.',
  },
]

const roles = [
  {
    icon: '🔎',
    title: 'Cercetare',
    description:
      'Identificarea obiectivelor, verificarea informațiilor și organizarea surselor relevante.',
  },
  {
    icon: '✍️',
    title: 'Conținut',
    description:
      'Scrierea descrierilor, poveștilor, timeline-urilor, textelor pentru tururi și materialelor explicative.',
  },
  {
    icon: '🎨',
    title: 'Design UI/UX',
    description:
      'Crearea unei experiențe vizuale cinematice, coerente, moderne și adaptate pentru mobil.',
  },
  {
    icon: '💻',
    title: 'Frontend',
    description:
      'Implementarea paginilor în Vue 3, integrarea store-urilor Pinia, Vuetify, router și Leaflet.',
  },
  {
    icon: '🧩',
    title: 'Backend',
    description:
      'Organizarea datelor, expunerea endpoint-urilor API și conectarea aplicației la structura de date.',
  },
  {
    icon: '🤖',
    title: 'Asistență AI',
    description:
      'Sprijin pentru structurare, texte, idei de design, debugging și îmbunătățirea fluxului de lucru.',
  },
]
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(255, 145, 0, 0.13), transparent 34%),
    linear-gradient(135deg, #0d0d0d 0%, #17120d 45%, #080808 100%);
  color: #fff;
}

.content-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1180px;
}

.about-hero {
  position: relative;
  overflow: hidden;
  padding: 100px 0 44px;
}

.hero-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(12px);
  opacity: 0.8;
  pointer-events: none;
}

.hero-glow-one {
  width: 260px;
  height: 260px;
  top: 80px;
  right: 12%;
  background: rgba(255, 138, 0, 0.16);
}

.hero-glow-two {
  width: 160px;
  height: 160px;
  bottom: 20px;
  left: 8%;
  background: rgba(234, 88, 12, 0.12);
}

.hero-content {
  max-width: 1150px;
}

.eyebrow {
  margin-bottom: 12px;
  color: #ff9800;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.section-header .eyebrow,
.field-content .eyebrow,
.ai-card .eyebrow,
.closing-card .eyebrow {
  margin-bottom: 12px;
  color: #ff9800;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.section-header h2 {
  /* min-width: 950px; */
}

.about-hero h1 {
  max-width: 860px;
  margin: 0 0 18px;
  color: #f5f5f5;
  font-size: clamp(2.4rem, 6vw, 5rem);
  line-height: 0.96;
  letter-spacing: -0.06em;
}

.hero-subtitle {
  max-width: 1140px;
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.05rem;
  line-height: 1.7;
  text-align: justify;
}

.motto-card {
  max-width: 1150px;
  margin-top: 34px;
  border: 1px solid rgba(255, 152, 0, 0.24);
  border-radius: 32px;
  background: rgba(18, 18, 18, 0.74);
  padding: 28px;
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
}

.motto-card .motto-title {
  display: block;
  text-align: center;
  font-size: 1rem;
}

.motto-card span {
  display: inline-block;
  margin-bottom: 12px;
  color: #ffb74d;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.motto-card blockquote {
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 800;
  line-height: 1.25;
}

.story-section,
.why-section,
.process-section,
.sources-section,
.field-section,
.team-section,
.ai-section,
.closing-section {
  padding: 42px 0;
}

.section-header {
  max-width: 760px;
  margin-bottom: 28px;
}

.section-header.centered {
  max-width: 860px;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.section-header h2,
.field-content h2,
.ai-card h2,
.closing-card h2 {
  margin: 0 0 14px;
  color: #f5f5f5;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.section-header p,
.field-content p,
.ai-text p,
.closing-card p {
  color: rgba(255, 255, 255, 0.72);
  font-size: 1rem;
  line-height: 1.75;
}

.story-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.8fr);
  gap: 24px;
}

.glass-card,
.quote-card,
.source-card,
.role-card,
.ai-card,
.closing-card {
  border: 1px solid rgba(255, 152, 0, 0.18);
  border-radius: 32px;
  background: rgba(18, 18, 18, 0.74);
  backdrop-filter: blur(18px);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
}

.large-card {
  padding: 32px;
}

.large-card h3,
.text-columns h3,
.timeline-card h3,
.source-card h3,
.role-card h3,
.quote-card h3 {
  margin: 0 0 14px;
  color: #f5f5f5;
  font-size: 1.45rem;
  line-height: 1.1;
}

.large-card p,
.text-columns p,
.timeline-card p,
.source-card p,
.role-card p,
.quote-card p {
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.78;
}

.quote-card {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
  background:
    linear-gradient(145deg, rgba(255, 152, 0, 0.14), rgba(18, 18, 18, 0.74)), rgba(18, 18, 18, 0.74);
}

.quote-card span {
  margin-bottom: 16px;
  color: #ffb74d;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.quote-card h3 {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  line-height: 1.08;
}

.text-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.text-columns article {
  border: 1px solid rgba(255, 152, 0, 0.16);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.045);
  padding: 28px;
  transition:
    transform 0.28s ease,
    border-color 0.28s ease,
    background 0.28s ease;
}

.text-columns article:hover {
  border-color: rgba(255, 152, 0, 0.5);
  background: rgba(255, 152, 0, 0.08);
  transform: translateY(-5px);
}

.timeline {
  display: grid;
  gap: 16px;
}

.timeline-card {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 18px;
  border: 1px solid rgba(255, 152, 0, 0.16);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.045);
  padding: 24px;
  transition:
    transform 0.24s ease,
    border-color 0.24s ease,
    background 0.24s ease;
}

.timeline-card:hover {
  border-color: rgba(255, 152, 0, 0.5);
  background: rgba(255, 152, 0, 0.08);
  transform: translateY(-3px);
}

.timeline-card span {
  color: rgba(255, 152, 0, 0.32);
  font-size: 2.2rem;
  font-weight: 900;
  line-height: 1;
}

.sources-grid,
.roles-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.source-card,
.role-card {
  padding: 26px;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.source-card:hover,
.role-card:hover {
  border-color: rgba(255, 152, 0, 0.5);
  transform: translateY(-5px);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.48);
}

.source-icon,
.role-card span {
  display: grid;
  width: 52px;
  height: 52px;
  margin-bottom: 18px;
  place-items: center;
  border: 1px solid rgba(255, 152, 0, 0.24);
  border-radius: 18px;
  background: rgba(255, 152, 0, 0.1);
  font-size: 1.5rem;
}

.field-content {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 28px;
  align-items: center;
  border: 1px solid rgba(255, 152, 0, 0.18);
  border-radius: 36px;
  background:
    linear-gradient(145deg, rgba(255, 152, 0, 0.1), rgba(255, 255, 255, 0.035)),
    rgba(18, 18, 18, 0.74);
  padding: 32px;
  backdrop-filter: blur(18px);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
}

.photo-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  height: 100%;
  min-height: 380px;
}

.photo-placeholder {
  overflow: hidden;
  border-radius: 28px;
  position: relative;
  height: 100%;
}

.photo-placeholder.big {
  grid-row: span 2;
}

.photo-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.photo-placeholder:hover img {
  transform: scale(1.03);
}

.ai-card {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 30px;
  padding: 34px;
}

.ai-text {
  display: grid;
  gap: 14px;
}

.ai-text p {
  margin: 0;
}

.closing-section {
  padding-bottom: 96px;
}

.closing-card {
  padding: 38px;
  text-align: center;
}

.closing-card p {
  max-width: 820px;
  margin: 0 auto;
}

@media (max-width: 1180px) {
  .story-grid,
  .field-content,
  .ai-card {
    grid-template-columns: 1fr;
  }

  .sources-grid,
  .roles-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .text-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .about-hero {
    padding: 74px 0 28px;
  }

  .content-wrap {
    padding-inline: 20px;
  }

  .eyebrow {
    font-size: 1.3rem;
    letter-spacing: 0.14em;
  }

  .about-hero h1 {
    max-width: 100%;
    font-size: clamp(2.45rem, 12vw, 3.7rem);
    line-height: 0.98;
  }

  .hero-subtitle {
    max-width: 100%;
    font-size: 1rem;
    line-height: 1.65;
  }

  .story-section,
  .why-section,
  .process-section,
  .sources-section,
  .field-section,
  .team-section,
  .ai-section,
  .closing-section {
    padding: 28px 0;
  }

  .section-header {
    margin-bottom: 24px;
  }

  .section-header.centered {
    text-align: left;
  }

  .motto-card,
  .large-card,
  .quote-card,
  .text-columns article,
  .field-content,
  .ai-card,
  .closing-card {
    border-radius: 26px;
    padding: 22px;
  }

  .motto-card {
    margin-top: 28px;
  }

  .motto-card blockquote {
    font-size: clamp(1.18rem, 6vw, 1.55rem);
  }

  .section-header h2,
  .field-content h2,
  .ai-card h2,
  .closing-card h2 {
    font-size: clamp(2rem, 9vw, 2.55rem);
    line-height: 1.03;
  }

  .story-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .timeline-card {
    grid-template-columns: 1fr;
    padding: 22px;
  }

  .timeline-card:hover,
  .source-card:hover,
  .role-card:hover,
  .text-columns article:hover {
    transform: none;
  }

  .timeline-card span {
    font-size: 1.8rem;
  }

  .sources-grid,
  .roles-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .photo-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .photo-placeholder.big {
    grid-row: auto;
  }

  .closing-section {
    padding-bottom: 64px;
  }
}

@media (max-width: 420px) {
  .content-wrap {
    padding-inline: 16px;
  }

  .about-hero {
    padding: 58px 0 24px;
  }

  .about-hero h1 {
    font-size: clamp(2.25rem, 13vw, 3rem);
  }

  .motto-card,
  .large-card,
  .quote-card,
  .text-columns article,
  .field-content,
  .ai-card,
  .closing-card,
  .source-card,
  .role-card {
    padding: 18px;
  }

  .story-section,
  .why-section,
  .process-section,
  .sources-section,
  .field-section,
  .team-section,
  .ai-section,
  .closing-section {
    padding: 24px 0;
  }

  .photo-placeholder {
    min-height: 145px;
  }
}
</style>
