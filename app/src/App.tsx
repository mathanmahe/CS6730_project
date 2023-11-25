import "normalize.css";
import { useState } from "react";
import Plot from "./Plot";
import { useStepsObserver } from "./hooks/useStepsObserver";

function App() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = useStepsObserver((el) => {
    const idx = el?.getAttribute("data-idx");
    setActiveStep(Number(idx));
  });

  return (
    <div className="container">
      <div className="vis">
        <Plot activeStep={activeStep} />
      </div>
      <div
        className="step title"
        ref={(r) => (steps.current[0] = r)}
        data-idx={0}
      >
        <h1>Title: movie posters</h1>
      </div>
      <div
        className="step step1"
        ref={(r) => (steps.current[1] = r)}
        data-idx={1}
      >
        <div className="description">step1: scatter plot</div>
      </div>
      <div
        className="step step2"
        ref={(r) => (steps.current[2] = r)}
        data-idx={2}
      >
        <div className="description">step2: compare 2 movies</div>
      </div>
      <div
        className="step step3"
        ref={(r) => (steps.current[3] = r)}
        data-idx={3}
      >
        <div className="description">step3: explain dialog analysis</div>
      </div>
    </div>
  );
}

export default App;
