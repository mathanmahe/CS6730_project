import { WaffleChart } from "./WaffleChart";
import "./Dashboard.scss";
import { Select, Popover, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { DashboardDetail } from "./DashboardDetail";

export const Dashboard = ({ dashboardRef, dashboardActive, activeStep }) => {
  const [dialogueData, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dashboardActive.isIntersecting || !!dialogueData || loading) return;
    const importData = async () => {
      setLoading(true);
      const module = await import("./assets/dialogue.json");
      setData(module.default);
      setLoading(false);
    };

    importData();
  }, [dashboardActive]);

  const [searchValue, setValue] = useState([]);
  const chunkSize = 100;
  // const [chunkSize, setChunkSize] = useState(100);

  const binSize = 18;
  const numPerRow = Math.sqrt(chunkSize);

  const onChange = (newValue: string[]) => {
    setValue(newValue);
  };

  // const handleSizeChange = (e: RadioChangeEvent) => {
  //   setChunkSize(Number(e.target.value));
  // };
  const [open, setOpen] = useState(false);
  const [selected, setSlected] = useState();

  return (
    <div className="dashboard" ref={(r) => (dashboardRef.current[0] = r)}>
      {(!dialogueData || loading) && dashboardActive.isIntersecting && (
        <div className="loading">
          <Spin /> <span>Loading dialogues..</span>
        </div>
      )}
      <Modal
        // title={selected?.title}
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={"95%"}
        footer={[]}
      >
        <DashboardDetail item={selected} />
      </Modal>
      <div className="dashboard-inner">
        <div className="head">
          <div className="title">Explore Top 250 Movie Scripts</div>
          <div className="utils">
            <div className="utils-left">
              <Select
                style={{ width: 300 }}
                placeholder="Search a movie"
                onChange={onChange}
                value={searchValue}
                mode={"multiple"}
                maxTagCount={"responsive"}
                disabled={!dialogueData}
                options={dialogueData?.map((d) => ({
                  label: d.title,
                  value: d.title,
                }))}
              />
            </div>
            <div className="utils-right">
              {/* <Radio.Group
                value={String(chunkSize)}
                onChange={handleSizeChange}
              >
                <Radio.Button value="100">100</Radio.Button>
                <Radio.Button value="25">20</Radio.Button>
                <Radio.Button value="4">1</Radio.Button>
              </Radio.Group> */}
              <div className="legend">
                <div>Female Dialogue:</div>

                <span>0%</span>
                <div className="legend-box"></div>
                <span>100%</span>
              </div>
              <div className="sort">
                <div>Sort by</div>
                <Select
                  defaultValue="lucy"
                  style={{ width: 120 }}
                  onChange={(value: string) => {
                    console.log(`selected ${value}`);
                  }}
                  options={[
                    { value: "jack", label: "Jack" },
                    { value: "lucy", label: "Lucy" },
                    { value: "Yiminghe", label: "yiminghe" },
                    {
                      value: "disabled",
                      label: "Disabled",
                      disabled: true,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          {dialogueData &&
            dialogueData.map((d, i) => (
              <Popover
                key={d.id}
                content={<TooltipContent data={d.data} />}
                placement="right"
                arrow={{ pointAtCenter: true }}
              >
                <div
                  className="item-box"
                  style={{ width: numPerRow * binSize + "px" }}
                  onClick={() => {
                    setOpen(true);
                    setSlected(d);
                  }}
                >
                  <div className="title">
                    #{d.data.rank} {d.title}
                  </div>
                  <WaffleChart
                    key={d.fileName}
                    title={d.title}
                    data={d.lines}
                    isActive={dashboardActive}
                    index={i}
                    chunkSize={chunkSize}
                    binSize={binSize}
                  />
                </div>
              </Popover>
            ))}
        </div>
      </div>
    </div>
  );
};

export const TooltipContent = ({ data }) => {
  return (
    data && (
      <div className="dashboard-popover">
        <div className="title">{data.title}</div>
        <div className="dashboard-popover-content">
          <div className="left">
            <div
              className="poster"
              style={{
                backgroundImage: `url("./posters/${data.rank}_${data.id}.jpg")`,
              }}
            ></div>
          </div>
          <div className="right">
            <div className="item">
              <span className="key">Rank</span>
              <span className="value"># {data.rank}</span>
            </div>
            <div className="item">
              <span className="key">Released at</span>
              <span className="value">{data.releaseDate}</span>
            </div>
            <div className="item">
              <span className="key">Genres</span>
              <span className="value">{data.genres}</span>
            </div>
            <div className="item">
              <span className="key">Director</span>
              <span className="value">{data.directors}</span>
            </div>
            <div className="item">
              <span className="key">Bechdel Score</span>
              <span className="value">{data.BechdelRating}</span>
            </div>
            <div className="item">
              <span className="key">IMDb Rating</span>
              <span className="value">{data.imDbRating}</span>
            </div>
            <div className="item">
              <span className="key">IMDb Votes</span>
              <span className="value">
                {Number(data.imDbRatingVotes).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
