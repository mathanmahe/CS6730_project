import "normalize.css";
import { Story } from "./Story";
import { Dashboard } from "./Dashboard";
import { useStepsObserver } from "./hooks/useStepsObserver";
import { useState } from "react";
import { ConfigProvider, theme } from "antd";

function App() {
  const [activeStep, setActiveStep] = useState("0");
  const [dashboardActive, setDashboardActive] = useState(false);

  const steps = useStepsObserver(
    (el) => {
      if (el) {
        const idx = el?.getAttribute("data-idx");
        setActiveStep(idx);
      }
    },
    { threshold: 0.5 }
  );

  const dashboard = useStepsObserver(
    (el, [entry]) => {
      setDashboardActive(entry);
    },
    { threshold: [0, 0.1] }
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#f66",
          fontFamily: "Poppins",
        },
      }}
    >
      <div>
        <Story
          stepsRef={steps}
          activeStep={activeStep}
          dashboardActive={dashboardActive}
        />
        <Dashboard
          activeStep={activeStep}
          dashboardRef={dashboard}
          dashboardActive={dashboardActive}
        />
      </div>
    </ConfigProvider>
  );
}

export default App;
