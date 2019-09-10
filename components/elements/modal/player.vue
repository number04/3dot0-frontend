<template>
    <div class="modal-player">
        <section class="modal-header">
            <div>
                <span>{{ player.playerName }}</span>
                <span v-if="!player.positionSecondary">{{ player.position }} | {{ player.nhl }}</span>
                <span v-else>{{ player.position }},{{ player.positionSecondary }} | {{ player.nhl }}</span>
            </div>

            <div :class="franchise">
                <icon :name="franchise" h="14" w="14" color="white" />
            </div>

            <div>
                <span class="key">contract:</span>
                <span class="value">{{ player.draftContract }}</span>
                <span v-if="player.contractStatus" class="value">{{ player.contractStatus }}</span>
                <span v-if="player.draftContract != 'fa-1' && player.draftContract != 'fa-0'" class="divider">|</span>
                <span v-if="player.draftContract != 'fa-1' && player.draftContract != 'fa-0'" class="key">cap hit:</span>
                <span v-if="player.draftContract != 'fa-1' && player.draftContract != 'fa-0'" class="value">{{ player.capHit }}</span>
                <span class="divider">|</span>
                <span class="key">age:</span>
                <span class="value">{{ player.age }}</span>
            </div>
        </section>

        <section class="modal-content">
            <table>
                <thead v-if="player.position === 'g'">
                    <tr>
                        <th>gp</th>
                        <th>w</th>
                        <th>l</th>
                        <th>otl</th>
                        <th>sv</th>
                        <th>svp</th>
                        <th>gaa</th>
                    </tr>
                </thead>

                <thead v-else-if="player.position === 't'">
                    <tr>
                        <th>gp</th>
                        <th>w</th>
                        <th>l</th>
                        <th>otl</th>
                        <th>p</th>
                        <th>gf</th>
                        <th>ga</th>
                    </tr>
                </thead>

                <thead v-else>
                    <tr>
                        <th>gp</th>
                        <th>g</th>
                        <th>a</th>
                        <th>p</th>
                        <th>h</th>
                        <th>s</th>
                        <th>b</th>
                        <th>fow</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td v-for="stat in player.stats">{{ stat }}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead v-if="player.position === 'g'">
                    <tr>
                        <th>games</th>
                        <th>w/l</th>
                        <th>ga</th>
                        <th>sv</th>
                        <th>svp</th>
                        <th>gaa</th>
                    </tr>
                </thead>

                <thead v-else-if="player.position === 't'">
                    <tr>
                        <th>games</th>
                        <th>w/l</th>
                        <th>p</th>
                        <th>gf</th>
                        <th>ga</th>
                    </tr>
                </thead>

                <thead v-else>
                    <tr>
                        <th>games</th>
                        <th>g</th>
                        <th>a</th>
                        <th>p</th>
                        <th>h</th>
                        <th>s</th>
                        <th>b</th>
                        <th>fow</th>
                    </tr>
                </thead>

                <tbody v-for="games in player.games">
                    <tr v-for="game in games">
                        <td>
                            <span>{{ game.date }}</span>
                            <span>|</span>
                            <span>{{ game.opponent }}</span>
                        </td>
                        <td v-for="stats in game.stats">{{ stats }}</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="modal-footer">
            <button @click="closeModal">close</button>
        </section>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                confirm: false,
            }
        },

        methods: {
            closeModal() {
                this.$store.dispatch('setModal', false)
            },

            confirmDrop() {
                this.confirm = (this.confirm == false) ? true : false
            },
        },

        computed: {
            player() {
                return this.$store.getters.getModalPlayer
            },

            games() {
                return this.$store.getters.getModalPlayer
            },

            franchise() {
                return 'franchise-' + this.$store.getters.getModalPlayer.franchiseId
            }
        }
    }
</script>
