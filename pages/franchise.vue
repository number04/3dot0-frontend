<template>
    <div class="franchise">
        <modal player />

        <section class="hero">
            <h1>{{ franchiseName(franchiseId) }}</h1>
        </section>

        <section class="icons">
            <div>
                <div :class="{ 'warning' : goalieStarts(franchiseId) < 3 }">
                    <icon name="starts" h="20" w="20" />
                    <span>:</span>
                    <span>{{ goalieStarts(franchiseId) }}</span>
                </div>

                <div :class="{ 'warning' : errorCap }">
                    <icon name="heart" h="20" w="20" />
                    <span>:</span>
                    <span>{{ franchise.cap }}</span>
                </div>

                <div>
                    <icon name="players" h="20" w="20" />
                    <span>:</span>
                    <span>{{ countRoster() }}</span>
                </div>
            </div>
        </section>

        <section class="actions">
            <div>
                <div class="date">
                    <button :class="{ 'disabled' : date === currentDate }" @click="previous()">
                        <span>
                            <icon name="arrow-left" w="14" h="14" />
                        </span>
                    </button>

                    <span>{{ formatedYMD(date) }}</span>

                    <button :class="{ 'disabled' : date === 189 }" @click="next()">
                        <span>
                            <icon name="arrow-right" w="14" h="14" />
                        </span>
                    </button>
                </div>

                <div class="lineup">
                    <button :class="{ 'disabled' : errorRoster || errorShow || errorDress || errorIR || errorInjury }" @click="lineup()">
                        <span>set lineup</span>
                    </button>
                </div>
            </div>
        </section>

        <section class="error">
            <transition name="fade"  mode="out-in">
                <div v-if="errorRoster || errorShow || errorDress || errorIR || errorInjury">
                    <span>error</span>
                    <span v-if="errorRoster">| roster > 30</span>
                    <span v-if="errorShow">| active roster > 26</span>
                    <span v-if="errorDress">| numbers dressed</span>
                    <span v-if="errorIR">| IR > 2</span>
                    <span v-if="errorInjury">| ineligible player on IR</span>
                </div>
            </transition>
        </section>

        <section v-if="warning" class="warning">
            <transition name="fade"  mode="out-in">
                <div v-if="warningDress">
                    <span>warning</span>

                    <!-- <span v-if="this.warningRoster">
                        | {{ 30 - this.countRoster() }} roster spot<span style="text-transform: lowercase" v-if="this.countRoster() < 29">s</span> open
                    </span> -->

                    <span v-if="this.count.skater.c < 4">| C open</span>
                    <span v-if="this.count.skater.l < 4">| L open</span>
                    <span v-if="this.count.skater.r < 4">| R open</span>
                    <span v-if="this.count.skater.d < 4">| D open</span>
                    <span v-if="this.count.skater.s < 1">| S open</span>
                    <span v-if="this.count.goalie.g < 2">| G open</span>
                    <span v-if="this.count.team.t < 2">| T open</span>
                </div>
            </transition>
        </section>

        <section class="success">
            <transition name="fade"  mode="out-in">
                <div v-if="success">
                    <span>success</span>
                    <span>| {{ success }}</span>

                    <button @click="clearSuccess()">x</button>
                </div>
            </transition>
        </section>

        <section class="claim">
            <transition name="fade"  mode="out-in">
                <div v-if="claims">
                    <div v-for="claim in claims">
                        <button @click="confirmClaim(claim.claimId)">
                            <span>x</span>
                        </button>

                        <span v-if="claim.isSuccessfull" class="key">claim successfull</span>
                        <span v-else class="key">claim failed</span>
                        <span class="key">add:</span>
                        <span class="value">{{ claim.add.playerName }}</span>
                        <span v-if="claim.drop.playerName" class="key">drop:</span>
                        <span v-if="claim.drop.playerName" class="value">{{ claim.drop.playerName }}</span>
                    </div>
                </div>
            </transition>
        </section>

        <section class="data">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <span></span>
                            </th>

                            <th>
                                <span>skaters</span>
                            </th>

                            <th>
                                <span></span>
                            </th>

                            <th>
                                <span>gp</span>
                            </th>

                            <th>
                                <span>g</span>
                            </th>

                            <th>
                                <span>a</span>
                            </th>

                            <th>
                                <span>p</span>
                            </th>

                            <th>
                                <span>h</span>
                            </th>

                            <th>
                                <span>s</span>
                            </th>

                            <th>
                                <span>b</span>
                            </th>

                            <th>
                                <span>fow</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody class="dress">
                        <trLineup v-for="player in roster('skater', 'c')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tbody class="dress">
                        <trLineup v-for="player in roster('skater', 'l')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tbody class="dress">
                        <trLineup v-for="player in roster('skater', 'r')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tbody class="dress">
                        <trLineup v-for="player in roster('skater', 'd')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tbody class="dress">
                        <trLineup v-for="player in roster('skater', 's')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tbody class="bench">
                        <trLineup v-for="player in roster('skater', 'b')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tbody class="injury">
                        <trLineup v-for="player in roster('skater', 'i')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tbody class="farm">
                        <trLineup v-for="player in roster('skater', 'f')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tfoot />
                </table>
            </div>

            <div>
                <table class="goalie">
                    <thead>
                        <tr>
                            <th>
                                <span></span>
                            </th>

                            <th>
                                <span>goalies</span>
                            </th>

                            <th>
                                <span></span>
                            </th>

                            <th>
                                <span>gp</span>
                            </th>

                            <th>
                                <span>w</span>
                            </th>

                            <th>
                                <span>l</span>
                            </th>

                            <th>
                                <span>otl</span>
                            </th>

                            <th>
                                <span>sv</span>
                            </th>

                            <th>
                                <span>sv%</span>
                            </th>

                            <th>
                                <span>gaa</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody class="dress">
                        <trLineup v-for="player in roster('goalie', 'g')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tbody class="bench">
                        <trLineup v-for="player in roster('goalie', 'b')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tbody class="injury">
                        <trLineup v-for="player in roster('goalie', 'i')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tbody class="farm">
                        <trLineup v-for="player in roster('goalie', 'f')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tfoot />
                </table>
            </div>

            <div>
                <table class="team">
                    <thead>
                        <tr>
                            <th>
                                <span></span>
                            </th>

                            <th>
                                <span>teams</span>
                            </th>

                            <th>
                                <span></span>
                            </th>

                            <th>
                                <span>gp</span>
                            </th>

                            <th>
                                <span>w</span>
                            </th>

                            <th>
                                <span>l</span>
                            </th>

                            <th>
                                <span>otl</span>
                            </th>

                            <th>
                                <span>p</span>
                            </th>

                            <th>
                                <span>gf</span>
                            </th>

                            <th>
                                <span>ga</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody class="dress">
                        <trLineup v-for="player in roster('team', 't')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tbody class="bench">
                        <trLineup v-for="player in roster('team', 'b')" :key="player.playerId" :player="player" />
                    </tbody>

                    <tfoot />
                </table>
            </div>
        </section>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        data () {
            return {
                franchise: {
                    cap: '',
                    skater: [],
                    goalie: [],
                    team: []
                },

                claims: [],

                count: {
                    skater: {
                        c: 0,
                        l: 0,
                        r: 0,
                        d: 0,
                        s: 0,
                        b: 0,
                        i: 0,
                        f: 0,
                        x: 0
                    },

                    goalie: {
                        g: 0,
                        b: 0,
                        i: 0,
                        f: 0,
                        x: 0
                    },

                    team: {
                        t: 0,
                        b: 0
                    }
                },

                warning: false,
                success: '',
                date: this.$store.state.config.date.currentDate
            }
        },

        methods: {
            async getFranchise() {
                let response = await this.$axios.get(
                    '/' + this.date + '/franchises?filter[id]=' + this.franchiseId
                )

                this.franchise = response.data.data[0]
                this.warning = true
                this.clearSuccess()
            },

            async getClaim() {
                let response = await this.$axios.get('/claim')

                this.claims = response.data.data.filter(claim => claim.franchiseId === this.franchiseId)
                    .filter(claim => claim.isProcessed === 1)
                    .filter(claim => claim.isConfirmed === 0)
            },

            async lineup() {
                if (this.errorRoster || this.errorShow || this.errorDress || this.errorIR || this.errorInjury) {
                    return
                }

                let players = this.franchise.skater.concat(this.franchise.goalie,this.franchise.team)
                let response = await this.$axios.patch('/lineup', {
                    date: this.date,
                    players: players
                })

                this.success = response.data.lineup
            },

            async confirmClaim(claim) {
                let response = await this.$axios.patch('/confirm-claim', {
                    claim: claim
                })

                this.getClaim()
            },

            roster(player, lineup) {
                this.countLineup(player, lineup)

                return this.franchise[player].filter(players => players.games.today.lineup === lineup)
            },

            next() {
                this.date = this.date + 1
                this.getFranchise()
            },

            previous() {
                if (this.currentDate != this.date) {
                    this.date = this.date - 1
                    this.getFranchise()
                }
            },

            formatedYMD(date) {
                let ymd = this.dateYMD(date)

                return moment(ymd).format('ddd, DD MMM')
            },

            countLineup(player, lineup) {
                this.count[player][lineup] = this.franchise[player].filter(players => players.games.today.lineup === lineup).length

                this.count[player].x = this.franchise[player].filter(players => players.games.today.lineup === 'i')
                    .filter(players => players.isInjured === 'n').length
            },

            countRoster() {
                let skater = Object.values(this.count.skater).reduce((a, b) => a + b)
                let goalie = Object.values(this.count.goalie).reduce((a, b) => a + b)
                let team = Object.values(this.count.team).reduce((a, b) => a + b)

                return skater + goalie + team - this.count.skater.i - this.count.goalie.i
            },

            clearSuccess() {
                this.success = ''
            }
        },

        computed: {
            dateYMD() {
                return this.$store.getters.getDateYMD
            },

            errorCap() {
                return this.franchise.cap > 40
            },

            errorRoster() {
                return this.countRoster() > 30
            },

            errorShow() {
                return this.countRoster() - this.count.skater.f - this.count.goalie.f > 26
            },

            errorIR () {
                return this.count.skater.i + this.count.goalie.i > 2
            },

            errorInjury () {
                return this.count.skater.x + this.count.goalie.x > 0
            },

            errorDress() {
                let skater = this.count.skater
                let goalie = this.count.goalie
                let team = this.count.team

                return skater.c > 4 || skater.l > 4 || skater.r > 4 || skater.d > 4 || skater.s > 1 || goalie.g > 2 || team.t > 2
            },

            warningRoster() {
                return this.countRoster() < 30
            },

            warningDress() {
                let skater = this.count.skater
                let goalie = this.count.goalie
                let team = this.count.team

                return skater.c < 4 || skater.l < 4 || skater.r < 4 || skater.d < 4 || skater.s < 1 || goalie.g < 2 || team.t < 2
            }
        },

        created() {
            this.$root.$on('cap', (value) => {
                if (value[0]) {
                    return this.franchise.cap = (this.franchise.cap + value[1])
                }

                return this.franchise.cap = (this.franchise.cap - value[1])
            }),

            this.interval = setInterval(() => this.getFranchise(), 300000);
        },

        mounted() {
            this.getFranchise()
            this.getClaim()
        },

        beforeDestroy() {
          clearInterval(this.interval)
        }
    }
</script>
