export const mixin = {
    methods:{
        notify(title,type){
            this.$notify({
                title: title,
                type: type
            })
        }
    }
}