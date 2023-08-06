import React from "react";
import { NavLink } from "react-router-dom";

export default function Navigation({ links }) {
  if (!links) return null;
  return (
    <>
      <ul className="navigation">
        {links.map((l, i) => {
          return (
            <NavLink
              key={i}
              to={l.route}
              className={({ isActive }) => (isActive ? "is-active-nav" : "")}
            >
              {l.text}
            </NavLink>
          );
        })}
      </ul>
    </>
  );
}
