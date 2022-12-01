import {
  BooleanParam,
  JsonParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";

export const useNftQueryParam = () => {
  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    size: withDefault(NumberParam, 18),
    maxPrice: NumberParam,
    minPrice: NumberParam,
    search: StringParam,
    desc: withDefault(StringParam, "desc"),
    orderBy: withDefault(StringParam, "updatedAt"),
    blacklist: BooleanParam,
    attributes: withDefault(JsonParam, []),
    chain: withDefault(StringParam, ""),
    collectionId: StringParam,
    game: StringParam,
    paymentTokenId: StringParam,
    marketType: withDefault(StringParam, ""),
    sort: withDefault(NumberParam, 0),
  });
  const reset = () => {
    setQuery(
      {
        page: 1,
        size: 18,
        desc: "desc",
        orderBy: "price",
        attributes: [],
        chain: "",
        marketType: "",
      },
      "replace"
    );
  };
  return { query, setQuery, fixedProperties: 5, reset };
};
