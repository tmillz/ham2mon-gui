import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`

  body {
    background: ${({ theme }) => theme.body};
    backgroundColor: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    display: flex;
    font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    margin: 2px;
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
    text-align: left;
  }

  .btn.btn-primary:hover, .btn.btn-primary:focus {
    background-color: ${({ theme }) => theme.selected};
    box-shadow: none !important;
  }

  .btn.btn-primary:active  {
    background: ${({ theme }) => theme.selected} !important;
    filter:brightness(70%);
  }

  #react-select-container .react-select__control {
    background: ${({ theme }) => theme.body};
  }

  #react-select-container .react-select__control--is-focused {
    box-shadow: none;
    border-color: ${({ theme }) => theme.text};
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