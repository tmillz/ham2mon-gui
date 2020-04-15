import React, {useState} from 'react';
import dayjs from "dayjs";

import {FaRegClock, FaRegHdd} from 'react-icons/fa';
import produce from "immer"
import {sec2time} from "./Utils";
import {BooleanOption} from "./BooleanOption";
import {primary, primary2, primary4, secondary, secondary25} from "./color";

function Call({
                data,
                selected,
                listened,
                onClick,
                onLike,
                liked,
                onUnlike,
                hidden,
                onHide,
                onUnhide,
                freqData,
                setFreqData,
              }) {

  const styles = {
    item: {
      border: "1px solid #eee",
      padding: "4px 6px",
      margin: "4px 4px",
      display: 'flex',
      borderRadius: 4,
      cursor: 'pointer',
    },
    audioBlock: {marginTop: 10},
    audio: {
      width: 400,
      marginLeft: 80
    },
    date: {
      fontFamily: "Segment7",
      fontWeight: 'normal',
      fontStyle: 'italic',
      fontSize: 15,
      marginBottom: 10,
      marginTop: 9,
      textAlign: 'right'
    },
    freq: {
      fontFamily: "Segment7",
      fontWeight: 'normal',
      fontStyle: 'italic',
      fontSize: 30,
      cursor: 'pointer',
      display: 'inline-block',
      textAlign: "right",
      width: 106
    },
    rightBlock: {
      paddingLeft: 30,
      fontSize: 12
    },
    controls: {
      marginTop: 4
    },
    control: {
      cursor: "pointer",
      display: 'inline-block',
      marginRight: 8,
    },
    name: {
      fontWeight: '500',
      fontSize: 16,
      marginTop: 4
    },
    infoBlock: {
      fontSize: 13,
      marginTop: 4,
      marginBottom: 5
    }
  };
  const {time, freq, file, size} = data;

  let color = primary4;
  let bg = "#FFF";
  let border = '1px solid #EEE';

  if (listened) {
    // bg = "#ffdfc1";
    bg = primary2;
  }
  if (selected) {
    border = "2px solid #f79c51";
  }

  const freqItem = freqData.find(freqItem => freqItem.freq === freq);
  const freqItemIndex = freqData.findIndex(freqItem => freqItem.freq === freq);

  return (
    <div
      style={{
        ...styles.item,
        color: color,
        backgroundColor: bg,
        border: border
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <div style={styles.leftBlock}>
        <div style={styles.date}>
          <div>
            {dayjs(time * 1000).format('M-D-YYYY')}
          </div>
          <div>
            {dayjs(time * 1000).format('HH:mm:ss')}
          </div>
        </div>

        <div
          style={{...styles.freq, color: liked ? primary4 : '#ccc',}}
          onClick={(event) => {
            if (!liked) {
              onLike();
            } else {
              onUnlike();
            }

            event.stopPropagation();
          }}
        >
          {freq}
        </div>
      </div>
      <div style={styles.rightBlock}>
        <div style={styles.name}>
          {freqItem ? freqItem.name : ''}
        </div>
        <div style={styles.infoBlock}>
          <FaRegClock
            style={{
              marginRight: 2,
              width: 12,
              height: 12,
              marginTop: 2
            }}
          />
          {sec2time(size / 16000)}

          <FaRegHdd
            style={{
              marginLeft: 6,
              width: 12,
              height: 12,
              marginTop: 2
            }}
          />
          <span
            style={{
              marginLeft: 2
            }}
          >
            {size / 1000}kb
          </span>
        </div>
        <div style={styles.controls}>
          <BooleanOption
            title={hidden ? 'Unhide' : 'Hide'}
            type={'small'}
            warning={true}
            onClick={(event) => {
              event.stopPropagation();
              if (hidden) {
                onUnhide();
              } else {
                if (!window.confirm(`Are you sure you want to hide this freq? [${freq}]`)) {
                  return false;
                }
                onHide();
              }
            }}
          />

          <BooleanOption
            title={'Rename'}
            type={'small'}
            warning={true}
            onClick={async (event) => {
              event.stopPropagation();

              const name = prompt('Enter a name', freqItem ? freqItem.name : '');
              if (name === null) {
                return;
              }
              if (!freqItem) {
                setFreqData([
                  ...freqData,
                  {
                    name,
                    freq
                  }
                ])
              } else {
                const tmpFreqData = await produce(freqData, async (draft) => {
                  draft[freqItemIndex].name = name;
                });
                setFreqData(tmpFreqData);
              }
            }}
          />

          {/*<BooleanOption*/}
          {/*  title={'Mark Read'}*/}
          {/*  type={'small'}*/}
          {/*  onClick={async (event) => {*/}
          {/*    event.stopPropagation();*/}

          {/*    handleMarkRead(freq);*/}
          {/*  }}*/}
          {/*/>*/}
        </div>
      </div>
      <div>
        {/*audio used to be here*/}
      </div>
    </div>
  );
}

export default Call; 
