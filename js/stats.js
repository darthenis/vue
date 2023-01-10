const { createApp } = Vue;

createApp({
    data(){
        return {
            data : null,
            firsTable : [],
            secondTable : [],
            thirdTable : []
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
                .then(res => res.json())
                .then(res => {
                    this.data = res;
                })
    },
    computed: {
        loadStats(){

            this.firsTable = this.data?.events.reduce((acc, event, index, array) => {

                if ((event.estimate ?? event.assistance) * 100 / event.capacity > acc[0].value) {
        
                    acc[0].name = event.name;
                    acc[0].value = parseFloat(((event.estimate ?? event.assistance) * 100 / event.capacity).toFixed(2));
                }
        
        
                if ((event.estimate ?? event.assistance) * 100 / event.capacity < acc[1].value) {
        
                    acc[1].name = event.name;
                    acc[1].value = parseFloat(((event.estimate ?? event.assistance) * 100 / event.capacity).toFixed(2));
                }
        
        
                if (event.capacity > acc[2].value) {
        
                    acc[2].name = event.name;
                    acc[2].value = event.capacity;
        
                }

                if(index === array.length - 1){

                   for(let i = 0; i < 2; i++){

                    acc[i].value = acc[i].value + "%"

                   }

                }
        
                return acc;
        
            }, [{ name: "", value: -Infinity },
                { name: "", value: Infinity },
                { name: "", value: -Infinity }])

            const loadTableCategories = (isBefore) => {

                if(!this.data) return;

                let events;

                isBefore ? events = this.data.events.filter(e => e.date < this.data.currentDate)
                         : events = this.data.events.filter(e => e.date > this.data.currentDate)
                 

                return events.reduce((acc, ele, index, array) => {

                    let accId = acc.indexOf(e => e.name === ele.category); 
        
                    if(accId >= 0){
        
                        acc[accId].revenues += (ele.estimate ?? ele.assistance) * ele.price;
                        acc[accId].assistance.push((ele.estimate ?? ele.assistance) * 100 / ele.capacity);
        
                    } else {
        
                        const element = {
                            name : ele.category,
                            revenues: (ele.estimate ?? ele.assistance) * ele.price,
                            assistance: [(ele.estimate ?? ele.assistance) * 100 / ele.capacity]
                        }
        
                        acc.push(element);
        
                    }
        
                    if (index === array.length - 1) {
        
                        for(let elem of acc){

                            let total = elem.assistance.reduce((acc, num) => acc + num, 0);
        
                            elem.assistance = parseFloat((total / elem.assistance.length).toFixed(2));

                        }
        
                    }
        
                    return acc;
        
                    
                }, [])

            }

            this.secondTable = loadTableCategories(false)

            this.thirdTable = loadTableCategories(true)
        
        }
            
        

    }
}).mount("#app")