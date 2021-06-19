import { GlobalStyles } from './global';
import React, {useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Call from "./Call";
import {useLocalStorage} from "./useLocalStorage";
import './App.css';
import produce from "immer";
import {NowPlaying} from "./NowPlaying";
import {getFreqStats} from "./Utils";
import {useHotkeys} from 'react-hotkeys-hook';
import ReactList from 'react-list';
import {useWindowSize} from "./hooks/useWindowSize";
import { ThemeProvider } from 'styled-components';
import { useDarkMode } from './useDarkMode';
import useDimensions from 'react-use-dimensions';
import { lightTheme, darkTheme } from './theme';
import { Button, ButtonGroup, ToggleButton, Container, Row, Col } from 'react-bootstrap';
import ModalExample from './Modal';
import Select from 'react-select-v2'

function App() {
  const windowSize = useWindowSize();
  const [optionsBlockRef, optionsBlockDimensions] = useDimensions();

  const styles = {
    optionsBlock: {
      position: 'fixed',
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      top: 0,
      padding: 6,
      width: "100%",
      zIndex: 1000,
      boxSizing: 'border-box'
    },
    leftOptionsBlock: {
      marginRight: windowSize.width >= 600 ? 8 : 0,
      width: windowSize.width >= 600 ? "40%" : '100%',
    },
    rightOptionsBlock: {
      boxSizing: "border-box",
      flexGrow: 1,
      padding: 10,
      borderRadius: 4,
    },
    buttons: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap"
    },
    audio: {
      width: "100%",
      userSelect: "none",
      outline: 0,
      borderRadius: 30
    },
    loadError: {
      padding: 10,
      margin: 10,
      borderRadius: 4
    },
    loading: {
      padding: 10,
      margin: 10,
      textAlign: 'center',
      fontWeight: 400
    }
  };

  const [calls, setCalls] = useState([]);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dirSize, setDirSize] = useState(null);
  const [freeSpace, setFreeSpace] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [freqStats, setFreqStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mobileSettingsOpen, setMobileSettingsOpen] = useLocalStorage('mobileSettingsOpen', false);
  const [listenedArr, setListenedArr] = useLocalStorage('listenedArr', []);
  const [likedArr, setLikedArr] = useLocalStorage('likedArr', []);
  const [hiddenArr, setHiddenArr] = useLocalStorage('hiddenArr', []);
  const [autoplay, setAutoplay] = useLocalStorage('autoplay', true);
  const [freqData, setFreqData] = useLocalStorage('freqData', []);
  const [showRead, setShowRead] = useLocalStorage('showRead', true);
  const [showOnlyFreq, setShowOnlyFreq] = useLocalStorage('showOnlyFreq', '');
  const [serverIP] = useLocalStorage('setServerIP', window.location.hostname);
  const [showSince, setShowSince] = useLocalStorage('setShowSince', 60 * 60 * 24);

  const audioRef = useRef(null);
  const filteredCallRefs = useRef([]);

  const serverUrl = `http://${serverIP}:8081/`;

  const selectedCall = calls.find(call => call.file === selected);
  const allFreqs = calls.map(call => call.freq);

  const uniqueFreqs = [...new Set(allFreqs)];

  const unlistenedCalls = calls.filter(call => !listenedArr.includes(call.file));

  let filteredFreqs = uniqueFreqs.filter(freq => !hiddenArr.includes(freq));

  const [theme, toggleTheme, componentMounted] = useDarkMode();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;

  if (showHidden) {
    filteredFreqs = uniqueFreqs.filter(freq => hiddenArr.includes(freq));
  }

  useEffect(() => {
    setCalls([]);
    getData();
  }, [showSince]);

  const getData = async () => {
    setLoading(true);

    try {
      const result = await axios.post(serverUrl + 'data', {
        fromTime: Math.floor(Date.now() / 1000) - showSince
      });

      const {files, dirSize, freeSpace} = result.data;

      setDirSize(dirSize);
      setFreeSpace(freeSpace);
      setCalls(files);
    } catch (e) {
      setLoadError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    const orderedStats = getFreqStats(calls);

    setFreqStats(orderedStats);
  }, [calls, showSince]);

  const frequencyListItems = filteredFreqs.map(freq => {
    const freqItem = freqData.find(freqItem => freqItem.freq === freq);
    const unlistenedCount = unlistenedCalls.filter(call => call.freq === freq).length;

    return {
      freq,
      name: freqItem ? freqItem.name : '',
      unlistenedCount
    };
  });

  useEffect(() => {
    if (!showOnlyFreq && frequencyListItems.length) {
      setShowOnlyFreq(frequencyListItems[0].freq);
    }
  }, [frequencyListItems, showOnlyFreq]);

  let filteredCalls = calls.filter(call => !hiddenArr.includes(call.freq));

  if (showHidden) {
    filteredCalls = calls.filter(call => hiddenArr.includes(call.freq));
  }

  if (showOnlyFreq) {
    filteredCalls = filteredCalls.filter(call => call.freq === showOnlyFreq);
  }

  if (!showRead) {
    filteredCalls = filteredCalls.filter(call => !listenedArr.includes(call.file));
  }

  useEffect(() => {
    filteredCallRefs.current = new Array(filteredCalls.length);
  }, [filteredCalls]);

  const playNext = (skipAmount = 1) => {
    const selectedCallIndex = filteredCalls.findIndex(call => call.file === selected);

    const nextCall = filteredCalls[selectedCallIndex + skipAmount];

    // Doesn't scroll now because of new scoll component
    // try {
    //   filteredCallRefs.current[selectedCallIndex + skipAmount].scrollIntoView({block: 'center'});
    // } catch (e) {
    //
    // }

    if (nextCall) {
      setSelected(nextCall.file);
      setListenedArr([
        ...listenedArr,
        nextCall.file
      ]);
    }
  };

  function pause(event) {
    event.preventDefault();

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }

  useHotkeys('k,down', () => playNext(), {}, [selected, listenedArr, filteredCalls, filteredCallRefs]);
  useHotkeys('j,up', () => playNext(-1), {}, [selected, listenedArr, filteredCalls]);
  useHotkeys('space', (event) => pause(event), {}, [audioRef, playing]);
  useHotkeys('shift+k,shift+down', () => window.scrollTo(0, document.body.scrollHeight));

  useHotkeys('shift+j,shift+up', () => window.scrollTo(0, 0));
  useHotkeys('s', () => audioRef.current.currentTime += 5);
  useHotkeys('a', () => audioRef.current.currentTime -= 5);

  const selectOptions = frequencyListItems.map(freqItem => ({
    value: freqItem.freq,
    label: <div style={{
      fontWeight: freqItem.unlistenedCount ? "500" : "auto"
    }}
    >
      {`${freqItem.freq} ${freqItem.name ? freqItem.name : ''} (${freqItem.unlistenedCount})`}
    </div>
  }));

  const handleDeleteBefore = async (beforeTime) => {
    await axios.post(`${serverUrl}deleteBefore`, {
      deleteBeforeTime: Math.floor(Date.now() / 1000) - beforeTime
    });

    window.location.reload();
  };

  if (!componentMounted) {
    return <div />
  };

  return (
    <ThemeProvider theme={themeMode}>
    <GlobalStyles/>
    <div>
      <div ref={optionsBlockRef} style={styles.optionsBlock}>
        {windowSize.width >= 600 || mobileSettingsOpen ? <div style={styles.leftOptionsBlock}>
          <div>
            <Container>
              <Row>
                <Col>
                  <ButtonGroup toggle>
                    <ToggleButton type="checkbox" onClick={() => { setAutoplay(!autoplay) }} value={autoplay} 
                      className={(autoplay) ? 'selected' : 'notselected' }
                      className="Btn-Blue-BG"
                      checked={checked}  onChange={(e) => setChecked(e.currentTarget.checked)}>
                      Autoplay
                    </ToggleButton>
                  </ButtonGroup>
                  
                </Col>
                <Col>
                  <Button block onClick={() => { setShowRead(!showRead) }} value={!showRead}>
                    Hide Listened
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button block value={showHidden} onClick={() => { setShowHidden(!showHidden) }}>
                    Show Hidden
                  </Button>
                </Col>
                <Col>
                  <Button block onClick={() => { window.scrollTo(0, 0) }}>
                    Scroll to Top
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button block onClick={() => { window.scrollTo(0, document.body.scrollHeight) }}>
                    Scroll to Bottom
                  </Button>
                </Col>
                <Col>
                  <Button block onClick={async () => {
                    if (!window.confirm(`Are you sure you want to delete all listened audio${showOnlyFreq ? ' on this freq?' : "?"}`)) {
                      return false;
                    }
                    let filesToDelete;
                    if (showOnlyFreq) {
                      filesToDelete = calls.filter(call =>
                        call.freq === showOnlyFreq &&
                        listenedArr.includes(call.file)
                      ).map(call => call.file);
                    } else {
                      filesToDelete = calls.filter(call =>
                        listenedArr.includes(call.file)
                      ).map(call => call.file);
                    }
                    await axios.post(`${serverUrl}delete`, {
                      files: filesToDelete
                    });
                    setShowOnlyFreq('');
                    getData();
                    }}>
                      Delete Listened
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button block type="button"
                    onClick={async () => {
                      if (!window.confirm(`Are you sure you want to mark ${showOnlyFreq ? "this frequency" : "all calls"} as read?`)) {
                        return false;
                      }

                      let itemsToMark;

                      if (showOnlyFreq) {
                        itemsToMark = unlistenedCalls.filter(call => call.freq === showOnlyFreq);
                      } else {
                        itemsToMark = calls;
                      }
                      const tmpListenedArr = await produce(listenedArr, async (draft) => {
                        itemsToMark.forEach((call) => {
                          draft.push(call.file);
                        })
                      });

                      setListenedArr(tmpListenedArr);
                    }}>
                    Mark Listened
                  </Button>
                </Col>
                <Col>
                  <ModalExample
                  theme={theme}
                  toggleTheme={toggleTheme}
                  visible={showSettings}
                  dirSize={dirSize}
                  freeSpace={freeSpace}
                  handleClose={() => setShowSettings(false)}
                  freqStats={freqStats}
                  showSince={showSince}
                  setShowSince={setShowSince}
                  setShowOnlyFreq={setShowOnlyFreq}
                  handleDeleteBefore={handleDeleteBefore}
                  freqData={freqData}/>
                </Col>
              </Row>
            </Container>
          </div>
          <Select id="react-select-container" classNamePrefix="react-select"
            isSearchable={ false }
            value={selectOptions.find(option => option.value === showOnlyFreq)}
            placeholder={"Select a frequency"}
            options={selectOptions}
            onChange={(res) => {
              setShowOnlyFreq(res.label === 'No filter' ? '' : res.value);

              setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
              }, 200)
            }}
          />
        </div> : null}
        {windowSize.width < 600 ? <div style={{width: '100%'}}>
          <Button block onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}>
            {!mobileSettingsOpen ? 'Open Panel' : 'Close Panel'}
          </Button>
        </div> : null}
        <div style={styles.rightOptionsBlock}>
          <NowPlaying call={selectedCall} freqData={freqData}/>
          <audio
            ref={audioRef}
            style={styles.audio}
            onPlay={() => {
              setPlaying(true);
            }}
            onPause={() => {
              setPlaying(false);
            }}
            onEnded={() => {
              setPlaying(false);

              if (!autoplay) return;

              playNext();
            }}
            autoPlay={autoplay}
            preload={'none'}
            src={selected ? `${serverUrl}static/${selected}` : null}
            controls
          />
        </div>
      </div>
      <div id="content">
        {loadError ? <div style={styles.loadError}>
          There was an issue connecting to the server. Please ensure the settings are correct.
        </div> : null}

        {!loading && !filteredCalls.length && !loadError ? <div style={styles.loadError}>
          No calls to display. Try changing frequency.
        </div> : null}
        {loading ? <div style={styles.loading}>Loading calls...</div> :
          <ReactList
            itemRenderer={(index, key) => {
              const call = filteredCalls[index];

              return (

                <div
                  key={index}
                  ref={el => filteredCallRefs.current[index] = el}
                >
                  <Call
                    data={call}
                    autoplay={autoplay}
                    selected={selected === call.file}
                    listened={listenedArr.includes(call.file)}
                    hidden={hiddenArr.includes(call.freq)}
                    liked={likedArr.includes(call.freq)}
                    freqData={freqData}
                    setFreqData={setFreqData}
                    onClick={() => {
                      setSelected(call.file);

                      setListenedArr([
                        ...listenedArr,
                        call.file
                      ]);
                    }}
                    onLike={() => {
                      setLikedArr([
                        ...likedArr,
                        call.freq
                      ]);
                    }}
                    onHide={() => {
                      setHiddenArr([
                        ...hiddenArr,
                        call.freq
                      ]);
                    }}
                    onUnhide={() => {
                      setHiddenArr(hiddenArr.filter(freq => freq !== call.freq));
                    }}
                    onUnlike={() => {
                      setLikedArr(likedArr.filter(freq => freq !== call.freq));
                    }}
                    handleMarkRead={async (freq) => {
                      if (!window.confirm("Are you sure you want to mark all as read?")) {
                        return false;
                      }

                      const itemsToMark = unlistenedCalls.filter(call => call.freq === freq);
                      const tmpListenedArr = await produce(listenedArr, async (draft) => {
                        itemsToMark.forEach((call) => {
                          draft.push(call.file);
                        })
                      });

                      setListenedArr(tmpListenedArr);
                    }}
                  />
                </div>
              );
            }}
            minSize={50}
            length={filteredCalls.length}
            type='uniform'
          />}
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
