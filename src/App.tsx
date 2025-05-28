import { Box, Container, Divider } from "@chakra-ui/react";
import {useMemoryLoader} from "@/hooks/useMemoryLoader";
import FlowEditor from "@ui/editor/FlowEditor";
import TopPanel from "@ui/TopPanel";

function App() {
  useMemoryLoader();

  return (
    <Container p={0} maxW="100vw">
      <TopPanel />
      <Divider py={1} />
      <Box maxW="100vw" h="95vh" overflow="auto">
        <FlowEditor />
      </Box>
    </Container>
  )
}

export default App
