import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import SearchFormInner, {
  SearchFormInnerProps,
} from "components/organisms/SearchFormInner";
import SearchInput, {
  SearchInputProps,
} from "components/molecules/SearchInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/atoms/Button";
import { State } from "reducer";
import Suggestion from "components/molecules/Suggestion";
import Top from "components/organisms/Top";
import getSearch from "actions/getSearch";
import setSearchHistory from "actions/setSearchHistory";
import setSite from "actions/setSite";
import useOnClickOutside from "hooks/useOnClickOutside";
import useSitesConstants from "hooks/useSitesConstants";
import useWindowSize from "hooks/useWindowSize";

type PlusSite =
  | "ajinomoto"
  | "delishkitchen"
  | "erecipe"
  | "kikkoman"
  | "kurashiru"
  | "lettuceclub"
  | "nadia"
  | "orangepage"
  | "sirogohan";

type MinusSite = "cookpad" | "rakuten";

type FieldValues = {
  site: Record<PlusSite | MinusSite, boolean>;
  value: string;
};

type Suggestion = {
  $: {
    data: string;
  };
};

type CompleteSuggestion = {
  suggestion: Suggestion[];
};

const Pages: FC = () => {
  const optionsNumber = useMemo(() => 10 as const, []);
  const { completeSuggestion, q, searchHistories, site } = useSelector<
    State,
    {
      completeSuggestion?: CompleteSuggestion[];
      q: string;
      searchHistories: string[];
      site: FieldValues["site"];
    }
  >(
    ({
      search: {
        q,
        toplevel: { CompleteSuggestion: completeSuggestion },
      },
      searchHistory: { searchHistories },
      site,
    }) => ({
      completeSuggestion,
      q,
      searchHistories,
      site,
    })
  );
  const { control, handleSubmit, register, setValue, watch } = useForm<
    FieldValues
  >({
    defaultValues: { site, value: "" },
  });
  const dispatch = useDispatch();
  const { minusSites, plusSites } = useSitesConstants();
  const onSubmit = useCallback<SubmitHandler<FieldValues>>(
    ({ site, value }) => {
      if (!value.trim()) {
        return;
      }

      const plusSiteQuery = plusSites
        .filter(({ id }) => site[id])
        .map(({ children }) => children)
        .join("　");
      const minusSiteQuery = minusSites
        .filter(({ id }) => site[id])
        .map(({ children }) => `-${children}`)
        .join(" ");
      const query = `${
        plusSiteQuery || "レシピ"
      } ${minusSiteQuery} ${value}`.replace(/\s+/g, " ");

      dispatch(setSite(site));
      dispatch(
        setSearchHistory({
          searchHistories: Array.from(
            new Set([value, ...searchHistories])
          ).filter((_, index) => index < optionsNumber),
        })
      );

      setTimeout(() => {
        window.open(`http://www.google.co.jp/search?num=100&q=${query}`);
      }, 100);
    },
    [dispatch, minusSites, optionsNumber, plusSites, searchHistories]
  );
  const plusItems = useMemo<SearchFormInnerProps["plusItems"]>(
    () =>
      plusSites.map(({ id, ...values }) => ({
        ...values,
        id,
        checkboxRef: register,
        name: `site.${id}`,
      })),
    [plusSites, register]
  );
  const minusItems = useMemo<SearchFormInnerProps["minusItems"]>(
    () =>
      minusSites.map(({ id, ...values }) => ({
        ...values,
        id,
        checkboxRef: register,
        name: `site.${id}`,
      })),
    [minusSites, register]
  );
  const { windowWidth } = useWindowSize();
  const suggestions = useMemo<SearchInputProps["suggestions"]>(
    () =>
      [
        ...searchHistories
          .filter((searchHistory) => searchHistory.startsWith(watch("value")))
          .map((value) => ({ value, type: "history" } as const)),
        ...(completeSuggestion && watch("value")
          ? completeSuggestion
              .filter(({ suggestion }) => {
                const {
                  $: { data },
                } = suggestion[0];

                return !searchHistories.find(
                  (searchHistory) => data === searchHistory
                );
              })
              .map(({ suggestion }) => {
                const {
                  $: { data },
                } = suggestion[0];

                return { type: "search", value: data } as const;
              })
          : []),
      ].filter((_, index) => index < optionsNumber),
    [completeSuggestion, optionsNumber, searchHistories, watch]
  );
  const [alwaysRenderSuggestions, setAlwaysRenderSuggestions] = useState<
    SearchInputProps["alwaysRenderSuggestions"]
  >(false);
  const handleClick = useCallback<
    NonNullable<SearchInputProps["handleClick"]>
  >(() => {
    setAlwaysRenderSuggestions(true);
  }, []);
  const isRemovedHistory = useRef(false);
  const handleChange = useCallback<
    NonNullable<SearchInputProps["handleChange"]>
  >(
    (_, { newValue }) => {
      const { current } = isRemovedHistory;

      if (current) {
        isRemovedHistory.current = false;

        return;
      }

      setValue("value", newValue);
    },
    [setValue]
  );
  const handleSuggestionsFetchRequested = useCallback<
    SearchInputProps["handleSuggestionsFetchRequested"]
  >(
    ({ value }) => {
      // 連続で同じワードで検索させない
      if (!value.trim() || value === q) {
        return;
      }

      dispatch(getSearch.started({ q: value.replace(/\s+/g, " ") }));
    },
    [dispatch, q]
  );
  const searchInputRef = useRef(null);
  const handler = useCallback(() => {
    setAlwaysRenderSuggestions(false);
  }, []);
  const renderSuggestion = useCallback<SearchInputProps["renderSuggestion"]>(
    ({ type, value }) => (
      <Suggestion
        handleClick={() => {
          setValue("value", value);

          handleSubmit(onSubmit)();
        }}
        handleClickOnRemoveButton={() => {
          isRemovedHistory.current = true;

          dispatch(
            setSearchHistory({
              searchHistories: searchHistories.filter(
                (searchHistory) => value !== searchHistory
              ),
            })
          );
        }}
        type={type}
      >
        {value}
      </Suggestion>
    ),
    [dispatch, handleSubmit, onSubmit, searchHistories, setValue]
  );
  const getSuggestionValue = useCallback<
    SearchInputProps["getSuggestionValue"]
  >(({ value }) => value, []);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClickOnCloseButton = useCallback<
    NonNullable<SearchInputProps["handleClickOnCloseButton"]>
  >(() => {
    setValue("value", "");

    const { current } = inputRef;

    if (!current) {
      return;
    }

    current.focus();
  }, [setValue]);
  const handleSuggestionsClearRequested = useCallback<
    NonNullable<SearchInputProps["handleSuggestionsClearRequested"]>
  >(() => {}, []);

  useOnClickOutside(searchInputRef, handler);

  return (
    <Top>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SearchFormInner
          plusItems={plusItems}
          minusItems={minusItems}
          searchInput={
            <SearchInput
              alwaysRenderSuggestions={alwaysRenderSuggestions}
              control={control}
              getSuggestionValue={getSuggestionValue}
              handleChange={handleChange}
              handleClick={handleClick}
              handleClickOnCloseButton={handleClickOnCloseButton}
              handleSuggestionsClearRequested={handleSuggestionsClearRequested}
              handleSuggestionsFetchRequested={handleSuggestionsFetchRequested}
              inputRef={inputRef}
              name="value"
              renderSuggestion={renderSuggestion}
              searchInputRef={searchInputRef}
              suggestions={suggestions}
            />
          }
          submitButton={<Button type="submit">レシグル 検索</Button>}
          windowWidth={windowWidth}
        />
      </form>
    </Top>
  );
};

export default Pages;
