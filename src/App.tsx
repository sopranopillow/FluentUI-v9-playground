import React, { ReactNode } from "react";
import "./App.css";
import * as components from "@fluentui/react-components";
import * as unstable_components from "@fluentui/react-components/unstable";
import { DndProvider, DragPreviewImage, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <div className="leftPanel">
          {Object.keys(components).map((c) => (
            <DropItem>
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
          <DropContainer />
        </div>
      </div>
    </DndProvider>
  );
}

type DropContainerProps = {
  children?: ReactNode;
};

const DropContainer: React.FC<DropContainerProps> = ({ children }) => {
  const [{ canDrop }, drop] = useDrop(
    () => ({
      accept: "item",
      collect: (monitor) => ({
        canDrop: !!monitor.canDrop(),
      }),
    }),
    []
  );
  return (
    <div className="dropContainer" ref={drop}>
      <div>{children}</div>
    </div>
  );
};

type DropItemProps = {
  children?: ReactNode;
};

const DropItem: React.FC<DropItemProps> = ({ children }) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "item",
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    []
  );

  return <div ref={drag}>{children}</div>;
};

export default App;
