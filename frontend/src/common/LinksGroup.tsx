import { useState } from 'react';
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  rem,
  Badge,
  useMantineTheme,
  Switch,
  Button,
  ActionIcon,
  Tooltip,
  HoverCard,
} from '@mantine/core';
import {
  IconChevronRight,
  IconExternalLink,
  IconInfoCircle,
  IconInfoCircleFilled,
  IconInfoSmall,
} from '@tabler/icons-react';
import classes from '@css/LinksGroup.module.css';
import switchClasses from '@css/CustomSwitch.module.css';
import { drawerState } from '@atoms/navAtoms';
import { useRecoilState } from 'recoil';
import { useMediaQuery } from '@mantine/hooks';
import { phoneQuery } from '@utils/mobile-responsive';
import { ContentType, AbilityBlockType } from '@typing/content';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; id: number; url: string; enabled?: boolean }[];
  onLinkChange?: (id: number, enabled: boolean) => void;
  onEnableAll?: () => void;
  onFeedback?: (type: ContentType | AbilityBlockType, id: number, contentSourceId: number) => void;
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  onLinkChange,
  onEnableAll,
  onFeedback,
}: LinksGroupProps) {
  const theme = useMantineTheme();
  const isPhone = useMediaQuery(phoneQuery());
  const [_drawer, openDrawer] = useRecoilState(drawerState);
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : [])
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((link, index) => (
      <Group key={index} gap={0}>
        <Text<'a'> component='a' className={classes.link} key={link.label}>
          <Switch
            label={link.label}
            size='xs'
            checked={link.enabled}
            onChange={(event) => onLinkChange && onLinkChange(link.id, event.target.checked)}
            classNames={switchClasses}
          />
        </Text>
        <HoverCard shadow='md' position='top' openDelay={500} withinPortal withArrow>
          <HoverCard.Target>
            <ActionIcon
              mr={40}
              color='gray.9'
              variant='transparent'
              size='xs'
              radius='xl'
              aria-label='Source Info'
              onClick={() => {
                openDrawer({
                  type: 'content-source',
                  data: {
                    id: link.id,
                    showOperations: true,
                    onFeedback: onFeedback,
                  },
                });
              }}
            >
              <IconExternalLink size='0.6rem' stroke={1.5} />
            </ActionIcon>
          </HoverCard.Target>
          <HoverCard.Dropdown px={10} py={5}>
            <Text size='sm'>Open Source Info</Text>
          </HoverCard.Dropdown>
        </HoverCard>
      </Group>
    ));

  return (
    <>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Group justify='space-between' gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant='light' size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml='md'>{label}</Box>
            <Badge ml='md' variant='default'>
              <Text fz='sm' c='gray.5' span>
                {links?.filter((link) => link.enabled).length}
              </Text>
              <Text fz='sm' c='gray.5' span>
                /{links?.length}
              </Text>
            </Badge>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(-90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks && (
        <Collapse in={opened}>
          <Box style={{ position: 'relative' }}>
            {items.length > 0 ? (
              <>
                {items}
                {!isPhone && (
                  <Button
                    style={{ position: 'absolute', top: -30, right: 45 }}
                    variant='outline'
                    color='gray.5'
                    size='compact-xs'
                    onClick={onEnableAll}
                  >
                    Enable All
                  </Button>
                )}
              </>
            ) : (
              <Text pl={60} py={5} fz='sm' fs='italic' c='dimmed'>
                No content sources found for this section!
              </Text>
            )}
          </Box>
        </Collapse>
      )}
    </>
  );
}

export function LinkSwitch(props: {
  label: string;
  info?: string;
  url?: string;
  enabled?: boolean;
  onLinkChange: (enabled: boolean) => void;
}) {
  const [_drawer, openDrawer] = useRecoilState(drawerState);

  return (
    <Group gap={0}>
      <Text<'a'> component='a'>
        <Switch
          label={props.label}
          size='xs'
          checked={!!props.enabled}
          onChange={(event) => props.onLinkChange && props.onLinkChange(event.target.checked)}
          classNames={switchClasses}
        />
      </Text>
      {props.info && (
        <HoverCard shadow='md' position='top' openDelay={500} withinPortal withArrow>
          <HoverCard.Target>
            <ActionIcon
              mr={40}
              color='gray.9'
              variant='transparent'
              size='xs'
              radius='xl'
              aria-label='Info'
              onClick={() => {
                if (!props.info) return;
                openDrawer({
                  type: 'generic',
                  data: {
                    title: props.label,
                    description:
                      props.info.trim() + (props.url ? `\n\n[[Archives of Nethys Rules Page](${props.url})]` : ''),
                  },
                });
              }}
            >
              <IconExternalLink size='0.6rem' stroke={1.5} />
            </ActionIcon>
          </HoverCard.Target>
          <HoverCard.Dropdown px={10} py={5}>
            <Text size='sm'>Open Info</Text>
          </HoverCard.Dropdown>
        </HoverCard>
      )}
    </Group>
  );
}
