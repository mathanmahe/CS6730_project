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
          <div className="description">step1: timeline unit</div>
        </div>
        <div
          className="step step2"
          ref={(r) => (steps.current[2] = r)}
          data-idx={2}
        >
          <div className="description">step2: bechdel + time alluvial</div>
        </div>
        <div
          className="step step3"
          ref={(r) => (steps.current[3] = r)}
          data-idx={3}
        >
          <div className="description">step3: beeswarm gere + time</div>
        </div>
        <div
          className="step step4"
          ref={(r) => (steps.current[4] = r)}
          data-idx={4}
        >
          <div className="description">
            step4: director gender //poster scatter plot
          </div>
        </div>
        <div
          className="step step5"
          ref={(r) => (steps.current[5] = r)}
          data-idx={5}
        >
          <div className="description">step5: select 2 movies.</div>
        </div>
        <div
          className="step step6"
          ref={(r) => (steps.current[6] = r)}
          data-idx={6}
        >
          <div className="description">
            step6: unit to text script Explain dialogue analysis and
            visualization.
          </div>
        </div>
        <div
          className="step step7"
          ref={(r) => (steps.current[7] = r)}
          data-idx={7}
        >
          <div className="description">step7: highlight woman's line</div>
        </div>
        <div
          className="step step8"
          ref={(r) => (steps.current[8] = r)}
          data-idx={8}
        >
          <div className="description">step8: dialogue waffle chart</div>
        </div>
      </div>
      {/* <div>Explore</div> */}
    </div>
  );
}

export default App;
