<template>
    <tr>
        <td>
            <span @click="modalOpen(player.href)">{{ player.playerName }}</span>
            <span v-if="!player.positionSecondary">{{ player.position }}</span>
            <span v-else>{{ player.position }},{{ player.positionSecondary }}</span>
            <span>|</span>
            <span>{{ player.nhl }}</span>
            <icon v-if="player.isInjured == 1" name="injury" h="12" w="12" color="#b86567" />
        </td>

        <td v-for="stat in player.stats" :key="stat.id">{{ stat }}</td>
    </tr>
</template>

<script>
    export default {
        props: ['player'],

        data () {
            return {

            }
        },

        methods: {
            modalOpen(href) {
                this.$store.dispatch('setModalPlayer', href)
                this.$store.dispatch('setModal', true)
            },
        }
    }
</script>
