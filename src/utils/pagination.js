/**
 * Parses pagination + search + extra filter query params from an Express
 * request and returns a normalised query object ready to feed into
 * `Model.paginate()`.
 *
 * @param {import("express").Request} req
 * @param {string[]} [searchFields=[]] - Model field paths to apply the text
 *   search against (joined with $or + regex).
 * @returns {{
 *   page: number,
 *   limit: number,
 *   search: string,
 *   sort: object,
 *   query: object
 * }}
 */
export const buildPaginationQuery = (req, searchFields = []) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const search = (req.query.search || "").trim();

  const query = {};

  if (search && searchFields.length > 0) {
    query.$or = searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  // Optional filter fields passed through from query (status, category, etc.)
  const allowedFilters = ["status", "category", "employmentType", "featured"];
  for (const f of allowedFilters) {
    if (req.query[f] !== undefined && req.query[f] !== "") {
      const val = req.query[f];
      if (f === "featured") {
        query.featured = val === "true" || val === "1";
      } else {
        query[f] = String(val);
      }
    }
  }

  const sort = { createdAt: -1 };

  return { page, limit, search, sort, query };
};

export default buildPaginationQuery;
