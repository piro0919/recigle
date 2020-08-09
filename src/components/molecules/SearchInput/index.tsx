import Autosuggest, { AutosuggestPropsSingleSection } from "react-autosuggest";
import { MdClose, MdSearch } from "react-icons/md";
import React, { DOMAttributes, FC, useCallback } from "react";

import { Controller } from "react-hook-form";
import theme from "./style.module.scss";

type Suggestion = {
  type: "history" | "search";
  value: string;
};

export type SearchInputProps = Pick<
  AutosuggestPropsSingleSection<Suggestion>,
  | "alwaysRenderSuggestions"
  | "getSuggestionValue"
  | "renderSuggestion"
  | "suggestions"
> & {
  control: any;
  handleChange: AutosuggestPropsSingleSection<
    Suggestion
  >["inputProps"]["onChange"];
  handleClick: AutosuggestPropsSingleSection<
    Suggestion
  >["inputProps"]["onClick"];
  handleClickOnCloseButton: DOMAttributes<any>["onClick"];
  handleSuggestionsClearRequested: AutosuggestPropsSingleSection<
    Suggestion
  >["onSuggestionsClearRequested"];
  handleSuggestionsFetchRequested: AutosuggestPropsSingleSection<
    Suggestion
  >["onSuggestionsFetchRequested"];
  inputRef: JSX.IntrinsicElements["input"]["ref"];
  name: string;
  searchInputRef: any;
};

const SearchInput: FC<SearchInputProps> = ({
  alwaysRenderSuggestions,
  control,
  getSuggestionValue,
  handleChange,
  handleClick,
  handleClickOnCloseButton,
  handleSuggestionsClearRequested,
  handleSuggestionsFetchRequested,
  inputRef,
  name,
  renderSuggestion,
  searchInputRef,
  suggestions,
}) => {
  const renderInputComponent = useCallback<
    NonNullable<
      AutosuggestPropsSingleSection<Suggestion>["renderInputComponent"]
    >
  >(
    ({ onChange, ...inputProps }) => (
      <div styleName="input-wrapper">
        <MdSearch styleName="icon" />
        <input {...inputProps} onChange={onChange as any} />
        <MdClose
          onClick={handleClickOnCloseButton}
          styleName="icon close-icon"
        />
      </div>
    ),
    [handleClickOnCloseButton]
  );
  const render = useCallback(
    ({ value }) => (
      <Autosuggest
        alwaysRenderSuggestions={alwaysRenderSuggestions}
        getSuggestionValue={getSuggestionValue}
        inputProps={
          {
            value,
            onChange: handleChange,
            onClick: handleClick,
            placeholder: "料理名や食材で検索",
            ref: inputRef,
            type: "search",
          } as any // TODO: ref の型対応待ち
        }
        onSuggestionsClearRequested={handleSuggestionsClearRequested}
        onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
        renderInputComponent={renderInputComponent}
        renderSuggestion={renderSuggestion}
        suggestions={suggestions}
        theme={theme}
      />
    ),
    [
      alwaysRenderSuggestions,
      getSuggestionValue,
      handleChange,
      handleClick,
      handleSuggestionsClearRequested,
      handleSuggestionsFetchRequested,
      inputRef,
      renderInputComponent,
      renderSuggestion,
      suggestions,
    ]
  );

  return (
    <div ref={searchInputRef}>
      <Controller control={control} name={name} render={render} />
    </div>
  );
};

export default SearchInput;
