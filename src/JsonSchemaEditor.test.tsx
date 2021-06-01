import React from "react";
import { render } from "@testing-library/react";

import JsonSchemaEditor from "./JsonSchemaEditor";
import { SchemaEditorProps } from "./JsonSchemaEditor/JsonSchemaEditor.types";

const printIt = (schema: string) => {
  console.log(schema);
};

describe("JsonSchemaEditor", () => {
  let props: SchemaEditorProps;

  beforeEach(() => {
    props = {
      onSchemaChange: printIt,
    };
  });

  const renderComponent = () => render(<JsonSchemaEditor {...props} />);

  it("should have primary className with default props", () => {
    renderComponent();

    const { container } = renderComponent();

    // const testComponent = getByTestId("jsonschema-editor");
    console.log(container.innerHTML);

    // expect(testComponent).toHaveClass("test-component-primary");

    // console.log(result.asFragment.toString);
    // // expect(screen.getByText("root")).toBeInTheDocument();
    // expect(true).toBe(true);
  });
});

// test("renders learn react link", () => {
//   render(<JsonSchemaEditor onSchemaChange={() => {}} />);
//   const linkElement = screen.getByText(/learn chakra/i);
//   expect(linkElement).toBeInTheDocument();
// });
