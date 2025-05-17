import { render } from "@testing-library/react-native";
import React from "react";
import UserDetails from "../components/UserDetails";

describe("UserDetails", () => {
  it("renders all fields correctly", () => {
    const { getByText } = render(
      <UserDetails
        name="John Doe"
        username="johndoe"
        designation="Engineer"
        company="RDS"
      />
    );
    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("@johndoe")).toBeTruthy();
    expect(getByText("Engineer")).toBeTruthy();
    expect(getByText("RDS")).toBeTruthy();
  });

  it("does not render username, designation, or company if empty", () => {
    const { queryByText } = render(
      <UserDetails name="Jane Smith" username="" designation="" company="" />
    );
    expect(queryByText("@")).toBeNull();
    expect(queryByText("")).toBeNull();
    expect(queryByText("Jane Smith")).toBeTruthy();
  });

  it("renders only name if other fields are missing", () => {
    const { getByText, queryByText } = render(
      <UserDetails name="Alice" username="" designation="" company="" />
    );
    expect(getByText("Alice")).toBeTruthy();
    expect(queryByText("@")).toBeNull();
    expect(queryByText("Engineer")).toBeNull();
    expect(queryByText("RDS")).toBeNull();
  });

  it("renders username with @ prefix", () => {
    const { getByText } = render(
      <UserDetails name="Vignesh" username="vbs" designation="" company="" />
    );
    expect(getByText("@vbs")).toBeTruthy();
  });

  it("renders designation and company if provided", () => {
    const { getByText } = render(
      <UserDetails
        name="Vignesh"
        username=""
        designation="Engineer"
        company="RDS"
      />
    );
    expect(getByText("Engineer")).toBeTruthy();
    expect(getByText("RDS")).toBeTruthy();
  });
});
