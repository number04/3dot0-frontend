<template>
    <div class="login">
        <form role="form" @submit.prevent="submit">
            <input type="text" placeholder="Email" name="email" v-model="form.email">

            <input type="password" placeholder="Password" name="password" v-model="form.password">

            <button type="submit">
                <span>login</span>
            </button>
        </form>
    </div>
</template>

<script>
    export default {
        auth: false,
        
        data () {
            return {
                form: {
                    email: '',
                    password: ''
                }
            }
        },

        methods: {
           async submit () {
               await this.$auth.loginWith('local', {
                   data: this.form
               })

               this.$router.replace({
                   name: 'index'
               })
            }
        }
    }
</script>
