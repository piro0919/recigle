import "./style.module.scss";

import React, { FC, useMemo } from "react";

import { FiClock } from "react-icons/fi";
import { MdSearch } from "react-icons/md";

export type SuggestionProps = {
  handleClick: JSX.IntrinsicElements["div"]["onClick"];
  handleClickOnRemoveButton: JSX.IntrinsicElements["button"]["onClick"];
  type: "history" | "search";
};

const Suggestion: FC<SuggestionProps> = ({
  children,
  handleClick,
  handleClickOnRemoveButton,
  type,
}) => {
  const icon = useMemo(
    () =>
      type === "history" ? (
        <FiClock styleName="icon" />
      ) : (
        <MdSearch styleName="icon" />
      ),
    [type]
  );
  const button = useMemo(
    () =>
      type === "history" ? (
        <button onClick={handleClickOnRemoveButton} styleName="button">
          削除
        </button>
      ) : null,
    [handleClickOnRemoveButton, type]
  );

  return (
    <div styleName="suggestion">
      <div onClick={handleClick} styleName="text-wrapper">
        {icon}
        {children}
      </div>
      {button}
    </div>
  );
};

export default Suggestion;
