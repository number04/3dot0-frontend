<template>
    <div class="login">
        <form role="form" @submit.prevent="submit">
            <input type="text" placeholder="Email" name="email" v-model="form.email">

            <input type="text" placeholder="Full Name" name="name" v-model="form.name">

            <input type="password" placeholder="Password" name="password" v-model="form.password">

            <button type="submit">
                <span>register</span>
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
                    name: '',
                    password: ''
                }
            }
        },

        methods: {
           async submit () {
               await this.$axios.post('register', this.form)

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
