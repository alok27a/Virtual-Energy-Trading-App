import { Button, useColorMode, Tooltip, Icon } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import React from 'react'

const ToggleTheme = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Tooltip 
      hasArrow 
      placement="right" 
      label={colorMode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      <Button
        onClick={toggleColorMode}
        variant="solid" // uses your custom brand solid variant from theme.js
        size="sm"
        rounded="full"
        aria-label="Toggle Theme"
      >
        <Icon as={colorMode === "light" ? MoonIcon : SunIcon} boxSize={5} />
      </Button>
    </Tooltip>
  )
}

export default ToggleTheme
