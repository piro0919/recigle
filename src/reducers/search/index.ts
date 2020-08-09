import getSearch from "actions/getSearch";
import { reducerWithInitialState } from "typescript-fsa-reducers";

type Suggestion = {
  $: {
    data: string;
  };
};

type CompleteSuggestion = {
  suggestion: Suggestion[];
};

export type SearchState = {
  q: string;
  toplevel: {
    CompleteSuggestion?: CompleteSuggestion[];
  };
};

const initialState: Readonly<SearchState> = {
  q: "",
  toplevel: {
    CompleteSuggestion: undefined,
  },
};

const search = reducerWithInitialState(initialState).case(
  getSearch.done,
  (state, { params, result }) => ({ ...state, ...params, ...result })
);

export default search;
