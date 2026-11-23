export function validate(schemas) {
  return (req, _res, next) => {
    try {
      const validated = {};

      if (schemas.body) {
        validated.body = schemas.body.parse(req.body);
        req.body = validated.body;
      }

      if (schemas.params) {
        validated.params = schemas.params.parse(req.params);
      }

      if (schemas.query) {
        validated.query = schemas.query.parse(req.query);
      }

      req.validated = validated;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
