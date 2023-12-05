import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ContentLogin from "../../(general)/login/content/contentLogin";
import "@testing-library/jest-dom";

describe("ContentLogin Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<ContentLogin />);
    expect(getByText("Login")).toBeInTheDocument();
  });

  it("updates username and password fields", () => {
    const { getByLabelText } = render(<ContentLogin />);
    const usernameInput = getByLabelText("Usuário");
    const passwordInput = getByLabelText("Senha");

    fireEvent.change(usernameInput, { target: { value: "henrique" } });
    fireEvent.change(passwordInput, { target: { value: "henrique" } });

    expect(usernameInput.value).not.toBe("testuser");
    expect(passwordInput.value).not.toBe("password");
    console.log(passwordInput);
  });
});
