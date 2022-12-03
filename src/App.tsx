import './style.css';

import styled from '@emotion/styled';
import { keyframes, Global } from '@emotion/react';
import React, { useEffect, useRef } from 'react';

type Props = {
  count: number;
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

  animation: ${countAnimation} 5000ms alternate linear;
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

const CountUpJs = ({ count }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let currentCount = 0;

    const timer = () => {
      const current = ref.current;
      if (!current) return;

      if (currentCount < count) {
        current.dataset.number = String(currentCount + 1);
        currentCount += 1;
      }
    };

    const timerInterval = setInterval(timer, Math.trunc(5000 / count));

    return () => clearInterval(timerInterval);
  }, [count]);

  return (
    <>
      <CountUpJsInner ref={ref} data-number="0" aria-hidden="true" />
      <span className="sr-only">{count}</span>
    </>
  );
};

export default function App() {
  const option = {
    count: 5000
  };

  return (
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
      <div>
        <code>CSS:&nbsp;</code><CountUpCss {...option} />
      </div>
      <div>
        <code>JS:&nbsp;&nbsp;</code><CountUpJs {...option} />
      </div>
    </>
  );
}
