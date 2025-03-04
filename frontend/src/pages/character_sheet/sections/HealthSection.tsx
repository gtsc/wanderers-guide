import { characterState } from '@atoms/characterAtoms';
import { drawerState } from '@atoms/navAtoms';
import BlurBox from '@common/BlurBox';
import ClickEditText from '@common/ClickEditText';
import { useMantineTheme, Group, Anchor, Button, Box, Text } from '@mantine/core';
import { interpolateHealth } from '@utils/colors';
import { getFinalHealthValue } from '@variables/variable-display';
import { evaluate } from 'mathjs';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { confirmHealth } from '../character-utils';

export default function HealthSection() {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const [_drawer, openDrawer] = useRecoilState(drawerState);
  const [character, setCharacter] = useRecoilState(characterState);

  const maxHealth = getFinalHealthValue('CHARACTER');
  let currentHealth = character?.hp_current;
  if (currentHealth === undefined || currentHealth < 0) {
    currentHealth = maxHealth;
  }

  let tempHealth = character?.hp_temp;
  if (tempHealth === undefined || tempHealth < 0) {
    tempHealth = 0;
  }

  return (
    <BlurBox blur={10}>
      <Box
        pt='xs'
        pb={5}
        px='xs'
        style={{
          borderTopLeftRadius: theme.radius.md,
          borderTopRightRadius: theme.radius.md,
          position: 'relative',
        }}
        h='100%'
      >
        <Group justify='space-between' style={{ flexDirection: 'column' }} h='100%' gap={0}>
          <Group wrap='nowrap' justify='space-between' align='flex-start' w='100%' gap={0} grow>
            <Box>
              <Text ta='center' fz='md' fw={500} c='gray.0'>
                Hit Points
              </Text>
              <Group wrap='nowrap' justify='center' align='center' gap={10}>
                <ClickEditText
                  color={interpolateHealth(currentHealth / maxHealth)}
                  size='xl'
                  value={`${currentHealth}`}
                  height={50}
                  miw={20}
                  placeholder='HP'
                  onChange={(value) => {
                    if (!character) return;
                    confirmHealth(value, character, setCharacter);
                  }}
                />
                <Box>
                  <Text size='md' c='gray.4' style={{ cursor: 'default' }}>
                    /
                  </Text>
                </Box>
                <Box>
                  <Anchor
                    size='lg'
                    c='gray.3'
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      openDrawer({ type: 'stat-hp', data: {} });
                    }}
                    underline='hover'
                  >
                    {maxHealth}
                  </Anchor>
                </Box>
              </Group>
            </Box>

            <Box>
              <Text ta='center' fz='sm' fw={500} c='gray.0'>
                Temp. HP
              </Text>
              <ClickEditText
                color={tempHealth ? `blue` : `gray.5`}
                size='xl'
                value={tempHealth ? `${tempHealth}` : `—`}
                height={50}
                miw={20}
                placeholder='HP'
                onChange={(value) => {
                  let result = -1;
                  try {
                    result = evaluate(value);
                  } catch (e) {
                    result = parseInt(value);
                  }
                  if (isNaN(result)) result = 0;
                  result = Math.floor(result);
                  if (result < 0) result = 0;

                  setCharacter((c) => {
                    if (!c) return c;
                    return {
                      ...c,
                      hp_temp: result,
                    };
                  });
                }}
              />
            </Box>
          </Group>
          <Button
            variant='subtle'
            color='gray.5'
            size='compact-xs'
            fw={400}
            onClick={() => {
              openDrawer({ type: 'stat-resist-weak', data: {} });
            }}
          >
            Resistances & Weaknesses
          </Button>
        </Group>
      </Box>
    </BlurBox>
  );
}
