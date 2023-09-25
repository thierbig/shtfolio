import React, { useEffect, useRef } from "react";
import { widget } from "../charting_library";
import Datafeed from "../chart/datafeed";
import { CryptoState } from "../CryptoContext";
import { useState } from "react";

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function TVChartContainer({ symbol }) {
  const interval = "15";
  const containerId = "tv_chart_container";
  const libraryPath = "../../charting_library/";
  const chartsStorageUrl = "https://saveload.tradingview.com";
  const chartsStorageApiVersion = "1.1";
  const clientId = "tradingview.com";
  const userId = "public_user_id";
  const fullscreen = false;
  const autosize = true;
  const studiesOverrides = "";

  const [historicData, setHistoricData] = useState();
  //const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const tvWidgetRef = useRef(null);
  const containerRef = useRef(null);

  const fetchHistoricData = async () => {
    //const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    let data = "";
    setHistoricData(data.prices);
  };

  useEffect(() => {
    fetchHistoricData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  useEffect(() => {
    fetchHistoricData();
    const widgetOptions = {
      symbol,
      datafeed: Datafeed,
      interval,
      container_id: containerId,
      library_path: libraryPath,
      theme: "Dark",
      locale: getLanguageFromURL() || "en",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: chartsStorageUrl,
      charts_storage_api_version: chartsStorageApiVersion,
      client_id: clientId,
      user_id: userId,
      fullscreen,
      autosize,
      studies_overrides: studiesOverrides,
    };

    const tvWidget = new widget(widgetOptions);
    tvWidgetRef.current = tvWidget;

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton();
        button.setAttribute("title", "Click to show a notification popup");
        button.classList.add("apply-common-tooltip");
        button.addEventListener("click", () =>
          tvWidget.showNoticeDialog({
            title: "Notification",
            body: "TradingView Charting Library API works correctly",
            callback: () => {
              console.log("Noticed!");
            },
          })
        );

        button.innerHTML = "Check API";
      });
    });

    // New code to set the height dynamically
    if (containerRef.current) {
      const parentHeight = containerRef.current.offsetHeight;
	containerRef.current.style.height = `${parentHeight*2.5}px`;
	containerRef.current.style.width = `${parentHeight*2.5}px`;
    }

    return () => {
      if (tvWidgetRef.current !== null) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
      }
    };
  }, [
    symbol,
    interval,
    containerId,
    libraryPath,
    chartsStorageUrl,
    chartsStorageApiVersion,
    clientId,
    userId,
    fullscreen,
    autosize,
    studiesOverrides,
  ]);

  return (
    <div className="TVChartContainer" id={containerId} ref={containerRef} />
  );
}

export default TVChartContainer;
