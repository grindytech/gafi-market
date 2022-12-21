import {
  BooleanParam,
  JsonParam,
  NumberParam,
  ObjectParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";

export const useNftQueryParam = () => {
  const [query, setQuery] = useQueryParams({
    maxPrice: NumberParam,
    minPrice: NumberParam,
    search: StringParam,
    blacklist: BooleanParam,
    attributes: JsonParam,
    chain: StringParam,
    collectionId: StringParam,
    game: StringParam,
    paymentTokenId: StringParam,
    marketType: StringParam,
    sort: withDefault(ObjectParam, {
      desc: "desc",
      orderBy: "updatedAt",
    }),
  });
  const reset = () => {
    setQuery({}, "replace");
  };
  const fixedProperties = 1;
  const countFilter = () =>
    Object.keys(query).filter((k) => query[k] !== undefined && query[k] !== "")
      .length - fixedProperties;
  return { query, setQuery, countFilter, reset };
};
