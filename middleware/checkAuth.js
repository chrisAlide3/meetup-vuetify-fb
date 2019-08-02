export default function(context) {
  if (context.app.$cookies.get('idToken') == undefined) {
    context.app.$cookies.set('routeGuardPath', context.route.path, {
      path: '/',
      maxAge: 60
    })
    context.redirect('/auth?isLogin=true')
  }
}