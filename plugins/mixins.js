import Vue from 'vue'
import { mapGetters } from 'vuex'

const Mixins = {
    install(Vue, options) {
        Vue.mixin({
            async fetch ({ $axios, store }) {
                if (store.state.auth.loggedIn) {
                    let { data } = await $axios.get('/config')

                    store.dispatch('setConfig', data.data);
                }

                return
            },

            methods: {
                franchiseClass(franchiseId) {
                    return 'franchise-' + franchiseId
                }
            },

            computed: {
                ...mapGetters({
                    franchiseId: 'getFranchiseId',
                    loadingPage: 'getLoadingPage',
                    modalPlayer: 'getModalPlayer',
                    currentDate: 'getCurrentDate',
                    rosterSize: 'getRosterSize',
                    goalieStarts: 'getGoalieStarts',
                    franchiseName: 'getFranchiseName',
                    franchiseTag: 'getFranchiseTag',
                    currentMatchup: 'getCurrentMatchup',
                    weeklyAdds: 'getWeeklyAdds'
                })
            }
        })
    }
}

Vue.use(Mixins)
