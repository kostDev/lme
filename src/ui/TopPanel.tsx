import {Button, Stack} from "@chakra-ui/react";
import {AddIcon, EditIcon, RepeatIcon} from "@chakra-ui/icons";


function TopPanel() {
  return (
    <Stack direction='row' justify="center" spacing={4} p={2}>
      <Button leftIcon={<EditIcon />}>
        Open Mind Space
      </Button>
      <Button leftIcon={<AddIcon />}>
        New Mind Space
      </Button>
      <Button leftIcon={<RepeatIcon />}>
        Open Closed Tab
      </Button>
    </Stack>
  )
}

export default TopPanel;