import React, { ReactNode } from "react";
import "./App.css";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { propObject } from "./propObjects";
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
import { Identifier } from "typescript";

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
  controlType: any;
};

const ComponentOverlay: React.FC<ComponentOverlayProps> = ({
  controlType,
  children,
}) => {
  let child = children;

  if (
    propObject[controlType as keyof typeof propObject].hasChildren &&
    React.isValidElement(children)
  ) {
    child = React.cloneElement(children, {
      children: <DropContainer />,
    });
  }

  return (
    <div className="overlay">
      <div className="overlayChild">{child}</div>
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
            <ComponentOverlay controlType={controlType}>
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
