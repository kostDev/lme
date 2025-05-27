import {Box, Button, Container, Divider, Stack} from "@chakra-ui/react";
import {AddIcon, EditIcon, RepeatIcon} from "@chakra-ui/icons";
import FlowEditor from "./FlowEditor.tsx";
import {useMemoryLoader} from "@/hooks/useMemoryLoader.ts";

function App() {
  useMemoryLoader();

  return (
    <Container p={0} maxW="100vw">
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
      <Divider py={1} />
      <Box maxW="100vw" h="95vh" overflow="auto">
        <FlowEditor />
      </Box>
    </Container>
  )
}

export default App
