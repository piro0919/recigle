import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory();

export type SearchParams = { q: string };

type Suggestion = {
  $: {
    data: string;
  };
};

type CompleteSuggestion = {
  suggestion: Suggestion[];
};

export type SearchResult = {
  toplevel: {
    CompleteSuggestion?: CompleteSuggestion[];
  };
};

const getSearch = actionCreator.async<SearchParams, SearchResult>("GET_SEARCH");

export default getSearch;
