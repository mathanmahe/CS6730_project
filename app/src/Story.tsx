import { useState } from "react";
import Plot from "./Plot";
import "./Story.scss";
import { Radio } from "antd";

export const Story = ({ stepsRef, activeStep, dashboardActive }) => {
  const [sizeFactor, setSizeFactor] = useState("none");
  const onChangeSelect = ({ target: { value } }) => {
    setSizeFactor(value);
  };
  return (
    <div className="container">
      <div
        className="vis"
        style={{ display: dashboardActive.isIntersecting ? "none" : "block" }}
      >
        <Plot
          activeStep={activeStep}
          dashboardActive={dashboardActive}
          sizeFactor={sizeFactor}
          setSizeFactor={setSizeFactor}
        />
      </div>
      <div className="steps">
        <div
          className="step title"
          ref={(r) => (stepsRef.current[0] = r)}
          data-idx={0}
        >
          <h1>Representation of Women in IMDb Top 250</h1>
        </div>
        <div
          className="step step1"
          ref={(r) => (stepsRef.current[1] = r)}
          data-idx={1}
        >
          <div className="content">
            <div className="title">IMDb Top 250 Movies Timeline </div>
            <div className="desc">
              From the 1950s through the 2020s, the IMDb Top 250 movies
              represent a range of decades. These critically acclaimed and
              popular films reflect the zeitgeist of their times. But how do
              they represent women? Are they portraying complex and independent
              female characters? By examining the representation of women in
              these films, we can glean insights into how society's perception
              of women has evolved.
            </div>
          </div>
        </div>
        <div className="step step1-1">
          <div className="content">
            <div className="title">
              How to Assess the Representation of Women? - Bechdel Score
            </div>
            <div className="desc">
              To evaluate women's representation in these films, we utilized the
              Bechdel Test as a primary metric. This test examines if a film
              features at least two women who talk to each other about something
              other than a man.
              <br />
              score 0:
              <br />
              score 1:
              <br />
              score 2:
              <br />
              score 3:
              <br />
            </div>
          </div>
        </div>
        <div
          className="step step2"
          ref={(r) => (stepsRef.current[2] = r)}
          data-idx={2}
        >
          <div className="content">
            <div className="title">Change in Bechdel Scores Over Time </div>
            <div className="desc">
              We analyzed the Bechdel scores of these movies by decade,
              presented through a stacked area chart. This visualization
              highlights a gradual increase in films passing the Bechdel Test,
              especially noticeable in the 2010s. The 1980s might be seen as a
              dark period for the representation of women, with a marked
              improvement in the following decades.
            </div>
          </div>
        </div>
        <div
          className="step step3"
          ref={(r) => (stepsRef.current[3] = r)}
          data-idx={3}
        >
          <div className="content">
            <div className="title">Genre-wise Bechdel Score Distribution</div>
            <div className="desc">
              Exploring the possibility of genre influencing women's
              representation, we plotted the Bechdel scores of top 250 movies
              across different genres using a beeswarm chart. Notably, genres
              like crime, action, and adventure, which were once almost
              exclusively male-centric, have shown a significant shift, with
              most films in these categories passing the Bechdel Test in recent
              times.
            </div>
            <div className="buttons">
              <Radio.Group
                defaultValue="a"
                buttonStyle={"solid"}
                onChange={onChangeSelect}
                value={sizeFactor}
              >
                <Radio.Button value="imDbRatingVotes">Budget</Radio.Button>
                {/* <Radio.Button value="posterFProportion">Poster</Radio.Button> */}
                <Radio.Button value="worldGross">Gross</Radio.Button>
                <Radio.Button value="none">None</Radio.Button>
              </Radio.Group>
              <div className="desc">
                We also examined whether films with better representation of
                women received more funding or earned higher revenues by mapping
                size of unit. Interestingly, while no clear pattern emerged
                regarding budget, high-grossing action and adventure films in
                recent years predominantly passed the Bechdel Test. This trend
                might indicate a growing audience preference for films with
                well-represented female characters.
              </div>
            </div>
          </div>
        </div>
        <div
          className="step step4"
          ref={(r) => (stepsRef.current[4] = r)}
          data-idx={4}
        >
          <div className="content">
            <div className="title">Beyond the Bechdel Test</div>
            <div className="desc">
              Besides the Bechdel Score, we looked at other indicators of
              women's representation: <br />
              Director's Gender: Considering the significant male dominance in
              film direction, we explored how many top 250 films were directed
              by women. Unfortunately, only a handful of these films had female
              directors, highlighting the need for more gender diversity in this
              role.
            </div>
          </div>
        </div>
        <div
          className="step step5"
          ref={(r) => (stepsRef.current[5] = r)}
          data-idx={5}
        >
          <div className="content">
            <div className="title">Beyond the Bechdel Test</div>
            <div className="desc">
              Script Analysis: A comprehensive analysis of women's
              representation requires a deeper dive into the content. For
              instance, examining the scripts of 'Jaws' and 'Jurassic Park'
              (both are adventure and passing the Bechdel Test) revealed
              significant differences in the portrayal of female characters.
            </div>
          </div>
        </div>
        <div
          className="step step6"
          ref={(r) => (stepsRef.current[6] = r)}
          data-idx={6}
        >
          <div className="content">
            <div className="title">Highlighting Female Dialogue in Scripts</div>
            <div className="desc">
              We highlighed Female charactor's diague only. In 'Jurassic Park,'
              female dialogue was nearly 50% of the script, evenly distributed
              throughout the movie, unlike the other film with less prominent
              female dialogue.
            </div>
          </div>
        </div>
        <div
          className="step step7"
          ref={(r) => (stepsRef.current[7] = r)}
          data-idx={7}
        >
          <div className="content">
            <div className="title">
              A Segment-Based Female Dialogue Proportion: Dialogue Waffle
              Diagram
            </div>
            <div className="desc">
              By segmenting each movie script into 100 equal parts and analyzing
              the proportion of women's dialogues, we can better understand and
              easily compare the nuances of how women are represented in these
              films.
            </div>
          </div>
        </div>
        <div
          className="step step8"
          ref={(r) => (stepsRef.current[8] = r)}
          data-idx={8}
        >
          <div className="content">
            <div className="title"> TODO: Emotional Analysis of Dialogues</div>
            <div className="desc">
              'Jaws' showed female dialogues focused mainly on anger and joy. In
              contrast, 'Jurassic Park' presented a wider range of emotions in
              female dialogues, suggesting a richer representation of women.
            </div>
          </div>
        </div>
        <div
          className="step step9"
          ref={(r) => (stepsRef.current[9] = r)}
          data-idx={9}
        >
          <div className="content">
            <div className="desc">
              Now, let's explore Dialogue Waffle Diagrams and Script Analyses
              for the Remaining Films!
            </div>
          </div>
        </div>
        {/* <div
          className="step step10"
          ref={(r) => (stepsRef.current[10] = r)}
          data-idx={10}
        >
          <div className="content">step10: remove </div>
        </div> */}
      </div>
    </div>
  );
};
