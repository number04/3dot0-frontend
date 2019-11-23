<template>
    <div class="trade">
        <section class="review">
            <div>
                <div>
                    <span>trade partner:</span>
                    <span v-if="partner.franchiseId">
                        <icon :name="'franchise-' + partner.franchiseId" />
                    </span>
                </div>

                <div>
                    <span>trade for:</span>
                    <span v-for="player in trade.playerFor">{{ player.playerNameShort }}</span>
                </div>

                <div>
                    <span>trade away:</span>
                    <span v-for="player in trade.playerAway">{{ player.playerNameShort }}</span>
                </div>
            </div>

            <div>

            </div>
        </section>

        <section class="steps">
            <div>
                <div class="hero">
                    <p>trade</p>
                </div>

                <div :class="{ 'active' : activeStep === 1 }" @click="activeStep = 1">
                    <span v-if="activeStep === 1" class="label">select franchise</span>
                    <span class="dot" />
                </div>

                <div :class="{ 'active' : activeStep === 2 }" @click="activeStep = 2">
                    <span v-if="activeStep === 2" class="label">trade for</span>
                    <span class="dot" />
                </div>

                <div :class="{ 'active' : activeStep === 3 }" @click="activeStep = 3">
                    <span v-if="activeStep === 3" class="label">trade away</span>
                    <span class="dot" />
                </div>
            </div>
        </section>

        <section class="data">
            <div>
                <transition name='fade' mode="out-in">
                    <div v-if="activeStep === 1"  key="one" class="step one">
                        <div v-for="n in franchiseTotal" v-if="franchiseId != n">
                            <span :class="{ 'selected' : partner.franchiseId === n }" @click="selectPartner(n)">
                                <icon :name="'franchise-' + n" />
                            </span>
                        </div>
                    </div>

                    <div v-else-if="activeStep === 2"  key="two" class="step-two">
                        <dropdown
                            class="player"
                            :options="dropdown.partner.player.options"
                            :selected="dropdown.partner.player.selected"
                            v-on:update="playerFor" />
                    </div>

                    <div v-else="activeStep === 3" key="three" class="step-three">
                        <dropdown
                            class="player"
                            :options="dropdown.franchise.player.options"
                            :selected="dropdown.franchise.player.selected"
                            v-on:update="playerAway" />
                    </div>
                </transition>
            </div>
        </section>

        <section class="actions">
            <button :class="{ 'disabled' : activeStep === 1 }" @click="previous()">
                <span>previous</span>
            </button>

            <nuxt-link to="/rosters">
                <span>cancel</span>
            </nuxt-link>

            <button :class="{ 'disabled' : activeStep === 4 }" @click="next()">
                <span>next</span>
            </button>
        </section>

    </div>
</template>

<script>
    export default {
        layout: 'alternate',

        data () {
            return {
                activeStep: 1,
                franchise: {
                    franchiseId: 0,
                    franchiseName: '',
                    players: []
                },

                partner: {
                    franchiseId: 0,
                    franchiseName: '',
                    players: []
                },

                trade: {
                    playerFor: [],
                    playerAway: [],
                    // pickFor: [],
                    // pickAway: []
                },

                dropdown: {
                    partner: {
                        player: {
                            options: [],
                            selected: 'select player',
                            ids: []
                        }
                    },

                    franchise: {
                        player: {
                            options: [],
                            selected: 'select player',
                            ids: []
                        }
                    }
                }
            }
        },

        methods: {
            async getFranchise() {
                let response = await this.$axios.get(
                    '/' + this.currentDate + '/franchises?filter[id]=' + this.franchiseId
                )

                let skaters = response.data.data[0].skater
                let goalies = response.data.data[0].goalie
                let teams = response.data.data[0].team

                this.franchise.franchiseId = response.data.data[0].franchiseId
                this.franchise.franchiseName = response.data.data[0].franchiseName
                this.franchise.players = skaters.concat(goalies).concat(teams)

                this.optionPlayer('franchise')
            },

            async getPartner() {
                let response = await this.$axios.get(
                    '/' + this.currentDate + '/franchises?filter[id]=' + this.partner.franchiseId
                )

                let skaters = response.data.data[0].skater
                let goalies = response.data.data[0].goalie
                let teams = response.data.data[0].team

                this.partner.franchiseName = response.data.data[0].franchiseName
                this.partner.players = skaters.concat(goalies).concat(teams)
                this.optionPlayer('partner')
            },

            selectPartner(franchise) {
                this.partner.franchiseId = (this.partner.franchiseId == franchise) ? 0 : franchise
                this.trade.playerFor = []
                this.trade.playerAway = []

                this.getPartner()
            },

            optionPlayer(option) {

                let players = this[option].players
                let keys = []
                let i

                this.dropdown[option].player.options = []
                this.dropdown[option].player.ids = []

                for (i = 0; i < players.length; i++) {
                  this.dropdown[option].player.options.push(players[i].playerNameShort)
                  keys.push(players[i].playerId)
                }

                 this.dropdown[option].player.ids =
                    Object.assign(...keys.map((k, i) => ({[k]: this.dropdown[option].player.options[i]})))
            },

            playerFor(value) {
                let x = new Object()

                x.playerNameShort = value
                x.playerId = Object.keys(this.dropdown.partner.player.ids)
                                .find(key => this.dropdown.partner.player.ids[key] === value)

                this.trade.playerFor.push(x)

                // remove duplicates
                this.trade.playerFor = this.trade.playerFor.filter((playerFor, index, self) =>
                    index === self.findIndex((t) => (
                        t.playerId === playerFor.playerId
                    ))
                )
            },

            playerAway(value) {
                let x = new Object()

                x.playerNameShort = value
                x.playerId = Object.keys(this.dropdown.franchise.player.ids)
                                .find(key => this.dropdown.franchise.player.ids[key] === value)

                this.trade.playerAway.push(x)

                // remove duplicates
                this.trade.playerAway = this.trade.playerAway.filter((playerAway, index, self) =>
                    index === self.findIndex((t) => (
                        t.playerId === playerAway.playerId
                    ))
                )
            },

            next() {
                this.activeStep = this.activeStep + 1
            },

            previous () {
                this.activeStep = this.activeStep - 1
            }
        },

        computed: {
            franchiseTotal() {
                return this.$store.getters.getFranchiseTotal
            }
        },

        mounted() {
            this.getFranchise()
        },

        beforeDestroy() {
          this.$store.dispatch('setLoading')
        }

    }
</script>
