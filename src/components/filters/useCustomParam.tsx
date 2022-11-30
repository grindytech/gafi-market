import {
  BooleanParam,
  JsonParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";

export const useNftQueryParam = () => {
  const defaultValue = {
    page: withDefault(NumberParam, 1),
    size: withDefault(NumberParam, 18),
    maxPrice: NumberParam,
    minPrice: NumberParam,
    search: StringParam,
    desc: withDefault(StringParam, "asc"),
    orderBy: withDefault(StringParam, "price"),
    blacklist: BooleanParam,
    attributes: withDefault(JsonParam, []),
    chain: StringParam,
    collectionId: StringParam,
    game: StringParam,
    paymentTokenId: StringParam,
    marketType: StringParam, // withDefault(StringParam, "OnSale"),
  };
  const [query, setQuery] = useQueryParams(defaultValue);
  return { query, setQuery, defaultValue, fixedProperties: 5 };
};
