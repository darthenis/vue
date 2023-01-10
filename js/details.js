const { createApp } = Vue;

createApp({
    data(){
        return {
            event : null
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
                .then(res => res.json())
                .then(res => {

                    let id = (new URLSearchParams(location.search)).get('id');

                    console.log(id)

                    this.event = res.events.filter(e => e._id === id)[0];
                })
    }
}).mount('#app')