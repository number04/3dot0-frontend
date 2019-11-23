export default function (context) {
     if (process.server) {
         context.store.dispatch('setLoading')
     }
}
