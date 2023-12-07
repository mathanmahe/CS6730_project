import React, { useEffect, useState } from "react";
import dialogueDataOrigin from "./assets/dialogue.json";
import "./Dashboard.scss";
import * as d3 from "d3";
import classNames from "classnames";
import { SentimentVis } from "./SentimentVis";
import { WaffleChart } from "./WaffleChart";
import { Tooltip } from "antd";
import { colorGenderMap } from "./utils/data";
import { data as data250 } from "./utils/data";

export const DashboardDetail = ({ item }) => {
  const {
    id,
    title,
    lines,
    data,
    totalWordCount,
    genderWordCount,
    genderWordPercent,
  } = item;

  const { posterFProportion, posterMProportion } = data;
  const [selectedGender, setGender] = useState();
  const [posterProp, setPosterProp] = useState();

  console.log(selectedGender);
  const onHoverGenderButton = (e) => {
    setGender(e.target.getAttribute("data-gender"));
  };

  useEffect(() => {
    const { posterFProportion, posterMProportion } = data250.find(
      (d) => d.id === id
    );
    setPosterProp({ female: posterFProportion, male: posterMProportion });
  }, [item]);

  const binSize = Math.max(18, window.innerWidth * 0.01);

  return (
    <div className="dashboard-modal">
      <div className="left">
        <div className="head-title">
          <span>{data.title}</span> <div className="desc">#{data.rank}</div>
        </div>
        <div className="main-info">
          <div
            className="poster"
            style={{
              backgroundImage: `url("https://github.com/aereeeee/CS6730_project/blob/main/posters/annotated/${data.id}.jpg?raw=true")`,
            }}
          ></div>
          <div
            className="waffle"
            style={{ width: binSize * 10 + "px", height: binSize * 10 + "px" }}
          >
            <WaffleChart
              data={lines}
              binSize={binSize}
              chunkSize={100}
              index={0}
              transition={false}
            />
          </div>
        </div>
        <div>
          <div className="combine">
            <div className="item">
              <div className="title">Date</div>
              <p>{data.releaseDate}</p>
            </div>
            <div className="item">
              <div className="title">Directors</div>
              <p>{data.directors}</p>
            </div>
            <div className="item">
              <div className="title">Bechdel</div>
              <p className="r-align">{data.BechdelRating}</p>
            </div>
          </div>
          <div className="item">
            <div className="title">Keywords</div>
            <p>{data.keywords}</p>
          </div>
          <div className="item">
            <div className="title">Plot</div>
            <p>{data.plot}</p>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="section actors">
          <div className="title">Main Characters</div>
          <div
            className={classNames("actors-list", {
              active: !!selectedGender,
            })}
          >
            {data.actorList?.slice(0, 10).map((d) => {
              return (
                <div
                  className={classNames("actor-item", {
                    active: d.gender?.toLowerCase() === selectedGender,
                  })}
                  key={d.id}
                >
                  <div
                    className="img"
                    style={{ backgroundImage: `url(${d.image})` }}
                  ></div>
                  <div className="name">{d.name}</div>
                  <div className="character">{d.asCharacter}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={classNames("legend", {
            active: !!selectedGender,
          })}
          onMouseLeave={() => {
            setGender(null);
          }}
        >
          <div
            className={classNames("legend-item female", {
              active: selectedGender === "female",
            })}
            data-gender="female"
            onMouseOver={onHoverGenderButton}
          >
            Female
          </div>
          <div
            className={classNames("legend-item male", {
              active: selectedGender === "male",
            })}
            data-gender="male"
            onMouseOver={onHoverGenderButton}
          >
            Male
          </div>
          <div
            className={classNames("legend-item na", {
              active: selectedGender === "na",
            })}
            data-gender="na"
            onMouseOver={onHoverGenderButton}
          >
            Unknown
          </div>
        </div>
        <div className="top-section">
          <div className="section poster-proportion">
            <div className="title">Gender Dominance in Movie Poster </div>
            {/* <div className="description">
            The dialogue amount for each gender is calculated based on the
            number of words spoken by each character.
          </div> */}
            <div
              className={classNames("vis-section proportion-vis", {
                active: !!selectedGender,
              })}
              onMouseLeave={() => {
                setGender(null);
              }}
            >
              <span>0%</span>
              {Object.entries(posterProp || {}).map(([key, val]) => (
                <Tooltip
                  placement="bottom"
                  title={(val * 100).toFixed(2) + "%"}
                  key={key + "poster"}
                >
                  <div
                    className={classNames("bar", key, {
                      active: selectedGender === key,
                    })}
                    data-gender={key}
                    style={{
                      width: `${val * 100}%`,
                      background: colorGenderMap[key],
                    }}
                    onMouseOver={onHoverGenderButton}
                  ></div>
                </Tooltip>
              ))}
              <span>100%</span>
            </div>
          </div>
          <div className="section script-proportion">
            <div className="title">Gender Dialogue Amount Ratio</div>
            {/* <div className="description">
            The dialogue amount for each gender is calculated based on the
            number of words spoken by each character.
          </div> */}
            <div
              className={classNames("vis-section proportion-vis", {
                active: !!selectedGender,
              })}
              onMouseLeave={() => {
                setGender(null);
              }}
            >
              <span>0%</span>
              {Object.entries(genderWordPercent).map(([key, val]) => (
                <Tooltip
                  placement="bottom"
                  title={(val * 100).toFixed(2) + "%"}
                  key={key}
                >
                  <div
                    key={key}
                    className={classNames("bar", key, {
                      active: selectedGender === key,
                    })}
                    data-gender={key}
                    style={{
                      width: `${val * 100}%`,
                      background: colorGenderMap[key],
                    }}
                    onMouseOver={onHoverGenderButton}
                  ></div>
                </Tooltip>
              ))}
              <span>100%</span>
            </div>
          </div>
        </div>
        <div className="section script-sentiment">
          <div className="title">Dialogue Emotion Analysis</div>
          {/* <div className="description">
            Comparing the emotions expressed in the dialogues of male and female
            characters.
          </div> */}
          <div className="vis-section">
            <SentimentVis
              item={item}
              activeGender={selectedGender}
            ></SentimentVis>
          </div>
        </div>
      </div>
    </div>
  );
};
