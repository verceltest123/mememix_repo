<template>
    <div class="">
        {{allPurchases}}
        {{totalPnL }}
    </div>
</template>


<script>
import { mapGetters } from "vuex";


export default {
    name: 'TrackProgress',
    beforeCreate: {
        // ...this.$store.dispatch('getAllUserPurchases')
    },
    computed: {
        ...mapGetters(['allPurchases']),
        ...mapGetters(['totalPnL']),
    }
}

</script>

<style scoped>

</style>