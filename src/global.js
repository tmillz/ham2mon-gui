import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`

  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme.body};
    backgroundColor: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    display: flex;
    font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    transition: all 0.25s linear;
    margin: 10px;
    
    align-items: center;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    transition: all 0.25s linear;
  }

  .modal .modal-content{
    background-color: ${({ theme }) => theme.body};
  }

  .btn {
    background-color: ${({ theme }) => theme.button};
    color: ${({ theme }) => theme.text};
    selectedButton: ${({ theme }) => theme.selected};
    border: none;
    margin: 2px;
  }

  .btn.btn-primary:hover {
    background-color: ${({ theme }) => theme.selected};
  }

  .btn.btn-primary:focus {
    background-color: ${({ theme }) => theme.selected};
  }

  #react-select-container .react-select__control {
    background: ${({ theme }) => theme.body};
  }

  #react-select-container .react-select__menu-list {
    background: ${({ theme }) => theme.body};
  }

  #react-select-container .react-select__option {
    color: ${({ theme }) => theme.text} !important;
  }

  #react-select-container .react-select__single-value {
    color: ${({ theme }) => theme.text} !important;
  }
  `