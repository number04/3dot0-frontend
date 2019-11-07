<template>
    <div class="scoreboard">
        <loading v-if="loadingPage" />

        <modal player />

        <section class="hero">
            <h1>scoreboard</h1>
        </section>

        <section class="actions">
            <div class="filters">
                <div class="matchup">
                    <button :class="{ 'disabled' : matchup === 1 }" @click="previous()">
                        <span>
                            <icon name="arrow-left" w="14" h="14" />
                        </span>
                    </button>

                    <span>{{ matchup }}</span>

                    <button :class="{ 'disabled' : matchup === currentMatchup }" @click="next()">
                        <span>
                            <icon name="arrow-right" w="14" h="14" />
                        </span>
                    </button>
                </div>

                <div class="spacer" />

                <dropdown
                    v-if="filter.id != 0"
                    class="range"
                    :options="dropdown.range.options"
                    :selected="dropdown.range.selected"
                    v-on:update="filterRange" />

                <dropdown
                    v-else
                    class="stat"
                    :options="dropdown.stat.options"
                    :selected="dropdown.stat.selected"
                    v-on:update="filterStat" />

                <dropdown
                    class="franchise-matchup"
                    :options="dropdown.franchise.options"
                    :selected="dropdown.franchise.selected"
                    v-on:update="filterFranchise" />
            </div>
        </section>

        <section class="data">
            <div class="table-info" v-if="filter.id === 0">
                <div>
                    <table>
                        <thead>
                            <tr>
                                <!-- <th>m{{ currentMatchup }}</th> -->
                                <th/>
                                <th v-for="n in franchiseTotal">
                                    <icon :name="'franchise-' + n" w="16" h="16" color="#465771" />
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>
                                    <icon name="starts" w="18" h="18" />
                                </td>

                                <td v-for="n in franchiseTotal">{{ goalieStarts(n) }}</td>
                            </tr>

                            <tr>
                                <td>
                                    <icon name="sign" w="18" h="18" />
                                </td>

                                <td v-for="n in franchiseTotal">{{ weeklyAdds(n) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="table-totals" v-if="filter.id === 0">
                <span :class="{ 'filter-change' : filter.rank }" />

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>tot</th>
                                <th>gp</th>
                                <th>g</th>
                                <th>a</th>
                                <th>pts</th>
                                <th>h</th>
                                <th>s</th>
                                <th>b</th>
                                <th>fow</th>
                                <th>gp</th>
                                <th>sv</th>
                                <th>sv%</th>
                                <th>gaa</th>
                                <th>gp</th>
                                <th>pts</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="rank in ranks" :key="rank.franchise_id" @click="e => e.currentTarget.classList.toggle('show')">
                                <td>
                                    <span>{{ franchiseName(rank.franchise_id) }}</span>

                                    <span>
                                        <icon :name="'franchise-' + rank.franchise_id" w="18" h="18" color="#465771" />
                                    </span>
                                </td>

                                <td>
                                    <span>{{ rank.r_total }}</span>
                                </td>

                                <td>
                                    <span class="th-small">
                                        <icon name="starts" h="18" w="18" color="#42a0a8" />
                                    </span>

                                    <span class="dots-small" />
                                    <span>{{ goalieStarts(rank.franchise_id) }}</span>
                                </td>

                                <td>
                                    <span class="th-small">
                                        <icon name="sign" h="18" w="18" color="#42a0a8" />
                                    </span>

                                    <span class="dots-small" />
                                    <span>{{ weeklyAdds(rank.franchise_id) }}</span>
                                </td>

                                <td>
                                    <span class="th-small">gp</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.skater.games_played }}</span>
                                </td>

                                <td :class="{ 'tops' : rank.rank.goals === '1' }">
                                    <span class="th-small">g</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.skater.goals }}</span>
                                </td>

                                <td :class="{ 'tops' : rank.rank.assists === '1' }">
                                    <span class="th-small">a</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.skater.assists }}</span>
                                </td>

                                <td :class="{ 'tops' : rank.rank.pointsSkater === '1' }">
                                    <span class="th-small">pts</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.skater.points_skater }}</span>
                                </td>

                                <td :class="{ 'tops' : rank.rank.hits === '1' }">
                                    <span class="th-small">h</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.skater.hits }}</span>
                                </td>

                                <td :class="{ 'tops' : rank.rank.shots === '1' }">
                                    <span class="th-small">s</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.skater.shots }}</span>
                                </td>

                                <td :class="{ 'tops' : rank.rank.blockedShots === '1' }">
                                    <span class="th-small">b</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.skater.blocked_shots }}</span>
                                </td>

                                <td :class="{ 'tops' : rank.rank.faceoffWins === '1' }">
                                    <span class="th-small">fow</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.skater.faceoff_wins }}</span>
                                </td>

                                <td>
                                    <span class="th-small">gp</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.goalie.games_played }}</span>
                                </td>

                                <td :class="{ 'tops' : rank.rank.saves === '1' }">
                                    <span class="th-small">sv</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.goalie.saves }}</span>
                                </td>

                                <td :class="{ 'tops' : rank.rank.savePercentage === '1' }">
                                    <span class="th-small">svp</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.goalie.save_percentage }}</span>
                                </td>

                                <td :class="{ 'tops' : rank.rank.goalsAgainstAverage === '1' }">
                                    <span class="th-small">gaa</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.goalie.goals_against_average }}</span>
                                </td>

                                <td>
                                    <span class="th-small">gp</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.team.games_played }}</span>
                                </td>

                                <td :class="{ 'tops' : rank.rank.pointsTeam === '1' }">
                                    <span class="th-small">pts</span>
                                    <span class="dots-small" />
                                    <span>{{ rank.stats.team.points_team }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="table-matchup" v-else-if="dropdown.range.selected === 'matchup'">
                <span :class="{ 'filter-change' : filter.scoreboard }" />

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>skaters</th>
                                <th>gp</th>
                                <th>g</th>
                                <th>a</th>
                                <th>pts</th>
                                <th>h</th>
                                <th>s</th>
                                <th>b</th>
                                <th>fow</th>
                            </tr>
                        </thead>

                        <tbody>
                            <trMatchup
                                v-for="player in players.matchup"
                                :key="player.id"
                                v-if="player.position === 'c'"
                                :player="player" />
                        </tbody>

                        <tbody>
                            <trMatchup
                                v-for="player in players.matchup"
                                :key="player.id"
                                v-if="player.position === 'l'"
                                :player="player" />
                        </tbody>

                        <tbody>
                            <trMatchup
                                v-for="player in players.matchup"
                                :key="player.id"
                                v-if="player.position === 'r'"
                                :player="player" />
                        </tbody>

                        <tbody>
                            <trMatchup
                                v-for="player in players.matchup"
                                :key="player.id"
                                v-if="player.position === 'd'"
                                :player="player" />
                        </tbody>
                    </table>
                </div>

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>goales</th>
                                <th>gp</th>
                                <th>w</th>
                                <th>l</th>
                                <th>otl</th>
                                <th>sv</th>
                                <th>sv%</th>
                                <th>gaa</th>
                            </tr>
                        </thead>

                        <tbody>
                            <trMatchup
                                v-for="player in players.matchup"
                                :key="player.id"
                                v-if="player.position === 'g'"
                                :player="player" />
                        </tbody>

                        <tfoot />
                    </table>
                </div>

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>teams</th>
                                <th>gp</th>
                                <th>w</th>
                                <th>l</th>
                                <th>otl</th>
                                <th>pts</th>
                                <th>gf</th>
                                <th>ga</th>
                            </tr>
                        </thead>

                        <tbody>
                            <trMatchup
                                v-for="player in players.matchup"
                                :key="player.id"
                                v-if="player.position === 't'"
                                :player="player" />
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="table-daily" v-else>
                <span :class="{ 'filter-change' : filter.scoreboard }" />

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>skaters</th>
                                <th>game</th>
                                <th>gp</th>
                                <th>g</th>
                                <th>a</th>
                                <th>pts</th>
                                <th>h</th>
                                <th>s</th>
                                <th>b</th>
                                <th>fow</th>
                            </tr>
                        </thead>

                        <tbody class="dress">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'c'"
                                :player="player" />
                        </tbody>

                        <tbody class="dress">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'l'"
                                :player="player" />
                        </tbody>

                        <tbody class="dress">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'r'"
                                :player="player" />
                        </tbody>

                        <tbody class="dress">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'd'"
                                :player="player" />
                        </tbody>

                        <tbody class="dress">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 's'"
                                :player="player" />
                        </tbody>

                        <tbody class="bench">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'b' && player.position != 'g' && player.position != 't'"
                                :player="player" />
                        </tbody>

                        <tbody class="farm">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'f' && player.position != 'g' && player.position != 't'"
                                :player="player" />
                        </tbody>

                        <tbody class="injury">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'i' && player.position != 'g' && player.position != 't'"
                                :player="player" />
                        </tbody>
                    </table>
                </div>

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>goales</th>
                                <th>game</th>
                                <th>gp</th>
                                <th>w</th>
                                <th>l</th>
                                <th>otl</th>
                                <th>sv</th>
                                <th>sv%</th>
                                <th>gaa</th>
                            </tr>
                        </thead>

                        <tbody class="dress">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'g'"
                                :player="player" />
                        </tbody>

                        <tbody class="bench">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'b' && player.position === 'g'"
                                :player="player" />
                        </tbody>

                        <tbody class="farm">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'f' && player.position === 'g'"
                                :player="player" />
                        </tbody>

                        <tbody class="injury">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'i' && player.position === 'g'"
                                :player="player" />
                        </tbody>
                    </table>
                </div>

                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>teams</th>
                                <th>game</th>
                                <th>gp</th>
                                <th>w</th>
                                <th>l</th>
                                <th>otl</th>
                                <th>pts</th>
                                <th>gf</th>
                                <th>ga</th>
                            </tr>
                        </thead>

                        <tbody class="dress">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 't'"
                                :player="player" />
                        </tbody>

                        <tbody class="bench">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'b' && player.position === 't'"
                                :player="player" />
                        </tbody>

                        <tbody class="farm">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'f' && player.position === 't'"
                                :player="player" />
                        </tbody>

                        <tbody class="injury">
                            <trDaily
                                v-for="player in players.daily"
                                :key="player.id"
                                v-if="player.games.today.lineup === 'i' && player.position === 't'"
                                :player="player" />
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        data () {
            return {
                players: {
                    matchup: [],
                    daily: []
                },

                adds: [],

                filter: {
                    id: 0,
                    scoreboard: false,
                    rank: false
                },

                sort: {
                    stat: 'r_total',
                    order: '-'
                },

                ranks: [],

                matchup: this.$store.state.config.matchup.currentMatchup,
                date: this.$store.state.config.date.currentDate,
                dropdown: {
                    range: {
                        options: [],
                        selected: 'matchup',
                        dates: []
                    },

                    franchise: {
                        options: [],
                        selected: 'totals',
                        ids: []
                    },

                    stat: {
                        options: [],
                        selected: 'score',
                        sort: []
                    }

                }

            }
        },

        methods: {
            async getScoreboard() {
                let response = await this.$axios.get('/' + this.date + '/scoreboard:' + this.matchup + '?filter[id]=' + this.filter.id)

                if (this.filter.id != 0 ) {
                    this.players.daily = response.data.data[0].daily,
                    this.players.matchup = response.data.data[0].matchup
                }

                this.range()
                this.franchise()
                this.filter.scoreboard = false
            },

            async getRank() {
                let response = await this.$axios.get('/rank:' + this.matchup + '?sort=' + this.sort.order + this.sort.stat + ',franchise_id')

                this.ranks = response.data.data

                this.stat()
                this.filter.rank = false
                this.$store.dispatch('clearLoading')
            },

            next() {
                if (this.matchup != this.currentMatchup) {
                    this.matchup = this.matchup + 1
                    this.filter.id = 0
                    this.dropdown.range.selected = 'matchup'
                    this.dropdown.franchise.selected = 'totals'
                    this.dropdown.stat.selected = 'score'
                    this.sort.stat = 'r_total'
                    this.filter.scoreboard = true
                    this.filter.rank = true
                    this.getRank()
                    this.getScoreboard()
                }
            },

            previous() {
                this.matchup = this.matchup - 1
                this.filter.id = 0
                this.dropdown.range.selected = 'matchup'
                this.dropdown.franchise.selected = 'totals'
                this.dropdown.stat.selected = 'score'
                this.sort.stat = 'r_total'
                this.filter.scoreboard = true
                this.filter.rank = true
                this.getRank()
                this.getScoreboard()
            },

            stat() {
                this.dropdown.stat.options = []
                this.dropdown.stat.sort = []

                this.dropdown.stat.options = [
                    'score',
                    'goals',
                    'assists',
                    'points',
                    'shots',
                    'hits',
                    'blocked shots',
                    'faceoff wins',
                    'saves',
                    'SV%',
                    'GAA',
                    'team points'
                ]

                this.dropdown.stat.sort = [
                    'r_total',
                    'goals',
                    'assists',
                    'points_skater',
                    'shots',
                    'hits',
                    'blocked_shots',
                    'faceoff_wins',
                    'saves',
                    'save_percentage',
                    'goals_against_average',
                    'points_team'
                ]
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
                this.dropdown.franchise.options.unshift('totals')
            },

            range() {
                let startYMD = moment(this.matchupRange(this.matchup, 'startYMD'))
                let endYMD = moment(this.matchupRange(this.matchup, 'endYMD'))
                let startDate = this.matchupRange(this.matchup, 'startDate')
                let endDate = this.matchupRange(this.matchup, 'endDate')
                let keys = []

                this.dropdown.range.options = []
                this.dropdown.range.dates = []

                while (startYMD.isSameOrBefore(endYMD)) {
                    this.dropdown.range.options.push(startYMD.format('ddd, DD MMM'))
                    startYMD.add(1, 'days')
                }

                while (startDate <= endDate) {
                    keys.push(startDate)
                    startDate++
                }

                this.dropdown.range.dates = Object.assign(...keys.map((k, i) => ({[k]: this.dropdown.range.options[i]})))
                this.dropdown.range.options.unshift('matchup')
            },

            filterFranchise(value) {
                if (value === 'totals') { this.filter.id = 0 }

                if (value != 'totals') {
                    this.filter.id = Object.keys(this.dropdown.franchise.ids).find(key => this.dropdown.franchise.ids[key] === value)
                }

                this.filter.scoreboard = true
                this.dropdown.franchise.selected = value
                this.getScoreboard()
            },

            filterRange(value) {
                if (value != 'matchup') {
                    this.date = Object.keys(this.dropdown.range.dates).find(key => this.dropdown.range.dates[key] === value)
                }

                this.filter.scoreboard = true
                this.dropdown.range.selected = value
                this.getScoreboard()
            },

            filterStat(value) {
                let key = Object.keys(this.dropdown.stat.options).find(key => this.dropdown.stat.options[key] === value)

                if (value === 'GAA') {
                    this.stat.order = ''
                } else {
                    this.stat.order = '-'
                }

                this.sort.stat = this.dropdown.stat.sort[key]
                this.filter.rank = true
                this.dropdown.stat.selected = value
                this.getRank()
            }
        },

        computed: {
            matchupRange() {
                return this.$store.getters.getMatchupRange
            },

            franchiseTotal() {
                return this.$store.getters.getFranchiseTotal
            }
        },

        mounted() {
            this.getScoreboard()
            this.getRank()
        }
    }
</script>
