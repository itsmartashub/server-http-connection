import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'

Vue.use(VueResource)
Vue.http.options.root = 'https://max-vuejs-http.firebaseio.com' // elem, za http rikvestove dolazi do ponavljanja nekih podataka kao sto je recimo url, pa ovo je super mesto za globalno metanje iliti centralizacija tih podataka. Root key je tvoj glavni url koji ces da koristis. Dakle svi rikvestovi ce se slati na ovu adresu. Mozemo staviti i difoltni header, content type itd itd, ne samo root, i stosta toga, pise na dokumentaciji za vue-resource na githabu za http itd
Vue.http.interceptors.push((request, next) => { // interceptors je niz f-ja koje zelimo da se izvrse prilikom svakog rikvesta. U taj array mozemo da pushujemo nove interceptors, a ta f-ja ce imati odrejdenu strukturu: prvi argument je request, a drugi ce biti next tj fja koja ce omoguciti rikvestu da se nastavi.
  // elem data.json iz url-a brisemo i stavljamo u app.vue gde je onaj $resource
  console.log(request)

  if (request.method == 'POST') {
    request.method = 'PUT'
  }
  // razlika izmedju POST i PUT na firebasu: POST kreira novi risors i kreirajuci novi id ga mece pored vec kreiranih, a PUT overvrtuje postojeci, stare podatke
  // next() // medjtuim sada nam se ne prikazuju podaci kada kliknemo na get data jer ne dobijamo vise array, umesto toga dobijamo objekat koji ima email i username, nema onog key-a, onaj kao ID tj hijeroglifi unikatni kao sa POST metodom
  next(response => {
    // mozemo da promenimo kako json response radi. Mozemo da overvritujemo onaj response json response iz fetchData, doduse, ovo ce da overvrituje svaki response.json
    response.json = () => { return { poruke: response.body }} // ovde nam treba opet neki key da bismo mogli da lupujemo kroz to i prikazemo, ugl za key cemo lupiti poruke

  })
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')