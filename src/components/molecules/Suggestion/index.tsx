import "./style.module.scss";

import React, { FC, useMemo } from "react";

import { FiClock } from "react-icons/fi";
import { MdSearch } from "react-icons/md";

export type SuggestionProps = {
  handleClick: JSX.IntrinsicElements["div"]["onClick"];
  type: "history" | "search";
};

const Suggestion: FC<SuggestionProps> = ({ children, handleClick, type }) => {
  const icon = useMemo(
    () =>
      type === "history" ? (
        <FiClock styleName="icon" />
      ) : (
        <MdSearch styleName="icon" />
      ),
    [type]
  );

  return (
    <div onClick={handleClick} styleName="suggestion">
      {icon}
      {children}
    </div>
  );
};

export default Suggestion;
