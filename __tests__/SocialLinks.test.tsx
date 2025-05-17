import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Linking } from "react-native";
import SocialLinks from "../components/SocialLinks";

jest.spyOn(Linking, "openURL").mockImplementation(jest.fn());

describe("SocialLinks", () => {
  beforeEach(() => {
    (Linking.openURL as jest.Mock).mockClear();
  });

  it("renders all social icons when all IDs are provided", () => {
    const { getByTestId } = render(
      <SocialLinks
        github_id="octocat"
        twitter_id="twitteruser"
        linkedin_id="linkedinuser"
      />
    );
    expect(getByTestId("twitter-icon")).toBeTruthy();
    expect(getByTestId("linkedin-icon")).toBeTruthy();
    expect(getByTestId("github-icon")).toBeTruthy();
  });

  it("does not render icons if IDs are missing", () => {
    const { queryByTestId } = render(
      <SocialLinks github_id="" twitter_id="" linkedin_id="" />
    );
    expect(queryByTestId("twitter-icon")).toBeNull();
    expect(queryByTestId("linkedin-icon")).toBeNull();
    expect(queryByTestId("github-icon")).toBeNull();
  });

  it("opens Twitter URL when Twitter icon is pressed", () => {
    const { getByTestId } = render(
      <SocialLinks github_id="" twitter_id="twitteruser" linkedin_id="" />
    );
    fireEvent.press(getByTestId("twitter-icon"));
    expect(Linking.openURL).toHaveBeenCalledWith(
      "https://twitter.com/twitteruser"
    );
  });

  it("opens LinkedIn URL when LinkedIn icon is pressed", () => {
    const { getByTestId } = render(
      <SocialLinks github_id="" twitter_id="" linkedin_id="linkedinuser" />
    );
    fireEvent.press(getByTestId("linkedin-icon"));
    expect(Linking.openURL).toHaveBeenCalledWith(
      "https://www.linkedin.com/in/linkedinuser"
    );
  });

  it("opens GitHub URL when GitHub icon is pressed", () => {
    const { getByTestId } = render(
      <SocialLinks github_id="octocat" twitter_id="" linkedin_id="" />
    );
    fireEvent.press(getByTestId("github-icon"));
    expect(Linking.openURL).toHaveBeenCalledWith("https://github.com/octocat");
  });
});
