export default function(context) {
  console.log('context', context)
  if (context.app.$cookies.get('idToken') == undefined) {
    context.redirect('/auth?isLogin=true')
  }
}