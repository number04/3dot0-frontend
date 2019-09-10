<template>
    <div class="players">
        <modal player />

        <section class="hero">
            <h1>players</h1>
        </section>

        <section class="icons">
            <div>
                <div>
                    <icon name="sign" h="20" w="20" color="#42a0a8" />
                    <span>:</span>
                    <span>{{ count.adds }}</span>
                </div>

                <div>
                    <icon name="waivers" h="20" w="20" color="#42a0a8" />
                    <span>:</span>
                    <span>{{ waiverOrder(franchiseId) }}</span>
                </div>
            </div>
        </section>

        <section class="actions">
            <div class="filters">
                <dropdown
                    class="type"
                    :options="dropdown.type.options"
                    :selected="dropdown.type.selected"
                    v-on:update="filterType" />

                <dropdown
                    class="position"
                    :options="dropdown.position.options"
                    :selected="dropdown.position.selected"
                    v-on:update="filterPosition" />

                <dropdown
                    class="team"
                    :options="dropdown.team.options"
                    :selected="dropdown.team.selected"
                    v-on:update="filterTeam" />

                <div class="search">
                    <input @keyup.enter="filterName(search)" placeholder="Search Player" type="text" v-model="search">
                    <button class="submit" v-if="search" @click="filterName(search)">search</button>
                    <button class="close" v-if="searched" @click="closeSearch()">x</button>
                </div>
            </div>
        </section>

        <section class="transaction">
            <transition name="fade"  mode="out-in">
                <div v-if="transaction.show">
                    <button
                        :class="{ 'disabled' : count.roster >= 30 && transaction.add != '' && transaction.drop == '' }"
                        class="submit"
                        @click="addDrop(transaction.add.playerId, transaction.drop.playerId)">

                        <span v-if="transaction.add != '' && !transaction.add.onWaivers">add {{transaction.add.playerNameShort}}</span>
                        <span v-if="transaction.add.onWaivers">claim {{transaction.add.playerNameShort}}</span>
                        <span v-if="transaction.add != ''">|</span>
                        <span v-if="transaction.drop != ''">drop {{transaction.drop.playerNameShort}}</span>
                        <span v-else>drop nobody</span>
                    </button>

                    <button class="cancel" @click="closeTransaction()">cancel</button>
                </div>
            </transition>
        </section>

        <section class="error">
            <transition name="fade"  mode="out-in">
                <div v-if="count.roster >= 30 && transaction.show && transaction.add != '' && transaction.drop == ''">
                    <span>error</span>
                    <span>| roster limit reached - drop player</span>
                </div>

                <div v-if="transaction.error">
                    <span>error</span>
                    <span>| {{ transaction.error }}</span>
                </div>
            </transition>
        </section>

        <section class="success">
            <transition name="fade"  mode="out-in">
                <div v-if="transaction.success.added || transaction.success.dropped ">
                    <span>success</span>
                    <span v-if="transaction.success.added">| added {{ transaction.success.added }}</span>
                    <span v-if="transaction.success.dropped">| dropped {{ transaction.success.dropped }}</span>

                    <button @click="clearSuccess()">x</button>
                </div>
            </transition>
        </section>

        <section class="claim">
            <div v-if="claim.data != ''" @click="claimDetail()">
                <span v-if="!claim.show">show waiver claims</span>
                <span v-else>hide waiver claims</span>
            </div>
        </section>

        <section class="claim-detail">
            <transition name="fade" mode="out-in">
                <div v-if="claim.show">
                    <div v-for="claim in claim.data">
                        <button @click="removeClaim(claim.claimId, claim.add.playerId, claim.drop.playerId)">
                            <span>x</span>
                        </button>

                        <span class="key">add:</span>
                        <span class="value">{{ claim.add.playerName }}</span>
                        <span v-if="claim.drop.playerName" class="key">drop:</span>
                        <span v-if="claim.drop.playerName" class="value">{{ claim.drop.playerName }}</span>
                        <span class="key">process:</span>
                        <span class="value">{{ claim.processDate }}</span>
                    </div>
                </div>
            </transition>
        </section>

        <section class="data">
            <span :class="{ 'filter-change' : filter.change }" />

            <div v-if="players.length">
                <table :class="classTable">
                    <thead v-if="filter.position === 'g'">
                        <tr>
                            <th>
                                <span></span>
                            </th>

                            <th>
                                <span>goalie</span>
                            </th>

                            <th>
                                <span>{{ formatedYMD(currentDate) }}</span>
                            </th>

                            <th @click="order('games_played')">
                                <span>gp</span>
                            </th>

                            <th @click="order('wins')">
                                <span>w</span>
                            </th>

                            <th @click="order('losses')">
                                <span>l</span>
                            </th>

                            <th @click="order('overtime_losses')">
                                <span>otl</span>
                            </th>

                            <th @click="order('saves')">
                                <span>sv</span>
                            </th>

                            <th @click="order('save_percentage')">
                                <span>sv%</span>
                            </th>

                            <th @click="order('goals_against_average')">
                                <span>gaa</span>
                            </th>
                        </tr>
                    </thead>

                    <thead v-else-if="filter.position === 't'">
                        <tr>
                            <th>
                                <span></span>
                            </th>

                            <th>
                                <span>team</span>
                            </th>

                            <th>
                                <span>{{ formatedYMD(currentDate) }}</span>
                            </th>

                            <th @click="order('games_played')">
                                <span>gp</span>
                            </th>

                            <th @click="order('wins')">
                                <span>w</span>
                            </th>

                            <th @click="order('losses')">
                                <span>l</span>
                            </th>

                            <th @click="order('overtime_losses')">
                                <span>otl</span>
                            </th>

                            <th @click="order('points_team')">
                                <span>p</span>
                            </th>

                            <th @click="order('goals_for')">
                                <span>gf</span>
                            </th>

                            <th @click="order('goals_against')">
                                <span>ga</span>
                            </th>
                        </tr>
                    </thead>

                    <thead v-else>
                        <tr>
                            <th>
                                <span></span>
                            </th>

                            <th>
                                <span>skaters</span>
                            </th>

                            <th>
                                <span>{{ formatedYMD(currentDate) }}</span>
                            </th>

                            <th @click="order('games_played')">
                                <span>gp</span>
                            </th>

                            <th @click="order('goals')">
                                <span>g</span>
                            </th>

                            <th @click="order('assists')">
                                <span>a</span>
                            </th>

                            <th @click="order('points_skater')">
                                <span>p</span>
                            </th>

                            <th @click="order('hits')">
                                <span>h</span>
                            </th>

                            <th @click="order('shots')">
                                <span>s</span>
                            </th>

                            <th @click="order('blocked_shots')">
                                <span>bs</span>
                            </th>

                            <th @click="order('faceoff_wins')">
                                <span>fow</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="player in players" :key="player.playerId">
                            <td v-if="!player.games.today.isActive && player.franchiseId === franchiseId">
                                <span class="locked">
                                    <icon name="locked" h="18" w="18" color="transparent" />
                                </span>
                            </td>

                            <td v-else>
                                <span class="fab toggle" :class="{ active: fab === player.playerId }" @click="fabActive(player.playerId)">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>

                                <span class="fab">
                                    <label>
                                        <icon v-if="player.watching != 1" name="target" h="16" w="16" color="#F79646" />
                                        <icon v-else name="target-fill" h="16" w="16" color="#F79646" />

                                        <input type="checkbox" v-model="player.watching" @change="watch(player.playerId, player.watching)">
                                    </label>
                                </span>

                                <span v-if="player.franchiseId === franchiseId && !claimed('drop', player.playerId)" class="fab" @click="fab = ''">
                                    <label>
                                        <icon name="drop" h="12" w="12" color="#F79646" />

                                        <input type="checkbox" @click="drop(player)">
                                    </label>
                                </span>

                                <span v-if="count.adds != 4 && player.franchiseId === 0" class="fab" @click="fab = ''">
                                    <label>
                                        <icon name="add" h="12" w="12" color="#F79646" />

                                        <input type="checkbox" @click="add(player)">
                                    </label>
                                </span>
                            </td>

                            <td :class="{ active: fab === player.playerId }">
                                <span @click="modalOpen(player.href)">{{ player.playerName }}</span>
                                <span @click="modalOpen(player.href)">{{ player.playerNameShort }}</span>
                                <span v-if="!player.positionSecondary">{{ player.position }}</span>
                                <span v-else>{{ player.position }},{{ player.positionSecondary }}</span>
                                <span>|</span>
                                <span>{{ player.nhl }}</span>
                                <icon v-if="player.isInjured" name="injury" h="12" w="12" color="#b86567" />
                                <icon v-if="player.franchiseId" :name="'franchise-' + player.franchiseId" w="12" h="12" color="#465771" />
                                <span v-if="player.onWaivers" class="waiver">
                                    <!-- <span>w</span>
                                    <span>|</span> -->
                                    <span>{{ player.onWaivers }}</span>
                                </span>

                            </td>

                            <td>
                                <span>{{ player.games.today.opponent }}</span>
                                <span v-if="player.games.today.gameTime">{{ formatedTime(player.games.today.gameTime) }}</span>
                            </td>
                            <td v-for="stat, key in player.stats" :class="sorted(key)">{{ stat }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="results">no results | check filters</div>

            <pagination v-if="players.length" :meta="filter.meta" />
        </section>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        data () {
            return {
                players: [],
                filter: {
                    change: false,
                    franchise: 0,
                    position: '',
                    team: '',
                    name: '',
                    watch: '',
                    page: 1,
                    meta: []
                },

                sort: {
                    stat: 'points_skater',
                    order: '-'
                },

                search: '',
                searched: false,
                fab: '',

                dropdown: {
                    type: {
                        options: ['free agents', 'watch list', 'all players', 'franchise'],
                        selected: 'free agents'
                    },

                    position: {
                        options: ['s', 'c', 'l', 'r', 'd', 'g', 't'],
                        selected: 's'
                    },

                    team: {
                        options: [
                            'all teams', 'ana', 'ari', 'bos', 'buf', 'car', 'cbj', 'cgy', 'chi', 'col', 'dal', 'det', 'edm', 'fla', 'lak', 'min', 'mtl', 'njd', 'nsh', 'nyi', 'nyr', 'ott', 'phi', 'pit', 'sjs', 'stl', 'tbl', 'tor', 'van', 'vgk', 'wpg', 'wsh'
                        ],
                        selected: 'all teams'
                    }
                },

                transaction: {
                    show: false,
                    add: [],
                    drop: [],
                    error: '',
                    success: {
                        added: '',
                        dropped: ''
                    }
                },

                claim: {
                    show: false,
                    data: []
                },

                count: {
                    roster: 0,
                    adds: 0
                }
            }
        },

        methods: {
            async getPlayers() {
                let response = await this.$axios.get(
                    '/' + this.currentDate + '/players?filter[franchise_id]=' + this.filter.franchise +
                    '&filter[nhl]=' + this.filter.team +
                    '&filter[position]=' + this.filter.position +
                    '&filter[player_name]=' + this.filter.name +
                    '&filter[watch]=' + this.filter.watch +
                    '&sort=' + this.sort.order + this.sort.stat + ',id' +
                    '&page=' + this.filter.page
                )

                this.players = response.data.data,
                this.filter.meta = response.data.meta
                this.filter.change = false
            },

            async getClaim() {
                let response = await this.$axios.get('/claim')

                this.claim.data = response.data.data.filter(claim => claim.franchiseId === this.franchiseId).filter(claim => claim.isProcessed === 0)
                this.count.roster = this.rosterSize(this.franchiseId) + this.countClaim('add') - this.countClaim('drop')
            },

            async removeClaim(claim, add, drop) {
                let response = await this.$axios.patch('/remove-claim', {
                    claim: claim,
                    franchise: this.franchiseId
                })

                if (!drop) {
                    this.count.roster = this.count.roster - 1
                    this.count.adds = this.count.adds - 1
                }

                if (drop) {
                    this.count.adds = this.count.adds - 1
                }

                this.getClaim()
            },

            async addDrop(add, drop) {
                if (this.count.roster >= 30 && this.transaction.add != '' && this.transaction.drop == '') {
                    return
                }

                let response = await this.$axios.patch('/add-drop', {
                    add: add,
                    drop: drop,
                    keeper: this.transaction.drop.keeper,
                    cap: this.transaction.drop.capHit,
                    franchise: this.franchiseId,
                    date: this.currentDate,
                    matchup: this.currentMatchup,
                    waiver: this.waiverOrder(this.franchiseId),
                    count: this.weeklyAdds(this.franchiseId)
                })

                if (!response.data.error) {
                    if (drop && !this.countClaim('drop')) {
                        this.count.roster = this.count.roster - 1
                    }

                    if (this.claimed('add', add) && this.countClaim('drop') && !drop) {
                        this.count.roster = this.count.roster + 1
                    }

                    if (add && !this.claimed('add', add)) {
                        this.count.roster = this.count.roster + 1
                        this.count.adds = this.count.adds + 1
                    }

                    this.transaction.success.added = response.data.added
                    this.transaction.success.dropped = response.data.dropped
                    this.getClaim()
                    this.closeTransaction()
                }

                this.transaction.error = response.data.error
            },

            async watch(player, watch) {
                let response = await this.$axios.patch('/watch', {
                    franchise: this.franchiseId,
                    player: player,
                    watch: watch
                })

                this.getPlayers()
            },

            modalOpen(href) {
                this.$store.dispatch('setModalPlayer', href)
                this.$store.dispatch('setModal', true)
            },

            add(player) {
                this.transaction.error = ''
                this.search = ''
                this.searched = false
                this.filter.name = ''
                this.filter.franchise = this.franchiseId
                this.transaction.show = true
                this.transaction.add = player
                this.filter.page = 1
                this.filter.watch = ''

                this.getPlayers()

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                })
            },

            drop(player) {
                this.transaction.error = ''
                this.transaction.show = true
                this.transaction.drop = player

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                })
            },

            formatedYMD(date) {
                let ymd = this.dateYMD(date)

                return moment(ymd).format('ddd, DD MMM')
            },

            formatedTime(time) {
                if (!time) {
                    return
                }

                return moment(time, 'HH:mm:ss').format('h:mm A')
            },

            closeTransaction() {
                this.transaction.show = false
                this.filter.franchise = 0
                this.dropdown.type.selected = 'free agents'
                this.transaction.add = []
                this.transaction.drop = []
                this.getPlayers()
            },

            closeSearch() {
                this.search = ''
                this.filter.name = ''
                this.filter.franchise = 0
                this.dropdown.type.selected = 'free agents'
                this.filter.team = ''
                this.dropdown.team.selected = 'all teams'
                this.filter.watch = ''
                this.sort.stat = 'points_skater'
                this.sort.order = '-'
                this.searched = false
                this.getPlayers()
            },

            order(value) {
                if (this.sort.stat != value) {
                    this.sort.order = '-'
                } else {
                    this.sort.order = (this.sort.order == '-') ? '' : '-'
                }

                this.sort.stat = value
                this.filter.page = 1
                this.getPlayers()
            },

            sorted(sort) {
                if (this.sort.stat === sort) {
                    return 'sort'
                }
            },

            fabActive(playerId) {
                this.fab = (this.fab == playerId) ? '' : playerId
            },

            filterType(value) {
                this.dropdown.type.selected = value
                this.filter.franchise = ''
                this.filter.watch = ''
                this.filter.page = 1

                if (value === 'all players') { this.filter.franchise = '' }
                if (value === 'free agents') { this.filter.franchise = 0 }
                if (value === 'watch list') { this.filter.watch = this.franchiseId }
                if (value === 'franchise') { this.filter.franchise = this.franchiseId }


                this.filter.change = true
                this.getPlayers()
            },

            filterPosition(value) {
                if (value != 's') { this.filter.position = value }
                if (value === 's') { this.filter.position = '' }

                if (value === 'g') {
                    this.sort.stat = 'wins'
                }

                if (value === 't') {
                    this.sort.stat = 'points_team'
                }

                this.dropdown.position.selected = value
                this.filter.change = true
                this.filter.page = 1
                this.getPlayers()
            },

            filterTeam(value) {
                if (value === 'all teams') { this.filter.team = '' }
                if (value != 'all teams') { this.filter.team = value }

                this.dropdown.team.selected = value
                this.filter.change = true
                this.filter.page = 1
                this.getPlayers()
            },

            filterName(value) {
                this.filter.name = value
                this.filter.franchise = ''
                this.dropdown.type.selected = 'all players'
                this.filter.team = ''
                this.dropdown.team.selected = 'all teams'
                this.filter.watch = ''
                this.sort.stat = 'points_skater'
                this.sort.order = '-'
                this.searched = true
                this.filter.change = true
                this.filter.page = 1
                this.getPlayers()
            },

            filterPage(value) {
                this.filter.page = value
                this.filter.change = true
                this.getPlayers()
            },

            countAdds() {
                this.count.adds = this.weeklyAdds(this.franchiseId)
            },

            countClaim(operator) {
                return this.claim.data.filter(claim => claim[operator].playerName).length
            },

            claimed(operator, player) {
                return this.claim.data.filter(claim => claim[operator].playerId === player).length
            },

            claimDetail() {
                this.claim.show = (this.claim.show == false) ? true : false
            },

            clearSuccess() {
                this.transaction.success.added = ''
                this.transaction.success.dropped = ''
            }
        },

        created() {
            this.$root.$on('page', (page) => {
                this.filterPage(page)

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                })
            }),

            this.interval = setInterval(() => this.getPlayers(), 300000)
        },

        computed: {
            dateYMD() {
                return this.$store.getters.getDateYMD
            },

            waiverOrder() {
                return this.$store.getters.getWaiverOrder
            },

            classTable() {
                return {
                  'goalie': this.filter.position === 'g',
                  'team': this.filter.position === 't'
                }
            }
        },

        mounted() {
            this.getPlayers()
            this.getClaim()
            this.countAdds()
        },

        beforeDestroy() {
          clearInterval(this.interval)
        }
    }
</script>
