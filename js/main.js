/// vue

const { createApp } = Vue

  createApp({
    data() {
      return {
        events: null,
        categories: null,
        search: "",
        checked: [],
        filterEvents: null,
        error : null
      }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
              .then(res => res.json())
              .then(res => {

                if(document.title.split("|")[1].trim() === "Home"){
                  
                  this.events = res.events;

                } else if(document.title.split("|")[1].trim()  === "Upcoming Events"){

                  this.events = res.events.filter(e => e.date > res.currentDate)

                } else {

                  this.events = res.events.filter(e => e.date < res.currentDate)
                  
                }

                this.filterEvents = [...this.events];
                this.categories = [... new Set(this.events.map(e => e.category))]
      
              })
              .catch(err => {

                    this.error = err;
                    console.log(err)
              }) 
    },
    methods: {

        filter : function(){

            let searchFilter = this.events.filter(data => data.name.toLowerCase().startsWith( this.search.toLowerCase() ));

            if(this.checked.length){

              let filterData = [];
        
              for(let check of this.checked){

                 filterData = filterData.concat(searchFilter.filter(e => e.category === check))

              }

              this.filterEvents = [...filterData]

            } else {

              this.filterEvents = [...searchFilter]

            }

            
            
        }

    }
  }).mount('#app')