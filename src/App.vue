<template>
  <div class="container">
      <div class="row">
          <div class="col-sm-8 col-sm-offset-2 col-xs-12 col-md-6 col-md-offset-3 form-group">
              <h1>Http</h1>

              <div class="form-group">
                <label>Username</label>
                <input type="text" class="form-control" v-model="user.username">
              </div>

              <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control" v-model="user.email">
              </div>

              <button class="btn btn-primary" @click="submit">Submit</button>
              <hr>

              <input type="text" class="form-control" v-model="node">
              <br><br>

              <button class="btn btn-primary" @click="fetchData">Get Data</button>
              <br><br>

              <ul class="list-group">
                <li class="list-group-item" v-for="(u, index) in arrUsers" :key="index">{{ u.username }} - {{ u.email }}</li>
              </ul>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      user: {
        username: '',
        email: ''
      },

      arrUsers: [],
      resource: {},
      node: 'data'
    }
  },

  methods: {
    submit() {
      //? jedan nacin bez $resource
      // console.log(this.user)
      // this.$http.post('data.json', this.user) // $http inace nije dostupno po difoltu vec smo dodali sa vue-resource instalacijom. ovo je url sa realtime database u firebase, i dodajemo /data i .json, jer readujemo data (doduse ovo msm da smomogli koji god naz  iv a ne iskljucivo data), a server prihvata samo json format zato dodajemo data.json. Dakle prvi argument post-a je url kom saljemo rikvest, a drugi je sta saljemo na tu url, dakle this.user podatke. Ovako se dakle salje, ali mozda budemo zeleli da odg nesto, neki response, a ovo ce btii Promise. ELEM, POSTO SMO CENTRALIZOVALI OVAJ URL KOJI VISE X KORISTIMO U MAIN.JS U HTTP.OPTIONS.ROOT, OVDE SADA NE STAVLJAMO TAJ URL VEC PRAZAN STRING
      //   .then(response => { // kada se operacija izvrsi 
      //       console.log(response)
      //   }, error => {
      //       console.log(error)
      //   })
      //? drugi safe nacin sa $resource
      // this.resource.save({}, this.user) // koristimo moj resource property koji smo konfigurisali dole u created() lifecycle, a ovo save() je default actions (vidi dokumentacij una https://guthub.com/vuejs/vue-resource/blob/master/docs/resource.md)
      // ovo ce da salje POST request ka url koja je sacuvana za ovaj resource tj data.json koji je apendovan root url-u. I sada ovom save metodu mozemo proslediti dva parametara, prvi je bilo koji parametar koji zelimo da prosledimo URL-u, to za sad necemo raditi. A drugi argument je podatak koji ustvari zelim da posaljem tom URL-u, a podatak koji zelim da posaljem je this.user
      this.resource.saveAlt(this.user) // kreirali smo novog korisnika ali ne na data.json url vec alternativa.json. 
      // i sad vidimo kako je lako sa $resource da kreiramo vise brzih resourceva sa razlicitih urls i potom ih koristimo bas kao ovde na vise razlicitih mesta imajuci najvisi level flexibiliteta bez da hardkorujemo sve iznova i iznova, ovako ponovo koristimo isti resource dva x, tri x, koliko god
    },

    fetchData() {
      //? jedan nacin bez $resource
      // this.$http.get('data.json')
      //   .then(response => {
      //     // const data = response.json()
      //     // console.log(data) // medjutim, ovo sad ne vraca te ocekivane podatke iz baze, vec Promise, jer je ovo asinhron task takodje i treba mu vremena da se json-uje tj iz jsona prebaci u js objekat, zato nam treba jos jedno then(), a prethodno ne cuvamo ovo u promenljivoj nego returnisemo
      //     return response.json() // e sada u sledecem then mozemo da koristimo extraktovane podatke, tj lupujemo kroz njih il sta god
      //   })
      //     .then(data => {
      //       // console.log(data)
      //       // ove podatke iz baze treba da prvo pretvorimo u array da bi koristili array metode, a ovo je sada objekat
      //       const arrResults = []
      //       for (let key in data) {
      //         arrResults.push(data[key])
      //       }
      //       console.log(arrResults);
      //       this.arrUsers = arrResults
      //     })

      //? drugi safe nacin sa $resources
      this.resource.getData({node: this.node}) // ovde mozemo za parametar da stavimo objekat u kome cemo da naznacimo dinamicki deo url adrese, tj deo koji zelimo da modifikujemo, ubacimo umesto onoga sto je vec tamo, pa recimo node da bude ono gore node koji za sad za vrednost ima 'data', ali posto je povezamo preko v-model sa onim inputom, to sada moze da bude sta god korisnik unese. Btw, da smo dole stavili jos jedan dinamicki deo url-a recimo {node}/{another}.json, ovde bismo sada pored ovog node mogli staviti i another: this.paNesto. Mozemo postati i drugi argument ali za get rikvest nam u sustini ne treba
          .then(response => {
            return response.json()
          })
          .then(data => {
              const arrResult = []
              for (let key in data) {
                arrResult.push(data[key])
              }
              // console.log(arrResult)
              this.arrUsers = arrResult
          })


    }
  },

  created() { // created je dobro mesto za inicijalizovanje risorsa
    const customActions = {
        saveAlt: {method: 'POST', url: 'alternativa.json'},
        getData: {method: 'GET'} // vue resources podrzava setovanje url-a kao templates, sa flexibilnim delovima jelte (URI TEMPLATES u dokumentaciji za vue resources)
    }

    // this.resource = this.$resource('data.json', {}, customActions) // $ je oznaka za metode, promenljive itd koje dolazi iz vue-a konkretno. $resource() je metod kom prosledjujemo polja podataka (data fields). Prvo polje je resoure, u ovom slucaju to moze biti 'data.json' (idemo u one root podatke gde je  url da obrisemo data.json deo i ubacimo ga ovde). Takodje to data.json stavljamo sada i u one metode post i get. DRUGI argument cemo ostaviti prazan, ovo ce da nam omoguci da prosledimo varijablu data u URL, a za TRECI argument cemo staviti customActions tj nas objekat sa akcijama u njemu koje smo kreirali

    // kako sad ovaj url da napravimo jos fleksibilnijim/dinamicnijmim? recimo ovo data da zamenimo sa {node}, i ovo je sada varijabla koju mozemo da zamenimo
    this.resource = this.$resource('{node}.json', {}, customActions) //Za saving akcije ovo saveAlt ce da overvrituje sa alternativa.json url, ali za GETting

  }
}

// $resources su samo alternativa za http GET i POST rikvestove, i mozda ih je bolje koristiti u slucajevima kada ne zelimo da kreiramo reusable resources vec samo povremeno treba da saljemo rikvestove ovde onde
// BRATE NISTA NISAM OVO RAZUMELA, ugl $resource je predstavljena kao alternativa
</script>

<style>

</style>
