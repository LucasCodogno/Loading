import React from 'react';
import ArrowDropUpIcon from "@mui/icons-material/ArrowUpward";

const HeaderInfo = ({ Min, Max, MaxBackgroundColor, isMobile }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", height: "28px" }}>
      <h1 style={{ marginRight: isMobile ? 20 : "40px", fontSize: "15px" }}>Servidor</h1>
      <h1 style={{ marginRight: "40px", fontSize: "15px" }}>{Min}</h1>
      <ArrowDropUpIcon
        style={{
          marginLeft: "30px",
          color: MaxBackgroundColor,
          marginTop: "2px",
        }}
      />
      <span className={`blinking`} style={{ color: MaxBackgroundColor, fontSize: "15px"}}>
        {Max}
      </span>
    </div>
  );
};

export default HeaderInfo;
