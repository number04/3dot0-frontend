export const state = () => ({
    modal: {
        show: false,
        player: {
            data: {}
        }
    },

    loading: {
        page: false,
        modal: false,
        submit: false,
        success: false
    },

    config: {}
})

export const mutations = ({
    LOADING_MODAL(state, data) {
        state.loading.modal = data
    },

    LOADING_PAGE(state, data) {
        state.loading.page = data
    },

    SET_MODAL(state, data) {
        state.modal.show = data
    },

    SET_MODAL_PLAYER(state, player) {
        state.modal.player.data = player
    },

    SET_CONFIG(state, data) {
        state.config = data
    }
})

export const actions = ({
    setModal ({ commit }, data) {
        commit('SET_MODAL', data)
    },

    setModalPlayer({ commit }, href) {
        commit('LOADING_MODAL', true)

        this.$axios.get(href)
            .then(response => [
                commit('SET_MODAL_PLAYER', response.data.data[0]),
                commit('LOADING_MODAL', false)
            ]);
    },

    setConfig({ commit }, data) {
        commit('SET_CONFIG', data)
    },

    setLoading({ commit }) {
        commit('LOADING_PAGE', true)
    },

    clearLoading({ commit }) {
        commit('LOADING_PAGE', false)
    }
})

export const getters = ({
    getFranchiseId(state) {
        if (state.auth.loggedIn) {
            return state.auth.user.franchiseId
        }
    },

    getLoadingPage(state) {
        return state.loading.page
    },

    getModalPlayer(state) {
        return state.modal.player.data
    },

    getCurrentDate(state) {
        return state.config.date.currentDate
    },

    getCurrentMatchup(state) {
        return state.config.matchup.currentMatchup
    },

    getFranchiseTotal(state) {
        return state.config.franchise.total
    },

    getKing(state) {
        return state.config.awards.king
    },

    getKingScore(state) {
        return state.config.awards.king[0].score
    },

    getTurkey(state) {
        return state.config.awards.turkey
    },

    getTurkeyScore(state) {
        return state.config.awards.turkey[0].score
    },

    getDateYMD(state) {
        return (date) => {
            return state.config.date.season[date - 1].ymd
        }
    },

    getMatchupRange(state) {
        return (matchup, date) => {
            return state.config.matchup.season[matchup - 1][date]
        }
    },

    getFranchiseName(state) {
        return (franchiseId) => {
            return state.config.franchise.detail[franchiseId - 1].name
        }
    },

    getFranchiseTag(state) {
        return (franchiseId) => {
            return state.config.franchise.detail[franchiseId - 1].tag
        }
    },

    getCapHit(state) {
        return (franchiseId) => {
            return state.config.franchise.detail[franchiseId - 1].capHit
        }
    },

    getWaiverOrder(state) {
        return (franchiseId) => {
            return state.config.franchise.detail[franchiseId - 1].waiverOrder
        }
    },

    getGoalieStarts(state) {
        return (franchiseId) => {
            return state.config.franchise.detail[franchiseId - 1].goalieStarts
        }
    },

    getRosterSize(state) {
        return (franchiseId) => {
            return state.config.franchise.detail[franchiseId - 1].rosterSize
        }
    },

    getWeeklyAdds(state) {
        return (franchiseId) => {
            return state.config.franchise.detail[franchiseId - 1].weeklyAdds
        }
    }
})
