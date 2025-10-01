export async function list(req, res, next) {
  try {
    const { concert } = req.app.locals.services;
    const data = await concert.list();
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function get(req, res, next) {
  try {
    const { concert } = req.app.locals.services;
    const id = Number(req.params.id);
    const data = await concert.get(id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const { concert } = req.app.locals.services;
    const created = await concert.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}
