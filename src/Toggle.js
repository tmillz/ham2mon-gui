import React from 'react'
import { func, string } from 'prop-types';
import { Button } from 'react-bootstrap';

const Toggle = ({ theme, toggleTheme }) => {
  return (
    <Button onClick={toggleTheme} >Toggle Theme
    </Button>
  );
};

Toggle.propTypes = {
  theme: string.isRequired,
  toggleTheme: func.isRequired,
}

export default Toggle;