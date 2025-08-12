const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  const protectedRoutes = [
    { method: 'POST', path: ['/attendance', '/timeOffs', '/salaries', '/tasks', '/work_rates'] },
    { method: 'PATCH', path: ['/users', '/tasks'] },
    { method: 'DELETE', path: ['/attendance', '/timeOffs', '/tasks'] }
  ];

  const isProtected = protectedRoutes.some(route =>
    route.method === req.method &&
    (Array.isArray(route.path) ? route.path.some(p => req.path.startsWith(p)) : req.path.startsWith(route.path))
  );

  if (isProtected) {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const db = router.db;
    const user = db.get('users').find({ id: userId }).value();
    if (!user) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }

    if (req.method === 'POST') {
      req.body.userId = userId;
    }
    next();
  } else {
    next();
  }
});

server.use(router);
server.listen(3000, '192.168.100.210', () => {
  console.log('JSON Server is running on http://192.168.100.210:3000');
});