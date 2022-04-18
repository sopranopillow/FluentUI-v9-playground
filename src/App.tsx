import React, { ReactNode } from "react";
import "./App.css";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Button,
  CompoundButton,
  CounterBadge,
  Divider,
  FluentProvider,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Portal,
  PresenceBadge,
  SplitButton,
  Text,
  ToggleButton,
  Tooltip,
  webLightTheme,
} from "@fluentui/react-components";

import {
  Card,
  Checkbox,
  Input,
  Label,
  RadioGroup,
  Slider,
  TabList,
} from "@fluentui/react-components/unstable";

/**
 * - figure out how to add props to the components, would be nice to have a popover on hover and then change them there
 * - figure out how to deal with components like popover that have multiple subcomponents that are required:
 *        <Popover>
 *          <PopoverTrigger>
 *          <PopoverSurface>
 *        </Popover
 * - figure out how to improve the handling of DropContainer, maybe make it a droppable component?
 * - figure out how to add more than one components to the dropContainer
 * - make it look nice lol
 * - filter components and unstable_components to remove hooks and such
 */

const stableComponents = {
  Accordion,
  Avatar,
  Badge,
  Button,
  CompoundButton,
  CounterBadge,
  Divider,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Popover,
  Portal,
  PresenceBadge,
  SplitButton,
  Text,
  ToggleButton,
  Tooltip,
};

const unstableComponents = {
  Card,
  Checkbox,
  Input,
  Label,
  RadioGroup,
  Slider,
  TabList,
};

const controlTypes = [
  ...Object.keys(stableComponents),
  ...Object.keys(unstableComponents),
];

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <FluentProvider theme={webLightTheme}>
        <div className="container">
          <div className="leftPanel">
            <Accordion collapsible>
              <AccordionItem value="1">
                <AccordionHeader>Components</AccordionHeader>
                <AccordionPanel>
                  {Object.keys(stableComponents).map((c) => (
                    <DropItem controlType={c}>
                      <Label>{c}</Label>
                    </DropItem>
                  ))}
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem value="2">
                <AccordionHeader>Unstable Components</AccordionHeader>
                <AccordionPanel>
                  {Object.keys(unstableComponents).map((c) => (
                    <DropItem controlType={c}>
                      <Label>{c}</Label>
                    </DropItem>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="canvas">
            <DropContainer />
          </div>
        </div>
      </FluentProvider>
    </DndProvider>
  );
}

type ComponentOverlayProps = {
  children: ReactNode;
};

const ComponentOverlay: React.FC<ComponentOverlayProps> = ({ children }) => {
  if (!React.isValidElement(children)) {
    return null;
  }
  //@ts-ignore
  console.log(children.type.displayName, ...typeof Button);
  // from here we can access its props and having some kind of popover or something we could populate it to modify the props.
  // The only problem is figuring out how to remove the unncessesary ones
  // we could do something like what devtools has that you can add color: #33333, this way we don't have to populate it with all the props

  return (
    <div className="overlay">
      <div className="overlayChild">{children}</div>
      <Popover>
        <PopoverTrigger>
          <Button>Edit</Button>
        </PopoverTrigger>
        <PopoverSurface></PopoverSurface>
      </Popover>
    </div>
  );
};

type ToolbarProps = {
  container: any;
  setContainer: any;
};

const Toolbar: React.FC<ToolbarProps> = ({ container, setContainer }) => {
  return (
    <div className="toolbar">
      <Button onClick={() => setContainer([...container, <DropContainer />])}>
        Add Container
      </Button>
    </div>
  );
};

type DropContainerProps = {
  children?: ReactNode;
};

const DropContainer: React.FC<DropContainerProps> = ({ children }) => {
  const [controls, setControls] = React.useState<any>([]);

  const [, drop] = useDrop(
    () => ({
      accept: controlTypes,
      collect: (monitor) => ({
        canDrop: !!monitor.canDrop(),
      }),
      drop: (item, monitor) => {
        const controlType = monitor.getItemType();
        if (controlType) {
          const Component =
            // @ts-ignore
            stableComponents[controlType] || unstableComponents[controlType];
          setControls([
            ...controls,
            <ComponentOverlay>
              <Component />
            </ComponentOverlay>,
          ]);
        }
      },
    }),
    [controls, setControls]
  );

  return (
    <div className="dropContainer" ref={drop}>
      {controls.map((control: any, index: number) => (
        <div key={`${control.displayName}-${index}`}>{control}</div>
      ))}
    </div>
  );
};

type DropItemProps = {
  children?: ReactNode;
  controlType: string;
};

const DropItem: React.FC<DropItemProps> = ({ children, controlType }) => {
  const [, drag] = useDrag(
    () => ({
      type: controlType,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    []
  );

  return <div ref={drag}>{children}</div>;
};

export default App;
