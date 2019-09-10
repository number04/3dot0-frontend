<template>
    <tr>
        <td v-if="franchise">
            <span class="fab toggle" :class="{ active: fab === player.playerId }" @click="fabActive(player.playerId)">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </span>

            <!-- block -->

            <span class="fab">
                <label>
                    <icon v-if="player.block != 1" name="suitcase" h="16" w="16" color="transparent" />
                    <icon v-else name="suitcase-fill" h="16" w="16" color="transparent" />

                    <input
                        type="checkbox"
                        v-model="player.block"
                        :true-value="1"
                        :false-value="0"
                        @change="block(player.playerId, player.block)"
                        @click="fab = ''" />
                </label>
            </span>
        </td>

        <td :class="{ active: fab === player.playerId }">
            <span @click="modalOpen(player.href)">{{ player.playerNameShort }}</span>
            <span v-if="!player.positionSecondary">{{ player.position }}</span>
            <span v-else>{{ player.position }},{{ player.positionSecondary }}</span>
            <span>|</span>
            <span>{{ player.nhl }}</span>
            <icon v-if="player.isInjured" name="injury" h="12" w="12" color="#b86567" />
            <icon v-if="player.block" name="suitcase-fill" h="12" w="12" color="#7489a9" />
        </td>
    </tr>
</template>

<script>
    import moment from 'moment'

    export default {
        props: ['player', 'franchise'],

        data () {
            return {
                fab: '',
            }
        },

        methods: {
            async block(player, block) {
                let response = await this.$axios.patch('/block', {
                    player: player,
                    block: block
                })
            },

            modalOpen(href) {
                this.$store.dispatch('setModalPlayer', href)
                this.$store.dispatch('setModal', true)
            },

            fabActive(playerId) {
                this.fab = (this.fab == playerId) ? '' : playerId
            }
        }
    }
</script>
