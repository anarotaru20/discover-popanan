<template>
  <main class="about-page">
    <section class="about-hero">
      <div class="hero-content">
        <p class="eyebrow">Despre proiect</p>
        <h1>Discover Popa Nan</h1>
        <p class="hero-subtitle">
          O aplicație web despre memorie urbană, patrimoniu local și poveștile ascunse ale unei
          străzi care a văzut Bucureștiul schimbându-se de la mahala la oraș modern.
        </p>

        <div class="motto-card">
          <span>Motto</span>
          <blockquote>
            „Uneori, orașul nu dispare. Doar se ascunde sub straturi de timp, clădiri, amintiri și
            povești nespuse.”
          </blockquote>
        </div>
      </div>
    </section>

    <section class="story-section">
      <div class="section-header">
        <p class="eyebrow">Cine suntem</p>
        <h2>O echipă care caută trecutul prin tehnologie</h2>
      </div>

      <div class="story-grid">
        <article class="glass-card large-card">
          <h3>Despre noi</h3>
          <p>
            Discover Popa Nan este un proiect educațional și digital creat din dorința de a
            transforma istoria locală într-o experiență interactivă, accesibilă și ușor de parcurs.
            În loc ca informațiile despre o zonă istorică să rămână doar în arhive, documente sau
            articole greu de găsit, proiectul le aduce într-o aplicație web modernă, unde utilizatorul
            poate explora locuri, tururi, imagini, hărți și povești.
          </p>

          <p>
            Am pornit de la ideea că o stradă nu este doar o linie pe hartă. O stradă are oameni,
            case, biserici, fabrici, schimbări, pierderi și urme. Popa Nan este un astfel de loc:
            aparent obișnuit, dar plin de straturi istorice. În spatele fațadelor, curților și
            clădirilor se ascund episoade din Bucureștiul vechi, din perioada interbelică, din anii
            comunismului și din orașul de astăzi.
          </p>

          <p>
            Prin acest proiect, am încercat să construim o punte între trecut și prezent. Aplicația
            nu este doar o listă de obiective turistice, ci o formă de ghid digital care invită
            utilizatorul să privească mai atent locurile prin care trece. Fiecare punct de pe hartă
            devine o mică poveste, iar fiecare poveste ajută la reconstruirea atmosferei unei zone
            care merită redescoperită.
          </p>
        </article>

        <article class="quote-card">
          <span>Ideea principală</span>
          <h3>Istoria locală poate deveni vie atunci când este povestită bine.</h3>
          <p>
            De aceea, aplicația combină cercetarea, designul, hărțile interactive, fotografiile și
            elementele audio într-o experiență digitală coerentă.
          </p>
        </article>
      </div>
    </section>

    <section class="why-section">
      <div class="section-header centered">
        <p class="eyebrow">De ce Popa Nan?</p>
        <h2>O stradă mică, dar cu o memorie mare</h2>
        <p>
          Popa Nan a fost aleasă pentru că este un spațiu urban cu identitate puternică, dar care nu
          este promovat suficient ca zonă de patrimoniu și explorare culturală.
        </p>
      </div>

      <div class="text-columns">
        <article>
          <h3>Un loc între mahala, patrimoniu și oraș modern</h3>
          <p>
            Zona Popa Nan păstrează urme ale Bucureștiului de altădată: biserici, case vechi,
            spații industriale, clădiri asociate cu personalități culturale și fragmente din
            istoria orașului. Strada reflectă trecerea de la mahalaua bucureșteană la orașul modern,
            apoi la transformările dure ale secolului XX.
          </p>
          <p>
            Alegerea acestei zone a venit din dorința de a demonstra că patrimoniul nu înseamnă doar
            monumente celebre. Patrimoniul poate fi și o casă discretă, o fostă fabrică, o biserică
            de cartier, o plăcuță memorială sau o poveste transmisă de comunitate.
          </p>
        </article>

        <article>
          <h3>O zonă care merită redescoperită</h3>
          <p>
            În multe cazuri, oamenii trec pe lângă aceste locuri fără să știe ce reprezintă.
            Aplicația își propune să schimbe această experiență: să transforme o simplă plimbare
            într-un traseu de descoperire, în care fiecare oprire oferă context, emoție și informație.
          </p>
          <p>
            Popa Nan devine astfel un exemplu de cum tehnologia poate sprijini educația urbană și
            poate încuraja interesul pentru istoria locală. Nu este nevoie de un muzeu clasic pentru
            a învăța despre trecut. Uneori, muzeul este chiar strada.
          </p>
        </article>
      </div>
    </section>

    <section class="process-section">
      <div class="section-header">
        <p class="eyebrow">Proces de cercetare</p>
        <h2>Cum am construit povestea</h2>
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
    </section>

    <section class="sources-section">
      <div class="section-header centered">
        <p class="eyebrow">Surse și documentare</p>
        <h2>Arhive, hărți, teren și memorie comunitară</h2>
        <p>
          Proiectul combină informații istorice, observație directă, fotografii de teren, hărți vechi
          și materiale disponibile public.
        </p>
      </div>

      <div class="sources-grid">
        <article v-for="source in sources" :key="source.title" class="source-card">
          <div class="source-icon">{{ source.icon }}</div>
          <h3>{{ source.title }}</h3>
          <p>{{ source.description }}</p>
        </article>
      </div>
    </section>

    <section class="field-section">
      <div class="field-content">
        <div>
          <p class="eyebrow">Poze de teren</p>
          <h2>Documentarea începe pe stradă</h2>
          <p>
            O parte importantă a proiectului a fost observarea directă a zonei. Fotografiile de teren
            ajută la înțelegerea stării actuale a obiectivelor, a detaliilor arhitecturale și a
            felului în care trecutul este încă vizibil în prezent.
          </p>
          <p>
            Prin pozele realizate la fața locului, aplicația păstrează o legătură reală cu spațiul
            urban. Nu este doar o prezentare teoretică, ci o explorare ancorată în locuri existente,
            în texturi, fațade, porți, străzi și repere concrete.
          </p>
        </div>

        <div class="photo-grid">
          <div class="photo-placeholder big">
            <span>Foto teren 1</span>
          </div>
          <div class="photo-placeholder">
            <span>Foto teren 2</span>
          </div>
          <div class="photo-placeholder">
            <span>Foto teren 3</span>
          </div>
        </div>
      </div>
    </section>

    <section class="team-section">
      <div class="section-header centered">
        <p class="eyebrow">Echipă</p>
        <h2>Roluri în proiect</h2>
        <p>
          Proiectul a fost organizat pe mai multe direcții: cercetare, conținut, design, dezvoltare
          frontend, backend și integrare cu hărți interactive.
        </p>
      </div>

      <div class="roles-grid">
        <article v-for="role in roles" :key="role.title" class="role-card">
          <span>{{ role.icon }}</span>
          <h3>{{ role.title }}</h3>
          <p>{{ role.description }}</p>
        </article>
      </div>
    </section>

    <section class="ai-section">
      <div class="ai-card">
        <div>
          <p class="eyebrow">AI în proiect</p>
          <h2>Cum am folosit inteligența artificială</h2>
        </div>

        <div class="ai-text">
          <p>
            Inteligența artificială a fost folosită ca instrument de sprijin în procesul de lucru,
            nu ca înlocuitor al cercetării. AI-ul a ajutat la structurarea ideilor, rafinarea
            textelor, organizarea conținutului, generarea unor propuneri de interfață și formularea
            mai clară a poveștilor istorice.
          </p>

          <p>
            De asemenea, AI-ul a fost util pentru transformarea informațiilor brute în texte mai
            ușor de citit, pentru formularea descrierilor obiectivelor și pentru propuneri de design
            cinematic potrivite aplicației. În partea tehnică, AI-ul a fost folosit pentru asistență
            în scrierea codului, structurarea componentelor Vue, organizarea logicii frontend și
            rezolvarea unor probleme de integrare cu Leaflet.
          </p>

          <p>
            Toate informațiile importante au fost adaptate și verificate în contextul proiectului.
            Scopul folosirii AI-ului a fost accelerarea procesului de lucru și îmbunătățirea
            prezentării, păstrând în același timp controlul asupra conținutului final.
          </p>
        </div>
      </div>
    </section>

    <section class="closing-section">
      <div class="closing-card">
        <p class="eyebrow">Concluzie</p>
        <h2>Discover Popa Nan este o invitație la privit mai atent.</h2>
        <p>
          Aplicația propune o experiență în care utilizatorul nu doar citește despre trecut, ci îl
          explorează. Prin hartă, tururi, obiective, imagini și povești, strada Popa Nan devine un
          spațiu de descoperire, un traseu urban și un mic muzeu digital al memoriei bucureștene.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
const researchSteps = [
  {
    number: '01',
    title: 'Identificarea zonei',
    description:
      'Am ales strada Popa Nan ca studiu de caz pentru că păstrează urme istorice diverse și are o identitate urbană puternică.',
  },
  {
    number: '02',
    title: 'Documentare istorică',
    description:
      'Am urmărit informații despre obiective, perioade istorice, personalități, clădiri, transformări urbane și contexte locale.',
  },
  {
    number: '03',
    title: 'Observație pe teren',
    description:
      'Am analizat locurile actuale, poziționarea lor, starea clădirilor, detaliile vizibile și felul în care se raportează la orașul de azi.',
  },
  {
    number: '04',
    title: 'Organizarea conținutului',
    description:
      'Informațiile au fost transformate în obiective, tururi, descrieri scurte, timeline-uri, galerii, hărți și materiale audio.',
  },
  {
    number: '05',
    title: 'Construirea aplicației',
    description:
      'Am integrat conținutul într-o aplicație Vue cu design dark/orange, hărți Leaflet, pagini dedicate și experiență responsive.',
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
    title: 'AI Support',
    description:
      'Sprijin pentru structurare, texte, idei de design, debugging și îmbunătățirea fluxului de lucru.',
  },
]
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 145, 0, 0.18), transparent 34%),
    radial-gradient(circle at 85% 20%, rgba(255, 87, 34, 0.12), transparent 30%),
    linear-gradient(135deg, #0d0d0d 0%, #17120d 46%, #080808 100%);
  color: #fff;
}

.about-hero {
  padding: 104px 7vw 56px;
}

.hero-content {
  max-width: 980px;
}

.eyebrow {
  margin-bottom: 12px;
  color: #ff9800;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.about-hero h1 {
  margin-bottom: 18px;
  font-size: clamp(3rem, 8vw, 7rem);
  line-height: 0.9;
}

.hero-subtitle {
  max-width: 760px;
  color: rgba(255, 255, 255, 0.74);
  font-size: clamp(1.02rem, 2vw, 1.24rem);
  line-height: 1.7;
}

.motto-card {
  max-width: 760px;
  margin-top: 34px;
  border: 1px solid rgba(255, 152, 0, 0.24);
  border-radius: 32px;
  background: rgba(18, 18, 18, 0.72);
  padding: 28px;
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
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
  padding: 42px 7vw;
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
  margin-bottom: 14px;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1;
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
  background: rgba(18, 18, 18, 0.72);
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
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
  margin-bottom: 14px;
  font-size: 1.45rem;
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
    linear-gradient(145deg, rgba(255, 152, 0, 0.14), rgba(18, 18, 18, 0.72)),
    rgba(18, 18, 18, 0.72);
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
  transition: 0.24s ease;
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
  transition: 0.25s ease;
}

.source-card:hover,
.role-card:hover {
  border-color: rgba(255, 152, 0, 0.5);
  transform: translateY(-5px);
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
    rgba(18, 18, 18, 0.72);
  padding: 32px;
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
}

.photo-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  grid-template-rows: 180px 180px;
  gap: 14px;
}

.photo-placeholder {
  display: grid;
  min-height: 160px;
  place-items: center;
  border: 1px dashed rgba(255, 183, 77, 0.34);
  border-radius: 26px;
  background:
    radial-gradient(circle at top right, rgba(255, 152, 0, 0.18), transparent 42%),
    rgba(255, 255, 255, 0.045);
  color: rgba(255, 255, 255, 0.62);
  font-weight: 800;
}

.photo-placeholder.big {
  grid-row: span 2;
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

@media (max-width: 1100px) {
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

@media (max-width: 720px) {
  .about-hero {
    padding: 76px 20px 36px;
  }

  .story-section,
  .why-section,
  .process-section,
  .sources-section,
  .field-section,
  .team-section,
  .ai-section,
  .closing-section {
    padding: 28px 20px;
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

  .timeline-card {
    grid-template-columns: 1fr;
    padding: 22px;
  }

  .timeline-card span {
    font-size: 1.8rem;
  }

  .sources-grid,
  .roles-grid {
    grid-template-columns: 1fr;
  }

  .photo-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .photo-placeholder.big {
    grid-row: auto;
  }
}
</style>