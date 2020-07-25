import React from "react";

export function SmallDataBlock({Icon, data}) {
  const styles = {
    container: {
      display: "inline-block",
      marginRight: 10
    },
    icon: {
      marginRight: 2,
      width: 14,
      height: 14,
      position:'relative',
      top: 2
    },
    data: {
      marginLeft: 2
    }
  };

  return <div style={styles.container}>
    <Icon
      style={styles.icon}
    />
    <span
      style={styles.data}
    >
      {data}
    </span>
  </div>;
}
