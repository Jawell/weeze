export function dataFilter<D, F extends keyof D>(data: D[], filters: Record<F, unknown>): D[] {
  let dataFiltered = data;
  for (const filter of Object.keys(filters)) {
    dataFiltered = dataFiltered.filter((item) => {
      return filters[filter as F] === item[filter as F];
    });
  }
  return dataFiltered;
}
