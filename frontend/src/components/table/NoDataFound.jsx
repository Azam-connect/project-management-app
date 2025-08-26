// components/NoDataFound.js
import React from "react";

const NoDataFound = ({ colSpan = 1, message = "No records found" }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-8 text-gray-500">
        {message}
      </td>
    </tr>
  );
};

export default NoDataFound;
