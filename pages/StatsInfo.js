import React from 'react';

const StatsInfo = ({ usuarios, sessoes, Discador, qtde, isMobile, isPortrait }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "30px",
        marginTop: "10px",
        marginBottom: "0px",
        fontSize: "6px",
      }}
    >
      {isMobile && isPortrait ? (
        <>
          <h1>Usuários:{usuarios}</h1>
          <h1>Sessões:{sessoes}</h1>
          <h1>Discador:{Discador}</h1>
          <h1>Espera:{qtde}</h1>
        </>
      ) : (
        <>
          <h1>Usuários: {usuarios}</h1>
          <h1>Sessões: {sessoes}</h1>
          <h1>Discador: {Discador}</h1>
          <h1>Espera: {qtde}</h1>
        </>
      )}
    </div>
  );
};

export default StatsInfo;
