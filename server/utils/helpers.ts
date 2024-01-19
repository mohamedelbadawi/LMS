export const getQuery = (data: any) => {
  const query: Record<string, any> = {};
  if (data.search) {
    query.name = { $regex: new RegExp(data.search as string, "i") };
  }
  if (data.minPrice || data.maxPrice) {
    if (data.minPrice) {
      query.price.$gte = parseFloat(data.minPrice as string);
    }

    if (data.maxPrice) {
      query.price.$gte = parseFloat(data.maxPrice as string);
    }
  }
};
