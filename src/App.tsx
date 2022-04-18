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

const controlTypes = [
  ...Object.keys(components),
  ...Object.keys(unstable_components),
];
const controls = { ...components, ...unstable_components };

function App() {
  const [container, setContainer] = useState<ReactNode[]>([]);

  return (
    <DndProvider backend={HTML5Backend}>
      <controls.FluentProvider theme={controls.webLightTheme}>
        <div className="container">
          <div className="leftPanel">
            {Object.keys(controls).map((c, k) => (
              <DropItem controlType={c}>
                <controls.Label>{c}</controls.Label>
              </DropItem>
            ))}
          </div>
          <div className="canvas">
            <Toolbar container={container} setContainer={setContainer} />
            {container}
          </div>
        </div>
      </controls.FluentProvider>
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
  console.log(children.type.displayName, ...typeof controls.Button);
  // from here we can access its props and having some kind of popover or something we could populate it to modify the props.
  // The only problem is figuring out how to remove the unncessesary ones
  // we could do something like what devtools has that you can add color: #33333, this way we don't have to populate it with all the props

  return (
    <div className="overlay">
      <div className="overlayChild">{children}</div>
      <controls.Popover>
        <controls.PopoverTrigger>
          <controls.Button>Edit</controls.Button>
        </controls.PopoverTrigger>
        <controls.PopoverSurface></controls.PopoverSurface>
      </controls.Popover>
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
      <controls.Button
        onClick={() => setContainer([...container, <DropContainer />])}
      >
        Add Container
      </controls.Button>
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
          const Component = controls[controlType];
          setControl(
            <ComponentOverlay>
              <Component />
            </ComponentOverlay>
          );
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
