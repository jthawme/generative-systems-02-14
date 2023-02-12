import React, { useEffect } from "react";

interface EphemeralPressProps {
  onEnd: () => void;
  id: string;
  life?: number;
}

const EphemeralPress: React.FC<EphemeralPressProps> = ({
  onEnd,
  id,
  life = 2500,
  children,
}) => {
  useEffect(() => {
    let timeId = setTimeout(() => {
      onEnd();
    }, life);

    return () => {
      clearTimeout(timeId);
    };
  }, [life]);

  return <>{children}</>;
};

export { EphemeralPress };
