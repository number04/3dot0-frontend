<template>
    <div class="pagination" >
        <ul v-if="meta.last_page != 1">
            <li :class="{ 'disabled': meta.current_page === 1 }">
                <span @click="switched(meta.current_page - 1)">
                    <icon name="arrow-left" w="14" h="14" />
                </span>
            </li>

            <li :class="{' active': meta.current_page === 1 }">
                <span @click="switched(1)">1</span>
            </li>

            <li v-if="meta.current_page > 3" class="disabled">
                <span>...</span>
            </li>

            <li v-if="meta.current_page >= 3">
                <span @click="switched(meta.current_page - 1)">{{ meta.current_page - 1 }}</span>
            </li>

            <li v-if="meta.current_page != meta.last_page && meta.current_page != 1" class="active">
                <span>{{ meta.current_page }}</span>
            </li>

            <li v-if="meta.current_page <= ( meta.last_page - 2 )">
                <span @click="switched(meta.current_page + 1)">{{ meta.current_page + 1 }}</span>
            </li>

            <li v-if="meta.current_page < ( meta.last_page - 2 )" class="disabled">
                <span>...</span>
            </li>

            <li :class="{' active': meta.current_page === meta.last_page }">
                <span @click="switched(meta.last_page)">{{ meta.last_page }}</span>
            </li>

            <li :class="{ 'disabled': meta.current_page === meta.last_page }">
                <span @click="switched(meta.current_page + 1)">
                    <icon name="arrow-right" w="14" h="14" />
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: ['meta'],

        methods: {
            switched(page) {
                if (this.limit(page)) {
                    return
                }

                this.$root.$emit('page', page)
            },

            limit(page) {
                return page <= 0 || page > this.meta.last_page
            }
        }
    }
</script>
