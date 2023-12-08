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
              What do the highest rated movies of a time say about the people
              who watch them? From the 1950s to the 2020s, the IMDb top 250
              movies represent the changing mindsets of audiences and directors.
              The way we represent women in films speaks volumes about the
              societal mindset towards them. We aim to explore the question- how
              do the top films represent women and how has that changed over
              time?
            </div>
          </div>
        </div>
        <div
          className="step step2"
          ref={(r) => (stepsRef.current[2] = r)}
          data-idx={2}
        >
          <div className="content">
            <div className="title">
              Bechdel Test: How to Assess the Representation of Women?
            </div>
            <div className="desc">
              In our analysis of women's representation in film, the{" "}
              <a href="https://en.wikipedia.org/wiki/Bechdel_test">
                Bechdel Test
              </a>{" "}
              serves as a crucial benchmark. This test, named after cartoonist
              Alison Bechdel, offers a simple way to gauge the presence and
              significance of female characters in movies. To pass the test, a
              film must meet three key criteria:
              <div className="list">
                <div>
                  <span className="chip zero"></span>None of the below criteria
                  apply.
                </div>
                <div>
                  <span className="chip one"></span>The presence of at least two
                  named female characters.
                </div>
                <div>
                  <span className="chip two"></span>These characters engage in a
                  conversation with each other.
                </div>
                <div>
                  <span className="chip three"></span>The topic of their
                  conversation is about something other than a man. (Test Pass!)
                </div>
              </div>
              Each criterion met earns the film one point, creating a scoring
              system that ranges from 0 to 3.
              <div className="sub">
                * In the chart on the left, movies are sorted based on their
                rank, with the highest ranked at the bottom.
              </div>
            </div>
          </div>
        </div>
        <div
          className="step step3"
          ref={(r) => (stepsRef.current[3] = r)}
          data-idx={3}
        >
          <div className="content">
            <div className="title">Change in Bechdel Scores Over Time </div>
            <div className="desc">
              We analyzed the proportion of top 250 movies by decade that pass
              the Bechdel Test, presented through a 100% stacked area chart. A
              gradual increase in films passing the Bechdel Test is observed,
              especially noticeable in the 2010s. The 1980s have the lowest
              number of movies that pass the Bechdel Test.
            </div>
          </div>
        </div>
        <div
          className="step step4"
          ref={(r) => (stepsRef.current[4] = r)}
          data-idx={4}
        >
          <div className="content">
            <div className="title">Genre-wise Bechdel Score Distribution</div>
            <div className="desc">
              Since women's representation various greatly across genres, we
              plotted the Bechdel scores of the top 250 movies using a beeswam
              chart. We can see that genres like crime, action, and adventure
              were almost entirely male-centric, are doing better in recent
              years.
            </div>
            <div className="buttons">
              <div className="title">Change unit size by</div>
              <Radio.Group
                defaultValue="a"
                buttonStyle={"solid"}
                onChange={onChangeSelect}
                value={sizeFactor}
              >
                <Radio.Button value="imDbRatingVotes">Popularity</Radio.Button>
                <Radio.Button value="worldGross">Gross</Radio.Button>
                <Radio.Button value="none">None</Radio.Button>
              </Radio.Group>
              <div className="desc">
                So, do movies with better representation of women get more
                popularity and revenue? We mapped unit size to IMDB votes and
                worldwide gross. While votes don't seem to have much to do with
                whether or not a movie passes the test, we can see that recent
                big grossing movies all passed the Bechdel test.
              </div>
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
              Besides the Bechdel Score, we looked at other indicators of
              women's representation: <br />
              <div className="sub-title">Director's Gender</div>
              Considering the significant male dominance in film direction, we
              explored how many top 250 films were directed by women.
              Unfortunately, only a handful of these films had female directors.
            </div>
          </div>
        </div>
        <div
          className="step step6"
          ref={(r) => (stepsRef.current[6] = r)}
          data-idx={6}
        >
          <div className="content">
            <div className="title">Beyond the Bechdel Test</div>
            <div className="desc">
              <div className="sub-title">Script Insights</div>
              The Bechdel Test is an initial gauge of female representation in
              films, highlighting the presence of women. However, it doesn't
              assess the depth or complexity of female characters and
              narratives. A deeper script analysis can reveal more, as seen in
              movies like 'Jaws' and 'Jurassic Park'. Both pass the Bechdel Test
              and fall under the adventure genre, yet they show notable
              differences in how female characters are portrayed.
            </div>
          </div>
        </div>
        <div
          className="step step7"
          ref={(r) => (stepsRef.current[7] = r)}
          data-idx={7}
        >
          <div className="content">
            <div className="title">Highlighting Female Dialogue in Scripts</div>
            <div className="desc">
              To assess the frequency and prominence of female dialogue in film
              scripts, we highlighted dialogues of female characters in the
              scripts. In 'Jurassic Park,' female dialogue comprised nearly half
              of the script and was evenly distributed across the film. This is
              in contrast to 'Jaws,' where female dialogue is primarily confined
              to specific scenes only, highlighting the differences in how
              female characters are given a voice in these movies.
            </div>
          </div>
        </div>
        <div
          className="step step8"
          ref={(r) => (stepsRef.current[8] = r)}
          data-idx={8}
        >
          <div className="content">
            <div className="title">
              A Segment-Based Female Dialogue Proportion
            </div>
            <div className="desc">
              To facilitate a clear comparison of where and how much women speak
              from the beginning to the end of a movie, we created a waffle
              chart visualization. By segmenting each movie script into 100
              equal parts, the chart fills in colors based on the proportion of
              women's dialogues in each segment. This method provides an
              at-a-glance view, enabling an easy comparison of female dialogue
              distribution throughout the films.
            </div>
          </div>
        </div>
        <div
          className="step step9"
          ref={(r) => (stepsRef.current[9] = r)}
          data-idx={9}
        >
          <div className="content">
            <div className="title"> Emotional Analysis of Dialogues</div>
            <div className="desc">
              Additionally, we visualized the diversity of emotions expressed by
              women in comparison to men in films through sentiment analysis of
              movie dialogues. This approach helps us determine how
              multidimensionally women are portrayed. For instance, in 'Jaws,'
              female dialogues predominantly revolved around anger and joy. In
              contrast, 'Jurassic Park' showcased a broader spectrum of emotions
              in female dialogues, indicating a more nuanced and richer
              representation of women.
            </div>
          </div>
        </div>
        <div
          className="step step10"
          ref={(r) => (stepsRef.current[10] = r)}
          data-idx={10}
        >
          <div className="content">
            <div className="desc">
              Now, let's dive into the portrayal of women in top 250 movie
              scripts. Click on the waffle chart to see script sentiment
              analysis and gender representation in movie posters.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
