<template>
    <transition name="modal">
        <div class="modal-background" v-if="show" @click="closeModal">
            <div class="modal-container" @click.stop>
                <loading v-if="loadingModal" />

                <player v-if="player" />
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            player: {
                type: Boolean,
                default: false
            }
        },

        methods: {
            closeModal() {
                this.$store.dispatch('setModal', false)
            }
        },

        computed: {
            show: function () {
                return this.$store.state.modal.show
            },

            loadingModal() {
                return this.$store.state.loading.modal
            }
        }
    }
</script>
