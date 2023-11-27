import "normalize.css";
import { useState } from "react";
import Plot from "./Plot";
import { useStepsObserver } from "./hooks/useStepsObserver";
import "./App.scss";

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
      <div className="steps">
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
          <div className="description">
            step1: General analysis of all movies. scatter plot. We can add more
            plots after this step.
          </div>
        </div>
        <div
          className="step step2"
          ref={(r) => (steps.current[2] = r)}
          data-idx={2}
        >
          <div className="description">step2: Detail analysis of 2 movies.</div>
        </div>
        <div
          className="step step3"
          ref={(r) => (steps.current[3] = r)}
          data-idx={3}
        >
          <div className="description">
            step3: Explain dialogue analysis and visualization. - Female's line
            highlighting
          </div>
        </div>
        <div
          className="step step4"
          ref={(r) => (steps.current[4] = r)}
          data-idx={4}
        >
          <div className="description">
            step4: Explain dialogue analysis and visualization. - divide by bin
            number.
          </div>
        </div>
        <div
          className="step step5"
          ref={(r) => (steps.current[5] = r)}
          data-idx={5}
        >
          <div className="description">
            step5: Explain dialogue analysis and visualization. - create
            dialogue waffle chart
          </div>
        </div>
      </div>
      {/* <div>Explore</div> */}
    </div>
  );
}

export default App;
