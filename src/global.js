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
    display: "inline-block",
    width: 100%
  }

  .true {
    background-color: ${({ theme }) => theme.selected};
  }

  .btn.btn-primary:hover {
    background-color: ${({ theme }) => theme.selected} !important;
    box-shadow: none !important;
  }

  .btn.btn-primary:focus, .Btn-Blue-BG:hover, .Btn-Blue-BG:focus, .Btn-Blue-BG {
    background-color: ${({ theme }) => theme.button} !important;
    box-shadow: none !important;
  }

  .Btn-Blue-BG.active, .Btn-Blue-BG.active:focus {
    background-color: ${({ theme }) => theme.selected} !important;
    box-shadow: none !important;
  }

  .btn-group.special {
    display: flex;
  }
  
  .special .btn {
    flex: 1
  }

  .btn.btn-primary:active  {
    background: ${({ theme }) => theme.button} !important;
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