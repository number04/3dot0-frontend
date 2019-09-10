<template>
    <div class="rosters">
        <modal player />

        <section class="hero">
            <h1>rosters</h1>
        </section>

        <section class="actions">
            <div>
                <div class="needs">
                    <label :class="{ 'active' : franchise.needs.p == 1 }">
                        <span>p</span>

                        <input type="checkbox" v-model="franchise.needs.p" :true-value="1" @change="need('p')" />
                    </label>

                    <label :class="{ 'active' : franchise.needs.c == 1 }">
                        <span>c</span>

                        <input type="checkbox" v-model="franchise.needs.c" :true-value="1" @change="need('c')" />
                    </label>

                    <label :class="{ 'active' : franchise.needs.l == 1 }">
                        <span>l</span>

                        <input type="checkbox" v-model="franchise.needs.l" :true-value="1" @change="need('l')" />
                    </label>

                    <label :class="{ 'active' : franchise.needs.r == 1 }">
                        <span>r</span>

                        <input type="checkbox" v-model="franchise.needs.r" :true-value="1" @change="need('r')" />
                    </label>

                    <label :class="{ 'active' : franchise.needs.d == 1 }">
                        <span>d</span>

                        <input type="checkbox" v-model="franchise.needs.d" :true-value="1" @change="need('d')" />
                    </label>

                    <label :class="{ 'active' : franchise.needs.g == 1 }">
                        <span>g</span>

                        <input type="checkbox" v-model="franchise.needs.g" :true-value="1" @change="need('g')" />
                    </label>

                    <label :class="{ 'active' : franchise.needs.t == 1 }">
                        <span>t</span>

                        <input type="checkbox" v-model="franchise.needs.t" :true-value="1" @change="need('t')" />
                    </label>
                </div>

                <div class="spacer" />

                <div class="filters">
                    <dropdown
                        class="roster"
                        :options="dropdown.roster.options"
                        :selected="dropdown.roster.selected"
                        v-on:update="filterFranchise" />
                </div>
            </div>
        </section>

        <section class="data">
            <div>
                <div>
                    <table class="skaters">
                        <thead>
                            <tr>
                                <th>
                                    <span>{{ franchiseName(franchiseId) }}</span>
                                </th>
                            </tr>

                            <tr>
                                <th>
                                    <span>
                                        <p v-for="(value, key) in testing()" :key="value.id">
                                            <template v-if="value == 1">{{ key }}</template>
                                        </p>
                                    </span>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <trRoster v-for="player in franchises('skater', 'c')" :key="player.playerId" :player="player" :franchise="true" />
                        </tbody>

                        <tbody>
                            <trRoster v-for="player in franchises('skater', 'l')" :key="player.playerId" :player="player" :franchise="true" />
                        </tbody>

                        <tbody>
                            <trRoster v-for="player in franchises('skater', 'r')" :key="player.playerId" :player="player" :franchise="true" />
                        </tbody>

                        <tbody>
                            <trRoster v-for="player in franchises('skater', 'd')" :key="player.playerId" :player="player" :franchise="true" />
                        </tbody>
                    </table>
                </div>

                <div>
                    <table>
                        <tbody>
                            <trRoster v-for="player in franchises('goalie', 'g')" :key="player.playerId" :player="player" :franchise="true" />
                        </tbody>
                    </table>
                </div>

                <div>
                    <table>
                        <tbody>
                            <trRoster v-for="player in franchises('team', 't')" :key="player.playerId" :player="player" :franchise="true" />
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="filter.id" class="selected">
                <div>
                    <table class="skaters">
                        <thead>
                            <tr>
                                <th>
                                    <span>
                                        <p>{{ franchiseName(filter.id) }}</p>

                                        <nuxt-link to="/">
                                            <icon name="trade" h="16" w="16" color="#f79646" />
                                        </nuxt-link>
                                    </span>
                                </th>
                            </tr>

                            <tr>
                                <th>
                                    <span>
                                        <p v-for="(value, key) in testing('roster')" :key="value.id">
                                            <template v-if="value == 1">{{ key }}</template>
                                        </p>
                                    </span>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <trRoster v-for="player in rosters('skater', 'c')" :key="player.playerId" :player="player" :franchise="false" />
                        </tbody>

                        <tbody>
                            <trRoster v-for="player in rosters('skater', 'l')" :key="player.playerId" :player="player" :franchise="false" />
                        </tbody>

                        <tbody>
                            <trRoster v-for="player in rosters('skater', 'r')" :key="player.playerId" :player="player" :franchise="false" />
                        </tbody>

                        <tbody>
                            <trRoster v-for="player in rosters('skater', 'd')" :key="player.playerId" :player="player" :franchise="false" />
                        </tbody>
                    </table>
                </div>

                <div>
                    <table>
                        <tbody>
                            <trRoster v-for="player in rosters('goalie', 'g')" :key="player.playerId" :player="player" :franchise="false" />
                        </tbody>
                    </table>
                </div>

                <div>
                    <table>
                        <tbody>
                            <trRoster v-for="player in rosters('team', 't')" :key="player.playerId" :player="player" :franchise="false" />
                        </tbody>
                    </table>
                </div>
            </div>


            <!-- <div v-if="filter.id === 0" class="select">
                <div>
                    <span>please select team to compare rosters</span>
                </div>
            </div> -->
        </section>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                franchise: {
                    needs: [],
                    skater: [],
                    goalie: [],
                    team: []
                },

                roster: {
                    needs: [],
                    skater: [],
                    goalie: [],
                    team: []
                },

                filter: {
                    id: 0,
                    change: false
                },

                dropdown: {
                    roster: {
                        options: [],
                        selected: 'franchise',
                        ids: []
                    }
                }
            }
        },

        methods: {
            async getFranchise() {
                let response = await this.$axios.get(
                    '/' + this.currentDate + '/franchises?filter[id]=' + this.franchiseId
                )

                this.franchise = response.data.data[0]
                this.optionFranchise()
            },

            async getRoster() {
                let response = await this.$axios.get(
                    '/' + this.currentDate + '/franchises?filter[id]=' + this.filter.id
                )

                this.roster = response.data.data[0]
            },

            async need(need) {
                let response = await this.$axios.patch('/need', {
                    franchise: this.franchiseId,
                    need: need
                })
            },

            franchises(player, position) {
                return this.franchise[player].filter(players => players.position === position)
            },

            rosters(player, position) {
                if (this.roster) {
                    return this.roster[player].filter(players => players.position === position)
                }

                return
            },

            optionFranchise() {
                let franchises = this.$store.state.config.franchise.detail
                let total = this.$store.state.config.franchise.total
                let keys = []
                let i
                let x = 1

                this.dropdown.roster.options = []
                this.dropdown.roster.ids = []

                for (i = 0; i < franchises.length; i++) {
                  this.dropdown.roster.options.push(franchises[i].tag)
                }

                while (x <= total) {
                        keys.push(x)
                        x++
                }

                this.dropdown.roster.ids = Object.assign(...keys.map((k, i) => ({[k]: this.dropdown.roster.options[i]})))
                this.dropdown.roster.options.unshift('franchise')
                this.dropdown.roster.options.splice(this.franchiseId, 1)
            },

            filterFranchise(value) {
                if (value === 'franchise') { this.filter.id = 0 }

                if (value != 'franchise') {
                    this.filter.id = Object.keys(this.dropdown.roster.ids).find(key => this.dropdown.roster.ids[key] === value)
                }

                this.filter.change = true
                this.dropdown.roster.selected = value

                this.getRoster()
            },

            testing(value) {
                if (value === 'roster' && this.roster) {
                    return this.roster.needs
                }

                return this.franchise.needs
            }
        },

        mounted() {
            this.getFranchise()
        }
    }
</script>
