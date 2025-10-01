export async function list(req, res, next) {
  try {
    const { artist } = req.app.locals.services;
    const data = await artist.list();
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const { artist } = req.app.locals.services;
    const created = await artist.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}
