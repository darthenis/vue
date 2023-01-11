const { createApp } = Vue;

createApp({
    data(){
        return {
            event : undefined
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
                .then(res => res.json())
                .then(res => {
                    let id = (new URLSearchParams(location.search)).get('id');
                    this.event = res.events.filter(e => e._id === id)[0];
                })
    }
}).mount('#app')