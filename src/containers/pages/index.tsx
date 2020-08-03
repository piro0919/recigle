import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import SearchFormInner, {
  SearchFormInnerProps,
} from "components/organisms/SearchFormInner";
import SearchInput, {
  SearchInputProps,
} from "components/molecules/SearchInput";
import { SubmitHandler, useForm } from "react-hook-form";
import setSearchHistory, {
  SetSearchHistoryPayload,
} from "actions/setSearchHistory";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/atoms/Button";
import { State } from "reducer";
import Top from "components/organisms/Top";
import getSearch from "actions/getSearch";
import setSite from "actions/setSite";
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
  q?: {
    label: string;
    value: string;
  };
  site: Record<PlusSite | MinusSite, boolean>;
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
  const { completeSuggestion, searchHistories, site } = useSelector<
    State,
    {
      completeSuggestion?: CompleteSuggestion[];
      searchHistories: SetSearchHistoryPayload["searchHistories"];
      site: FieldValues["site"];
    }
  >(
    ({
      search: {
        toplevel: { CompleteSuggestion: completeSuggestion },
      },
      searchHistory: { searchHistories },
      site,
    }) => ({
      completeSuggestion,
      searchHistories,
      site,
    })
  );
  const { control, handleSubmit, register } = useForm<FieldValues>({
    defaultValues: { site },
  });
  const dispatch = useDispatch();
  const { minusSites, plusSites } = useSitesConstants();
  const [keyCode, setKeyCode] = useState<
    Parameters<NonNullable<SearchInputProps["handleKeyDown"]>>[0]["keyCode"]
  >(0);
  const [inputValue, setInputValue] = useState("");
  const onSubmit = useCallback<SubmitHandler<FieldValues>>(
    ({ q, site }) => {
      let searchValue = inputValue;

      if (q) {
        if (keyCode === 0 && searchValue) {
          return;
        }

        const { value } = q;

        searchValue = value;
      }

      if (!searchValue) {
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
      } ${minusSiteQuery} ${searchValue}`.replace(/\s+/g, " ");

      window.open(`http://www.google.co.jp/search?num=100&q=${query}`);

      dispatch(setSite(site));
      dispatch(
        setSearchHistory({
          searchHistories: Array.from(
            new Set([searchValue, ...searchHistories])
          ).filter((_, index) => index < optionsNumber),
        })
      );
    },
    [
      dispatch,
      inputValue,
      keyCode,
      minusSites,
      optionsNumber,
      plusSites,
      searchHistories,
    ]
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
  const [options, setOptions] = useState<SearchInputProps["options"]>([]);
  const handleInputChange = useCallback<
    NonNullable<SearchInputProps["handleInputChange"]>
  >(
    (q, { action }) => {
      if (action === "set-value") {
        return inputValue;
      }

      const nextInputValue = q.replace(/\s+/g, " ");

      setInputValue(nextInputValue);

      return nextInputValue;
    },
    [inputValue, setInputValue]
  );
  const [isLoading, setIsLoading] = useState<SearchInputProps["isLoading"]>(
    false
  );
  const handleKeyDown = useCallback<
    NonNullable<SearchInputProps["handleKeyDown"]>
  >(
    ({ keyCode }) => {
      setKeyCode(keyCode);
    },
    [setKeyCode]
  );

  useEffect(() => {
    // Enter キー以外が押下された場合
    if (keyCode !== 13) {
      return;
    }

    setKeyCode(0);
    handleSubmit(onSubmit)();
  }, [handleSubmit, keyCode, onSubmit, setKeyCode]);

  useEffect(() => {
    setOptions(
      [
        ...searchHistories
          .map((searchHistory) => ({
            icon: "history",
            label: searchHistory,
            value: searchHistory,
          }))
          .filter(({ value }) => value.startsWith(inputValue)),
        ...(completeSuggestion
          ? completeSuggestion
              .map(({ suggestion }) => {
                const {
                  $: { data },
                } = suggestion[0];

                return {
                  label: data,
                  value: data,
                };
              })
              .filter(
                ({ value }) =>
                  !searchHistories.find(
                    (searchHistory) => value === searchHistory
                  )
              )
          : []),
      ].filter((_, index) => index < optionsNumber)
    );
  }, [
    completeSuggestion,
    inputValue,
    optionsNumber,
    searchHistories,
    setOptions,
  ]);

  useEffect(() => {
    if (!inputValue) {
      return;
    }

    setIsLoading(true);

    dispatch(getSearch.started({ q: inputValue }));
  }, [dispatch, inputValue, setIsLoading]);

  useEffect(() => {
    setIsLoading(false);
  }, [completeSuggestion, setIsLoading]);

  return (
    <Top>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SearchFormInner
          plusItems={plusItems}
          minusItems={minusItems}
          searchInput={
            <SearchInput
              control={control}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              isLoading={isLoading}
              name="q"
              options={options}
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
