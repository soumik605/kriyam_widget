import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import FeedbackChatbox from "./components/FeedbackChatbox";

declare global {
  interface Window {
    initWidget: () => void;
    _widgetRoot?: Root;
  }
}

window.initWidget = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found!");
    return;
  }

  // If a React root already exists, update it instead of creating a new one
  if (!window._widgetRoot) {
    window._widgetRoot = createRoot(rootElement);
  }

  window._widgetRoot.render(
    <StrictMode>
      <FeedbackChatbox />
    </StrictMode>
  );
};

window.initWidget();