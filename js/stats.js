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
    methods: {
        loadTableCategories : (isBefore, data) => {

            let events;

            isBefore ? events = data.events.filter(e => e.date < data.currentDate)
                     : events = data.events.filter(e => e.date >= data.currentDate)
             

            return events.reduce((acc, ele, index, array) => {

                let accIdx = acc.indexOf(e => e.name === ele.category); 
    
                if(accIdx >= 0){
    
                    acc[accIdx].revenues += (ele.estimate ?? ele.assistance) * ele.price;
                    acc[accIdx].assistance.push((ele.estimate ?? ele.assistance) * 100 / ele.capacity);
    
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

        },

        loadStatics : (data) => {

            return data.events.reduce((acc, event, index, array) => {

                if (event.assistance * 100 / event.capacity > acc[0].value) {
        
                    acc[0].name = event.name;
                    acc[0].value = parseFloat(((event.estimate ?? event.assistance) * 100 / event.capacity).toFixed(2));
                }
        
        
                if (event.assistance * 100 / event.capacity < acc[1].value) {
        
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

        }




    },
    computed: {
        loadStats(){

            if(!this.data) return;

            this.firsTable = this.loadStatics(this.data);

            this.secondTable = this.loadTableCategories(false, this.data);

            this.thirdTable = this.loadTableCategories(true, this.data);
        
        }
            
        

    }
}).mount("#app")