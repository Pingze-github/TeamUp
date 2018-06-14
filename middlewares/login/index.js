
module.exports = function login() {
  return async (ctx, next) => {
    console.log(ctx.method, ctx.url,  ctx.session.user);
    if (ctx.url === '/login') {
      if (ctx.method.toLowerCase() === 'post') {
        if (ctx.request.body.username === 'root') {
          ctx.session.user = {
            username: ctx.request.body.username
          };
          return ctx.body = 1
        }
        return ctx.body = 0
      }

      if (ctx.session.user) {
        return ctx.redirect('/');
      }
      return await ctx.render('login');
    }
    if (ctx.url === '/logout') {
      ctx.session = {};
      return ctx.redirect('/');
    }
    if (!ctx.session.user) return ctx.redirect('/login');
    await next();
  }
};

