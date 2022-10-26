import { Accordion, AccordionPanel, Anchor, Box, Button, Form, FormField, Heading, Select } from "grommet";
import { useContext, useState } from "react";
import { Technology } from "grommet-icons";
import { SchemeContext } from "../App";

export function TimelineFilter() {
  const [expanded, setExpansion] = useState(false)
  const schema = useContext(SchemeContext)

  return <Accordion flex={false} width="100%">
    <AccordionPanel label={
      <Box fill={true} align="end">
        <Heading level="4" margin="0">Filter</Heading>
      </Box>}>
      <Form>
        <FormField label="Opponent">
          <Select options={schema.opponent}/>
        </FormField>
        <Button>Apply</Button>
      </Form>
    </AccordionPanel>
  </Accordion>
}
