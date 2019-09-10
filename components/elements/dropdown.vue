<template>
    <div class="dropdown">
        <li class="dropdown-toggle" :class="{ 'drop' : drop }" @click="toggle()">
            <span :class="{ 'toggle' : drop }">{{ selectedOption }}</span>
        </li>

        <transition name="dropdown">
            <ul class="dropdown-menu" ref="dropdown" v-if="drop">
                <li v-for="option in options">
                    <span :class="{ 'selected' : option === selectedOption }" @click="updateOption(option)">{{ option }}</span>
                </li>
            </ul>
        </transition>
    </div>
</template>

<script>
    export default {
        props: {
            selected: {},
            options: {
                type: [Array, Object]
            }
        },

        data() {
            return {
                drop: false,
                select: this.selected
            }
        },

        computed: {
            selectedOption() {
                return this.selected
            }
        },

        methods: {
            updateOption(option) {
                this.select = option
                this.drop = false
                window.removeEventListener("click", this.close)
                this.$emit('update', this.select)
            },

            toggle() {
                this.drop = !this.drop
                window.addEventListener("click", this.close)
            },

            close(e) {
                if (!this.$refs.dropdown.contains(e.target)) {
                    this.drop = false
                    window.removeEventListener("click", this.close)
                }
            }
        }
    }
</script>
