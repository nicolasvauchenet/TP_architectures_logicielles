export async function occupancy(req, res, next) {
  try {
    const { report } = req.app.locals.services;
    const data = await report.occupancy();
    res.json(data);
  } catch (e) {
    next(e);
  }
}
