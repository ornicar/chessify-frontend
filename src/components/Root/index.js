import React from 'react'
import { ThemeContext, themes } from '../../contexts/ThemeContext'
import Toggle from '../Toggle'

const RootToggle = () => (
  <ThemeContext.Consumer>
    {({ theme, setTheme }) => (
      <Toggle
        onChange={() => {
          if (theme === themes.light) setTheme(themes.dark)
          if (theme === themes.dark) setTheme(themes.light)
        }}
        value={theme === themes.dark}
      />
    )}
  </ThemeContext.Consumer>
)

export default RootToggle;