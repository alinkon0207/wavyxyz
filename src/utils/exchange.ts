import _get from "lodash/get";
import _forEach from "lodash/forEach";

export const fetchRates = async () => {
    const response = await fetch(
      "https://lobster-app-whutt.ondigitalocean.app/wavy"
    );

  const data = await response.json();

  const finalData = {};

  const staticDataObj = _get(data, "0", {});

  _forEach(staticDataObj, function (row, coin) {
    finalData[coin] = _get(row, "0", {});
  });

  return finalData;
};
