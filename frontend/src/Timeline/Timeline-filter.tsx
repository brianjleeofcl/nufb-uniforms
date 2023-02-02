import { Accordion, AccordionPanel, Box, Button, Form, FormField, Heading, RadioButton, RadioButtonGroup, Select } from "grommet";
import { useContext, useState } from "react";
import { Technology } from "grommet-icons";
import { SchemeContext } from "../App";

enum OpponentOptions {
  All, NonCon, Conf, Cxdiv, Div, Sel
}

const opponentToFilter: Record<OpponentOptions, {}> = {
  [OpponentOptions.All]: {},
  [OpponentOptions.NonCon]: {},
  [OpponentOptions.Conf]: {},
  [OpponentOptions.Cxdiv]: {},
  [OpponentOptions.Div]: {},
  [OpponentOptions.Sel]: {},
}

export function TimelineFilter() {
  const [ filter, setFilter ] = useState()
  const [ opponentEnabled, enableOpponent ] = useState(false);
  const schema = useContext(SchemeContext);
  const fullOpponentList = schema.opponent
  const [opponents, setOpponents] = useState(fullOpponentList);

  const opponentOptions = [
    { label: 'all', value: OpponentOptions.All },
    { label: 'non-conference', value: OpponentOptions.NonCon },
    { label: 'conference', value: OpponentOptions.Conf },
    { label: 'cross-division', value: OpponentOptions.Cxdiv },
    { label: 'division', value: OpponentOptions.Div },
  ];


  return <Accordion flex={false} width="100%">
    <AccordionPanel label={
      <Box fill={true} align="end">
        <Heading level="4" margin="0">Filter</Heading>
      </Box>}>
      <Form >
        <FormField label="Opponents">
          <RadioButtonGroup name="opponents" options={opponentOptions}/>
          <RadioButton name="opponents" id="select-opponent" value={OpponentOptions.Sel} label={
            <Box>
              <Select placeholder="Select Opponent" options={opponents}
                onClose={() => setOpponents(fullOpponentList)}
                onSearch={text => {
                  if (!text) {
                    if (opponents.length === fullOpponentList.length) return;
                    setOpponents(fullOpponentList);
                  }
                  const searchTerm = text.toLowerCase()
                  const searched = [];
                  for (const opponent of fullOpponentList) {
                    const index = opponent.toLowerCase().indexOf(searchTerm);
                    if (index !== -1) {
                      searched.push({ opponent, index });
                    }
                  }
                  setOpponents(searched.sort((a, b) => a.index - b.index).map(({ opponent }) => opponent));
                }} />
            </Box>
          } />
        </FormField>
        <FormField label="Home/Away">
          <Select options={schema.opponent} />
        </FormField>
        <Box direction="row" justify="end" gap="small">
          <Button primary label="Apply" />
          <Button secondary label="Reset" />
        </Box>
      </Form>
    </AccordionPanel>
  </Accordion>
}
