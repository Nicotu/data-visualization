export const formatDate = (date) => {
  var parts = date.split("/");
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

export const sortCollection = (data, propertyName, format, direction) => {
  const currentDirection = direction || "desc";

  return new Promise((res) => {
    let sortedData;

    if (!format) {
      sortedData = [...data].sort((a, b) => {
        const valueA = `${a[propertyName]}`.replace("null", "").toUpperCase();
        const valueB = `${b[propertyName]}`.replace("null", "").toUpperCase();

        if (valueA < valueB) {
          return currentDirection === "desc" ? -1 : 1;
        }

        if (valueA > valueB) {
          return currentDirection === "desc" ? 1 : -1;
        }

        return 0;
      });
    }

    if (format === "number") {
      sortedData = [...data].sort((a, b) => {
        const valueA = `${a[propertyName]}`.replace("null", 0);
        const valueB = `${b[propertyName]}`.replace("null", 0);

        if (currentDirection === "desc") {
          return valueB - valueA;
        }

        return valueA - valueB;
      });
    }

    if (format === "date") {
      sortedData = [...data].sort((a, b) => {
        const valueA = formatDate(`${a.date_of_birth}`.replace("null", ""));
        const valueB = formatDate(`${b.date_of_birth}`.replace("null", ""));

        if (valueA < valueB) {
          return -1;
        }

        if (valueA > valueB) {
          return 1;
        }

        return 0;
      });
    }

    res(sortedData);
  });
};

export const filterCollection = (data, value) => {
  return new Promise((res) => {
    let filteredData;

    if (value.length === 0) {
      filteredData = data;
    }

    if (value)
      filteredData = [...data].filter((item) => {
        return (
          `${item.first_name}`
            .replace("null", "")
            .toLowerCase()
            .includes(value) ||
          `${item.last_name}`.replace("null", "").toLowerCase().includes(value)
        );
      });

    res(filteredData);
  });
};

function getItemRange(item, range) {
  return range.find((e) => {
    const rangeStart = e.split("-")[0];
    const rangeEnd = e.split("-")[1];

    return item >= rangeStart && item <= rangeEnd;
  });
}

function calculate_age(dob) {
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export const getDataRange = (data, rangeGroup, itemKey, format) => {
  return new Promise((res) => {
    sortCollection(data, itemKey, format)
      .then((response) => {
        return response.reduce((rangeList, item) => {
          const formats = {
            date: () =>
              calculate_age(formatDate(`${item[itemKey]}`.replace("null", ""))),
            number: () => Number(item[itemKey]),
            default: () => `${item[itemKey]}`.replace("null", ""),
          };

          const ItemValue = formats ? formats[format]() : formats["default"]();

          const itemRange = getItemRange(ItemValue, rangeGroup);

          if (rangeList.has(itemRange)) {
            rangeList.set(itemRange, rangeList.get(itemRange).concat(item));

            return rangeList;
          }

          rangeList.set(itemRange, [item]);

          return rangeList;
        }, new Map());
      })

      .then((response) => {
        res(response);
      });
  });
};
