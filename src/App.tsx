import './style.css';

import styled from '@emotion/styled';
import { keyframes, Global } from '@emotion/react';
import React, { useEffect, useRef } from 'react';

type Props = {
  count: number;
  duration?: number;
};

const enableRegisterProperty =
  // @ts-ignore
  typeof window.CSS.registerProperty !== 'undefined';

const countAnimation = ({ count }: Props) => keyframes`
  from {
    --count-number: 0;
  }
  to {
    --count-number: ${count};
  }
`;

const CountUpCss = styled.span<Props>`
  --count-number: ${(props) => props.count};

  animation: ${countAnimation} ${(props) => props.duration ?? 5}s alternate
    ease-in-out;
  counter-reset: counter var(--count-number);

  &::after {
    content: counter(counter);
  }
`;

const CountUpJsInner = styled.span`
  &::after {
    content: attr(data-number);
  }
`;

const CountUpJs = ({ count, duration = 5 }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let timerInterval = -1;

    const timer = () => {
      if (!ref.current) return;

      const counting = Number(ref.current.dataset.number);

      if (counting < count) {
        ref.current.dataset.number = String(counting + 1);
      }

      if (counting >= count) {
        window.clearInterval(timerInterval);
      }
    };

    timerInterval = window.setInterval(
      timer,
      Math.trunc((duration * 500) / count),
    );
  }, [count, duration]);

  return (
    <>
      <CountUpJsInner ref={ref} data-number="0" aria-hidden="true" />
      <span className="sr-only">{count}</span>
    </>
  );
};

export default function App() {
  const option = {
    count: 1000,
    duration: 5,
  };

  return (
    <>
      {enableRegisterProperty ? (
        <>
          <Global
            styles={`
            @property --count-number {
              syntax: '<integer>';
              initial-value: 0;
              inherits: false;
            }
          `}
          />
          <CountUpCss {...option} />
        </>
      ) : (
        <CountUpJs {...option} />
      )}
    </>
  );
}
