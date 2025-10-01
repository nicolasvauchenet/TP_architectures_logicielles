export async function create(req, res, next) {
  try {
    const { reservation } = req.app.locals.services;
    const created = await reservation.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

export async function listByConcert(req, res, next) {
  try {
    const { reservation } = req.app.locals.services;
    const concertId = Number(req.params.concertId);
    const data = await reservation.listByConcert(concertId);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
