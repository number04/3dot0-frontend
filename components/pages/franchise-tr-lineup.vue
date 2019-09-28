<template>
    <tr>
        <td v-if="!player.games.today.isActive">
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

            <!-- dress/bench -->

            <span class="fab">
                <label v-if="player.games.today.lineup != 'b'">
                    <icon name="bench" h="16" w="16" color="transparent" />

                    <input type="checkbox" @change="lineup('b')"/>
                </label>

                <label v-else>
                    <icon v-if="player.position === 'c'" name="center" h="14" w="14" color="transparent" />
                    <icon v-if="player.position === 'l'" name="left-wing" h="14" w="14" color="transparent" />
                    <icon v-if="player.position === 'r'" name="right-wing" h="14" w="14" color="transparent" />
                    <icon v-if="player.position === 'd'" name="defense" h="14" w="14" color="transparent" />
                    <icon v-if="player.position === 'g'" name="goalie" h="14" w="14" color="transparent" />
                    <icon v-if="player.position === 't'" name="team" h="14" w="14" color="transparent" />

                    <input type="checkbox" @change="lineup(player.position)" />
                </label>
            </span>

            <span v-if="player.positionSecondary && player.games.today.lineup != 'i' && player.games.today.lineup != 'f'" class="fab">
                <label v-if="player.games.today.lineup != player.positionSecondary">
                    <icon v-if="player.positionSecondary === 'c'" name="center" h="14" w="14" color="transparent" />
                    <icon v-if="player.positionSecondary === 'l'" name="left-wing" h="14" w="14" color="transparent" />
                    <icon v-if="player.positionSecondary === 'r'" name="right-wing" h="14" w="14" color="transparent" />
                    <icon v-if="player.positionSecondary === 'd'" name="defense" h="14" w="14" color="transparent" />

                    <input type="checkbox" @change="lineup(player.positionSecondary)" />
                </label>

                <label v-else>
                    <icon v-if="player.position === 'c'" name="center" h="14" w="14" color="transparent" />
                    <icon v-if="player.position === 'l'" name="left-wing" h="14" w="14" color="transparent" />
                    <icon v-if="player.position === 'r'" name="right-wing" h="14" w="14" color="transparent" />
                    <icon v-if="player.position === 'd'" name="defense" h="14" w="14" color="transparent" />

                    <input type="checkbox" @change="lineup(player.position)" />
                </label>
            </span>

            <span
                v-if="player.games.today.lineup != 'i' &&
                player.games.today.lineup != 'f' &&
                player.position != 'g' &&
                player.position != 't'"
                class="fab">

                <label v-if="player.games.today.lineup != 's'">
                    <icon name="skater" h="14" w="14" color="transparent" />

                    <input type="checkbox" @change="lineup('s')" />
                </label>

                <label v-else>
                    <icon v-if="player.position === 'c'" name="center" h="14" w="14" color="transparent" />
                    <icon v-if="player.position === 'l'" name="left-wing" h="14" w="14" color="transparent" />
                    <icon v-if="player.position === 'r'" name="right-wing" h="14" w="14" color="transparent" />
                    <icon v-if="player.position === 'd'" name="defense" h="14" w="14" color="transparent" />

                    <input type="checkbox" @change="lineup(player.position)" />
                </label>
            </span>

            <!-- injury -->

            <span v-if="player.isInjured == 1 && player.games.today.lineup != 'i'" class="fab">
                <label>
                    <icon name="injury" h="16" w="16" color="transparent" />

                    <input type="checkbox" @change="lineup('i')" />
                </label>
            </span>

            <!-- farm -->

            <span v-if="player.isRookie && player.games.today.lineup != 'f'" class="fab">
                <label>
                    <icon name="farm" h="16" w="16" color="transparent" />

                    <input type="checkbox" @change="lineup('f')" />
                </label>
            </span>

            <!-- keeper -->

            <span v-if="player.draft != 'fa'" class="fab" @click="fab = ''">
                <label>
                    <icon v-if="player.keeper != 1" name="heart" h="16" w="16" color="transparent" />
                    <icon v-else name="heart-fill" h="16" w="16" color="transparent" />

                    <input
                        type="checkbox"
                        v-model="player.keeper"
                        :true-value="1"
                        :false-value="0"
                        @change="keeper(player.playerId, player.keeper, player.capHit)" />
                </label>
            </span>
        </td>

        <td :class="{ active: fab === player.playerId }">
            <span @click="modalOpen(player.href)">{{ player.playerName }}</span>
            <span v-if="!player.positionSecondary">{{ player.position }}</span>
            <span v-else>{{ player.position }},{{ player.positionSecondary }}</span>
            <span>|</span>
            <span>{{ player.nhl }}</span>
            <icon v-if="player.isInjured == 1" name="injury" h="12" w="12" color="#b86567" />
            <icon v-if="player.isInjured == 2" name="out" h="12" w="12" color="#b86567" />
            <icon v-if="player.keeper" name="heart-fill" h="12" w="12" color="#7489a9" />
        </td>

        <td>
            <span>{{ player.games.today.opponent }}</span>
            <span v-if="player.games.today.gameTime">{{ formatedTime(player.games.today.gameTime) }}</span>
        </td>

        <td v-for="stat in player.stats" :key="stat.id">{{ stat }}</td>
    </tr>
</template>

<script>
    import moment from 'moment'

    export default {
        props: ['player'],

        data () {
            return {
                fab: '',
            }
        },

        methods: {
            async keeper(player, keeper, cap) {
                let response = await this.$axios.patch('/keeper', {
                    player: player,
                    keeper: keeper,
                    franchise: this.franchiseId,
                    cap: cap
                })

                this.$root.$emit('cap', [keeper, cap])
            },

            modalOpen(href) {
                this.$store.dispatch('setModalPlayer', href)
                this.$store.dispatch('setModal', true)
            },

            fabActive(playerId) {
                this.fab = (this.fab == playerId) ? '' : playerId
            },

            lineup(state) {
                this.player.games.today.lineup = state
            },

            formatedTime(time) {
                if (!time) {
                    return
                }

                return moment(time, 'HH:mm:ss').format('h:mm A')
            },
        }
    }
</script>
