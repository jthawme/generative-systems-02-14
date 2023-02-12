import React from "react";
import { EphemeralPress } from "../EphemeralPress";
import { StandardPress } from "../StandardPress";
import { useUser } from "../../UserContext";

const PressDisplay = () => {
  const { presses, onRemove } = useUser();

  return (
    <>
      {presses.map((item) => (
        <EphemeralPress
          key={item.id}
          id={item.id}
          onEnd={() => onRemove(item.id)}
          life={1500}
        >
          <StandardPress {...item} size={48} />
        </EphemeralPress>
      ))}
    </>
  );
};

export { PressDisplay };
