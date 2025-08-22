import { createGlobalStyle } from 'styled-components';

/**
 * Global CSS styles that aren't specific to individual components.
 *
 * @type {React.NamedExoticComponent<ExecutionProps & object>}
 */
export const GlobalStyle = createGlobalStyle`
* {
  padding: 0;
  margin: 0;
}

@keyframes options_open {
  from {
    left:-($options_width -1rem)
  }
  to {
    left:0
  }
}
@keyframes options_close {
  from {
    left:0
  }
  to {
    left:-($options_width -1rem)
  }
}
`;