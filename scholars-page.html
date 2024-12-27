<html><head><base href="/" /><title>Islamic Heritage Library - Scholars</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <style>
      .scholar-card {
        transition: all 0.3s ease;
      }
      .scholar-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .fade-in {
        animation: fadeIn 0.5s ease-in;
      }
      .timeline-dot {
        transition: all 0.3s ease;
      }
      .timeline-dot:hover {
        transform: scale(1.2);
      }
      .arabic-calligraphy {
        font-family: 'Noto Naskh Arabic', serif;
      }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
    <div id="app">
      <!-- Navigation -->
      <nav class="bg-green-800 text-white shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <a href="/" class="text-xl font-bold flex items-center">
                <svg class="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Yahaya Bawa Islamic Library
              </a>
            </div>
            <div class="flex items-center space-x-6">
              <a href="/books" class="hover:text-green-200 transition-colors">Books</a>
              <a href="/scholars" class="hover:text-green-200 transition-colors">Scholars</a>
              <a href="/login" class="hover:text-green-200 transition-colors">Login</a>
              <a href="/register" class="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">Register</a>
            </div>
          </div>
        </div>
      </nav>
    
      <!-- Hero Section -->
      <div class="bg-green-700 text-white py-12">
        <div class="max-w-7xl mx-auto px-4">
          <h1 class="text-4xl font-bold mb-4 text-center fade-in">Scholars of the Sokoto Caliphate</h1>
          <p class="text-xl text-center mb-8">Exploring the lives and works of influential Islamic scholars</p>
        </div>
      </div>
    
      <!-- Search and Filter Section -->
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex flex-wrap gap-4 justify-between items-center">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search scholars..." 
            class="px-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
          <div class="flex gap-4">
            <select 
              v-model="selectedEra" 
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Eras</option>
              <option v-for="era in eras" :key="era" :value="era">{{ era }}</option>
            </select>
            <select 
              v-model="selectedSpecialty" 
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Specialties</option>
              <option v-for="specialty in specialties" :key="specialty" :value="specialty">{{ specialty }}</option>
            </select>
          </div>
        </div>
      </div>
    
      <!-- Scholars Grid -->
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="scholar in filteredScholars" 
               :key="scholar.id" 
               class="scholar-card bg-white rounded-lg shadow-md overflow-hidden">
            <div class="h-48 bg-green-100 flex items-center justify-center">
              <div class="h-32 w-32 rounded-full bg-green-200 flex items-center justify-center">
                <span class="text-4xl text-green-800 arabic-calligraphy">{{ scholar.initial }}</span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">{{ scholar.name }}</h3>
              <p class="text-sm text-gray-600 mb-2">{{ scholar.era }}</p>
              <p class="text-gray-700 mb-4">{{ scholar.description }}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="specialty in scholar.specialties" 
                      :key="specialty"
                      class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {{ specialty }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">{{ scholar.works }} works</span>
                <a :href="'/scholar/' + scholar.id" 
                   class="inline-flex items-center text-green-600 hover:text-green-800">
                  View Profile
                  <svg class="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Timeline Section -->
      <div class="bg-gray-100 py-16">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-3xl font-bold mb-12 text-center">Scholar Timeline</h2>
          <div class="relative">
            <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-200"></div>
            <div class="space-y-12">
              <div v-for="event in timelineEvents" 
                   :key="event.year" 
                   class="relative">
                <div class="timeline-dot absolute left-1/2 transform -translate-x-1/2 -translate-y-4 w-4 h-4 bg-green-500 rounded-full"></div>
                <div class="ml-auto mr-8 md:mr-auto md:ml-8 p-6 bg-white rounded-lg shadow-md w-full md:w-96" 
                     :class="event.year % 2 === 0 ? 'md:ml-auto md:mr-8' : 'md:mr-auto md:ml-8'">
                  <span class="text-green-600 font-bold">{{ event.year }}</span>
                  <h3 class="font-bold mt-2 mb-2">{{ event.title }}</h3>
                  <p class="text-gray-600">{{ event.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <script>
    const { createApp } = Vue
    
    createApp({
      data() {
        return {
          searchQuery: '',
          selectedEra: '',
          selectedSpecialty: '',
          eras: ['18th Century', '19th Century', 'Early 20th Century'],
          specialties: ['Fiqh', 'Hadith', 'Tafsir', 'Islamic Philosophy', 'Islamic History'],
          scholars: [
            {
              id: 1,
              name: 'Sheikh Othman Bn Fodio',
              initial: 'ع',
              era: '18th Century',
              description: 'Founder of the Sokoto Caliphate, renowned religious scholar and reformer',
              specialties: ['Fiqh', 'Islamic Philosophy', 'Tafsir'],
              works: 48
            },
            {
              id: 2,
              name: 'Sheikh Abdullahi Bn Fodio',
              initial: 'ا',
              era: '18th Century',
              description: 'Brother of Othman Bn Fodio, distinguished scholar and author',
              specialties: ['Hadith', 'Fiqh', 'Islamic History'],
              works: 35
            },
            {
              id: 3,
              name: 'Sultan Muhammad Bello',
              initial: 'م',
              era: '19th Century',
              description: 'Second Sultan of Sokoto, prolific writer and scholar',
              specialties: ['Islamic Philosophy', 'Fiqh', 'Tafsir'],
              works: 42
            }
          ],
          timelineEvents: [
            {
              year: 1754,
              title: "Birth of Sheikh Othman Bn Fodio",
              description: "Born in Gobir, present-day Nigeria"
            },
            {
              year: 1774,
              title: "Beginning of Educational Journey",
              description: "Started teaching and preaching in various communities"
            },
            {
              year: 1804,
              title: "Establishment of the Sokoto Caliphate",
              description: "Founded the Sokoto Caliphate, beginning a new era of Islamic scholarship"
            }
          ]
        }
      },
      computed: {
        filteredScholars() {
          return this.scholars.filter(scholar => {
            const matchesSearch = scholar.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                                scholar.description.toLowerCase().includes(this.searchQuery.toLowerCase());
            const matchesEra = !this.selectedEra || scholar.era === this.selectedEra;
            const matchesSpecialty = !this.selectedSpecialty || 
                                    scholar.specialties.includes(this.selectedSpecialty);
            return matchesSearch && matchesEra && matchesSpecialty;
          });
        }
      }
    }).mount('#app')
    </script>
    
    </body></html>