import moment from "moment";
const MIXIN={
    data() {
        return {
            
        }
    },
    computed: {
        
    },
    filters: {
        formatMD(dateStr) {
          let newDateStr = moment(dateStr).format("MM.DD");
          return newDateStr;
        },
        formatDay(dateStr) {
          let newDateStr = moment(dateStr).format("YYYY-MM-DD");
          return newDateStr;
        },
        formatDate(dateStr){
            let newDateStr = moment(dateStr).format("YYYY-MM-DD hh:mm");
          return newDateStr;
        }
      },
    methods: {
        setAutoHeader(){
            return {
                Autorization:'Bearer '+localStorage.getItem('token')
            }
        }
    },
}
export default MIXIN