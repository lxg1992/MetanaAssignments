import {
  Box,
  Text,
  Container,
  Card,
  CardBody,
  CardHeader,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { EventLog, Log } from "ethers";
import { useMetaMask } from "metamask-react";
import { usePageContext } from "../renderer/usePageContext.js";
export { EventFeed };

function EventFeed({
  govEvents,
}: {
  govEvents: (EventLog | Log)[] | undefined;
}) {
  // const { account } = useMetaMask();

  if (!govEvents) {
    return (
      <Box>
        <Text>No Events</Text>
      </Box>
    );
  }

  console.log({ govEvents });

  const reducedEvents = govEvents.reduce((acc, event, idx) => {
    acc[idx] = event.fragment;
    acc[idx].blockNumber = event.blockNumber;
    acc[idx].args = event.args;
    return acc;
  }, []);

  console.log({ reducedEvents });

  //TODO: Make an event feed which is fed all the events for the governor contract (and others?);
  return (
    <Box padding={2}>
      <Heading padding={1} align={"center"} fontSize={"1rem"}>
        Event Feed
      </Heading>
      <Stack>
        {reducedEvents.map((event, idx) => (
          <Popover key={idx} closeOnBlur={true}>
            <PopoverTrigger>
              <Container>
                <Card size="sm">
                  <CardHeader>
                    <Text fontSize={"0.8rem"}>
                      #{event.blockNumber} - {event.name}
                    </Text>
                  </CardHeader>
                </Card>
              </Container>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>Block #{event.blockNumber}</PopoverHeader>
              <PopoverHeader>Event: {event.name}</PopoverHeader>
              <PopoverBody>
                {event.inputs.map((input, jdx) => (
                  <Box key={jdx}>
                    <Text>
                      {input.name}: {event.args[jdx].toString()}
                    </Text>
                  </Box>
                ))}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ))}
      </Stack>
    </Box>
  );
}
