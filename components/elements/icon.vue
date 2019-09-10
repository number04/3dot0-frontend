<template>
    <svg :width="w" :height="h" :fill="color">
        <use :xlink:href="'#' + name"/>
    </svg>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                default: ''
            },
            w: {
                type: [Number, String],
                default: 32
            },
            h: {
                type: [Number, String],
                default: 32
            },
            color: {
                type: String,
                default: function () {
                    if (this.name == 'franchise-1') { return '#222d3e' }
                    if (this.name == 'franchise-2') { return '#175a8d' }
                    if (this.name == 'franchise-3') { return '#598544' }
                    if (this.name == 'franchise-4') { return '#573534' }
                    if (this.name == 'franchise-5') { return '#c92336' }
                    if (this.name == 'franchise-6') { return '#887a7a' }
                    if (this.name == 'franchise-7') { return '#a59079' }
                    if (this.name == 'franchise-8') { return '#333c73' }

                    return 'currentColor'
                }
            }
        }
    }
</script>
