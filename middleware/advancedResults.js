const advancedResults = (model) => async (req, res, next) => {
  let query;
  let reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "limit", "page", "size"];
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = model.find(JSON.parse(queryStr));

  //size filtering
  if (req.query.size) {
    const sizes = req.query.size.split(",");

    query = query.find({
      sizes: {
        $all: sizes.map((size) => ({
          $elemMatch: {
            size: size,
            quantity: { $gte: 1 },
          },
        })),
      },
    });
  }

  //select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //sort
  if (req.query.sort) {
    let sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const total = await model.countDocuments(query.getFilter());

  query = query.skip(startIndex).limit(limit);

  //executing query
  const results = await query;

  //pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    total,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
