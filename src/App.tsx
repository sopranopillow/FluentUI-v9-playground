import React, { ReactNode, useState } from "react";
import "./App.css";
import * as components from "@fluentui/react-components";
import * as unstable_components from "@fluentui/react-components/unstable";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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

const controlTypes = Object.keys(components);

function App() {
  const [container, setContainer] = useState<ReactNode[]>([]);

  return (
    <DndProvider backend={HTML5Backend}>
      <components.FluentProvider theme={components.webLightTheme}>
        <div className="container">
          <div className="leftPanel">
            {Object.keys(components).map((c) => (
              <DropItem controlType={c}>
                <unstable_components.Label>{c}</unstable_components.Label>
              </DropItem>
            ))}
            {/* {Object.keys(unstable_components).map((c) => (
            <DropItem>
              <Label>{c}</Label>
            </DropItem>
          ))} */}
            {/* <components.Button appearance="primary">Hello</components.Button> */}
          </div>
          <div className="canvas">
            <Toolbar container={container} setContainer={setContainer} />
            {container}
          </div>
        </div>
      </components.FluentProvider>
    </DndProvider>
  );
}

type ToolbarProps = {
  container: any;
  setContainer: any;
};

const Toolbar: React.FC<ToolbarProps> = ({ container, setContainer }) => {
  return (
    <div className="toolbar">
      <components.Button
        onClick={() => setContainer([...container, <DropContainer />])}
      >
        Add Container
      </components.Button>
    </div>
  );
};

type DropContainerProps = {
  children?: ReactNode;
};

const DropContainer: React.FC<DropContainerProps> = ({ children }) => {
  const [control, setControl] = React.useState<any>(null);
  const [{ canDrop }, drop] = useDrop(
    () => ({
      accept: controlTypes,
      collect: (monitor) => ({
        canDrop: !!monitor.canDrop(),
      }),
      drop: (item, monitor) => {
        const controlType = monitor.getItemType();
        if (controlType) {
          // @ts-ignore
          const Component = components[controlType];
          setControl(<Component></Component>);
        }
      },
    }),
    [setControl]
  );

  return (
    <div className="dropContainer" ref={drop}>
      <div>{children}</div>
      {control}
    </div>
  );
};

type DropItemProps = {
  children?: ReactNode;
  controlType: string;
};

const DropItem: React.FC<DropItemProps> = ({ children, controlType }) => {
  const [{ isDragging }, drag, preview] = useDrag(
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
