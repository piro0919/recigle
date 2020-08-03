import "./style.module.scss";

import React, { FC, useCallback, useMemo } from "react";
import Select, { components } from "react-select";

import { BarLoader } from "react-spinners";
import { Controller } from "react-hook-form";
import { FiClock } from "react-icons/fi";
import { MdSearch } from "react-icons/md";
import { Props } from "react-select";

const { Option } = components;

export type SearchInputProps = Pick<Props, "isLoading" | "options"> & {
  control: any;
  handleInputChange: Props["onInputChange"];
  handleKeyDown: Props["onKeyDown"];
  name: string;
};

const SearchInput: FC<SearchInputProps> = ({
  control,
  handleInputChange,
  handleKeyDown,
  isLoading,
  name,
  options,
}) => {
  const option = useCallback((props) => {
    const {
      data: { icon, label },
    } = props;
    const iconNode =
      icon === "history" ? (
        <FiClock styleName="icon" />
      ) : (
        <MdSearch styleName="icon" />
      );

    return (
      <Option {...props} styleName="option">
        <button styleName="button" type="submit">
          <div styleName="option-inner">
            {iconNode}
            {label}
          </div>
        </button>
      </Option>
    );
  }, []);
  const components = useMemo<Props["components"]>(
    () => ({
      Option: option,
    }),
    [option]
  );
  const loadingMessage = useCallback<NonNullable<Props["loadingMessage"]>>(
    () => (<BarLoader color="#9aa0a6" height={4} width={40} />) as any,
    []
  );

  return (
    <Controller
      as={Select}
      classNamePrefix="react-select"
      closeMenuOnSelect={false}
      components={components}
      control={control}
      isClearable={true}
      isLoading={isLoading}
      loadingMessage={loadingMessage}
      menuPosition="fixed"
      name={name}
      noOptionsMessage={() => "検索してみてください"}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      options={options}
      placeholder={<MdSearch styleName="icon" />}
      styleName="search-input"
    />
  );
};

export default SearchInput;
