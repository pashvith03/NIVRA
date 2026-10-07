// backend/middleware/validate.js — zod request validation
// validate({ body, query, params }) replaces each part with the parsed (coerced, stripped) value.
function validate(schemas) {
  return (req, res, next) => {
    for (const part of ['params', 'query', 'body']) {
      if (!schemas[part]) continue;
      const result = schemas[part].safeParse(req[part] ?? {});
      if (!result.success) {
        const issue = result.error.issues[0];
        const field = issue.path.join('.');
        return res.status(400).json({ error: field ? `${field}: ${issue.message}` : issue.message });
      }
      // Express 5 exposes req.query as a getter, so store parsed values separately
      req.valid = { ...(req.valid || {}), [part]: result.data };
    }
    next();
  };
}

module.exports = validate;
