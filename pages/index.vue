<template>
    <div class="landing">
        <loading v-if="loadingPage" />

        <modal player />

        <section class="hero">
            <icon name="franchise-1" color="#82c8ce" />
            <icon name="franchise-2" color="#82c8ce" />
            <icon name="franchise-3" color="#82c8ce" />
            <icon name="franchise-4" color="#82c8ce" />
            <icon name="franchise-5" color="#82c8ce" />
            <icon name="franchise-6" color="#82c8ce" />
            <icon name="franchise-7" color="#82c8ce" />
            <icon name="franchise-8" color="#82c8ce" />
        </section>

        <section class="actions">
            <div>
                <dropdown
                    class="franchise-transaction"
                    :options="dropdown.franchise.options"
                    :selected="dropdown.franchise.selected"
                    v-on:update="filterFranchise" />

                <dropdown
                    class="type"
                    :options="dropdown.type.options"
                    :selected="dropdown.type.selected"
                    v-on:update="filterType" />
            </div>
        </section>

        <!-- <section class="trade">
            <transition name="fade"  mode="out-in">
                <div v-if="trade">

                </div>
            </transition>
        </section> -->

        <section class="data transaction-detail">
            <div>
                <table>
                    <caption>transactions</caption>

                    <tbody>
                        <tr v-for="trans in transactions">
                            <td v-if="trans.transaction.type === 'drop'">
                                <icon name="drop" h="14" w="14" color="#42a0a8" />
                            </td>

                            <td v-else>
                                <icon :name="trans.transaction.type" h="18" w="18" color="#42a0a8" />
                            </td>

                            <td>
                                <span @click="modalOpen(trans.transaction.player.href)">{{ trans.transaction.player.playerName }}</span>
                                <span v-if="!trans.transaction.player.positionSecondary">{{ trans.transaction.player.position }}</span>
                                <span v-else>{{ trans.transaction.player.position }},{{ trans.transaction.player.positionSecondary }}</span>
                                <span>|</span>
                                <span>{{ trans.transaction.player.nhl }}</span>
                                <icon v-if="trans.transaction.player.isInjured" name="injury" h="12" w="12" color="#b86567" />
                            </td>

                            <td>
                                <icon :name="'franchise-' + trans.franchiseId" w="18" h="18" color="#42a0a8" />
                            </td>

                            <td>{{ trans.transaction.date }}</td>
                        </tr>
                    </tbody>

                    <tbody v-if="!transactions[0]" class="empty">
                        <tr>
                            <td>
                                <span>no transactions | check filters</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <span></span>
                            </th>

                            <th>
                                <span>
                                    <icon name="waivers" h="18" w="18" color="#42a0a8" />
                                </span>
                            </th>

                            <th>
                                <span>
                                    <icon name="sign" h="18" w="18" color="#42a0a8" />
                                </span>
                            </th>

                            <th>
                                <span>
                                    <icon name="drop" h="18" w="18" color="#42a0a8" />
                                </span>
                            </th>

                            <th>
                                <span>
                                    <icon name="trade" h="18" w="18" color="#42a0a8" />
                                </span>
                            </th>

                            <th>
                                <span>
                                    <icon name="king" h="18" w="18" color="#42a0a8" />
                                </span>
                            </th>

                            <th>
                                <span>
                                    <icon name="turkey" h="18" w="18" color="#42a0a8" />
                                </span>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="franchise in detail">
                            <td>
                                <span>{{ franchiseName(franchise.id) }}</span>
                                <span>|</span>
                                <span>{{ franchiseTag(franchise.id) }}</span>

                            </td>
                            <td>{{ franchise.waiverOrder }}</td>
                            <td>{{ franchise.sign}}</td>
                            <td>{{ franchise.release }}</td>
                            <td>{{ franchise.trade }}</td>
                            <td>{{ franchise.king }}</td>
                            <td>{{ franchise.turkey }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="awards">
                    <div>
                        <span>
                            <icon name="king" color="#42a0a8" />
                        </span>

                        <div>
                            <p v-if="currentMatchup === 1">matchup king</p>
                            <p v-else>matchup {{ currentMatchup - 1 }} king</p>

                            <p>
                                <span v-for="id in king">{{ franchiseTag(id.franchise_id) }}</span>
                                <span v-if="king[0]">{{ king[0].score }}</span>
                                <span v-else>-</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <span>
                            <icon name="turkey" color="#42a0a8" />
                        </span>

                        <div>
                            <p v-if="currentMatchup === 1">matchup turkey</p>
                            <p v-else>matchup {{ currentMatchup - 1 }} turkey</p>

                            <p>
                                <span v-for="id in turkey">{{ franchiseTag(id.franchise_id) }}</span>
                                <span v-if="turkey[0]">{{ turkey[0].score }}</span>
                                <span v-else>-</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="data standing">
            <div>
                <table>
                    <caption>
                        <span></span>
                        <span>skater</span>

                        <span></span>
                        <span>goalie</span>

                        <span></span>
                        <span>team</span>

                        <!-- <dropdown
                            class="franchise-transaction"
                            :options="dropdown.franchise.options"
                            :selected="dropdown.franchise.selected"
                            v-on:update="filterFranchise" /> -->
                    </caption>

                    <tbody>
                        <tr v-for="total in standing.totals" >

                            <td :style="{ width: total.total/standing.topScore * 100 + '%' }">

                                <span :style="{ width: total.skater/total.total * 100 + '%' }">
                                    <span>
                                        <icon :name="'franchise-' + total.franchiseId" h="18" w="18" color="#42a0a8" />
                                    </span>

                                    <span>{{ total.total }}</span>
                                    <span>{{ total.skater }}</span>
                                </span>

                                <span :style="{ width: total.goalie/total.total * 100 + '%' }">{{ total.goalie }}</span>

                                <span :style="{ width: total.team/total.total * 100 + '%' }">{{ total.team }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                transactions: [],
                detail: [],
                standing: {
                    matchup: [],
                    totals:[],
                    isLoading: true,
                    topScore: ''
                },

                filter: {
                    franchise: '',
                    type: '',
                    standing: ''
                },

                matchup: this.$store.state.config.matchup.currentMatchup,

                dropdown: {
                    franchise: {
                        options: [],
                        selected: 'all teams',
                        ids: []
                    },
                    type: {
                        options: ['all transactions', 'add', 'drop', 'trade'],
                        selected: 'all transactions'
                    },
                    standings: {
                        options: [],
                        selected: 'franchise',
                        sort: []
                    }
                }
            }
        },

        methods: {
            async getTransaction() {
                let response = await this.$axios.get(
                    '/transaction?filter[franchise_id]=' + this.filter.franchise + '&filter[type]=' + this.filter.type
                )

                this.transactions = response.data.data
                this.franchise()
            },

            async getFranchiseDetail() {
                let response = await this.$axios.get('/config')

                this.detail = response.data.data.franchise.detail.sort(function (a, b) {
                    return a.waiverOrder - b.waiverOrder;
                })
            },

            async getStanding() {
                let response = await this.$axios.get('/standing:' + this.matchup + '?filter[id]=' + this.filter.standing)

                this.standing.matchup = response.data.data
                this.standing.totals = response.data.totals[0]
                this.standing.topScore = response.data.totals[0][0]['total']
                this.$store.dispatch('clearLoading')
            },

            modalOpen(href) {
                this.$store.dispatch('setModalPlayer', href)
                this.$store.dispatch('setModal', true)
            },

            franchise() {
                let franchises = this.$store.state.config.franchise.detail
                let total = this.$store.state.config.franchise.total
                let keys = []
                let i
                let x = 1

                this.dropdown.franchise.options = []
                this.dropdown.franchise.ids = []

                for (i = 0; i < franchises.length; i++) {
                  this.dropdown.franchise.options.push(franchises[i].tag)
                }

                while (x <= total) {
                        keys.push(x)
                        x++
                }

                this.dropdown.franchise.ids = Object.assign(...keys.map((k, i) => ({[k]: this.dropdown.franchise.options[i]})))
                this.dropdown.franchise.options.unshift('all teams')
            },

            filterFranchise(value) {
                if (value === 'all teams') { this.filter.franchise = '' }

                if (value != 'all teams') {
                    this.filter.franchise = Object.keys(this.dropdown.franchise.ids).find(key => this.dropdown.franchise.ids[key] === value)
                }

                this.dropdown.franchise.selected = value
                this.getTransaction()
            },

            filterType(value) {
                if (value === 'all transactions') { this.filter.type = '' }

                if (value != 'all transactions') {
                    this.filter.type = value
                }

                this.dropdown.type.selected = value
                this.getTransaction()
            }
        },

        computed: {
            king() {
                return this.$store.getters.getKing
            },

            turkey() {
                return this.$store.getters.getTurkey
            }
        },

        mounted() {
            this.getTransaction()
            this.getFranchiseDetail()
            this.getStanding()
        }
    }
</script>
