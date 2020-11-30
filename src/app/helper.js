export const formatDate = (date) => {
  var parts = date.split("/");
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

export const sortCollection = (data, propertyName, format, direction) => {
  return new Promise((res) => {
    let sortedData;

    if (!format) {
      sortedData = [...data].sort((a, b) => {
        const valueA = `${a[propertyName]}`.replace("null", "").toUpperCase();
        const valueB = `${b[propertyName]}`.replace("null", "").toUpperCase();

        if (valueA < valueB) {
          return -1;
        }

        if (valueA > valueB) {
          return 1;
        }

        return 0;
      });
    }

    if (format === "date") {
      sortedData = [...data].sort((a, b) => {
        const valueA = formatDate(`${a.date_of_birth}`.replace("null", ""));
        const valueB = formatDate(`${b.date_of_birth}`.replace("null", ""));

        console.log(valueB, valueA);

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