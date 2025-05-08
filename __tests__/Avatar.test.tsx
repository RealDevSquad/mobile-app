import Avatar from "@/components/Avatar";
import { render } from "@testing-library/react-native";
import React from "react";

describe("Avatar Component", () => {
  it("renders correctly with uri", () => {
    const uri = "https://example.com/image.jpg";
    const size = 50;

    const { getByTestId } = render(<Avatar uri={uri} size={size} />);
    const image = getByTestId("avatar-image");
    expect(image.props.source[0].uri).toBe(uri);
    expect(image.props.style.width).toBe(size);
    expect(image.props.style.height).toBe(size);
  });

  it("renders with correct size and border radius", () => {
    const size = 100;
    const { getByTestId } = render(
      <Avatar uri="https://example.com/image.jpg" size={size} />
    );
    const image = getByTestId("avatar-image");

    expect(image.props.style.width).toBe(size);
    expect(image.props.style.height).toBe(size);
    expect(image.props.style.borderRadius).toBe(size / 2);
  });
});
