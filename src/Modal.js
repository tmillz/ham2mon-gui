import React, { useCallback, useState, useMemo } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { ThemeProvider } from 'styled-components';
import { useDarkMode } from './useDarkMode';
import {download, getLocalStorage, sec2time, writeLocalStorage} from "./Utils";
import {FaTimes} from "react-icons/fa";
import { lightTheme, darkTheme } from './theme';
import { GlobalStyles } from './global';
import {useLocalStorage} from "./useLocalStorage";
import Select from 'react-select-v2';
import {Bar} from 'react-chartjs-2';
import {DataItem} from "./DataItem";
import Toggle from './Toggle'


export const ModalExample = ({
                                visible,
                                dirSize,
                                freeSpace,
                                handleClose,
                                freqStats,
                                showSince,
                                setShowSince,
                                setShowOnlyFreq,
                                handleDeleteBefore,
                                freqData
                            }) => {
    const [modal, setModal] = useState(false)

    const [theme, toggleTheme] = useDarkMode();
    //const [theme, setTheme] = useState('light');
    const themeMode = theme === 'light' ? lightTheme : darkTheme;

    //const toggleTheme = () => { theme === 'light' ? setTheme('dark') : setTheme('light')}

    const namedFreqStats = freqStats.map(freqStat => {
        const name = freqData.find(item => item.freq === freqStat.freq);
    
        return {
          ...freqStat,
          name: name ? name.name : ""
        }
    });

    const [serverIP, setServerIP] = useLocalStorage('setServerIP', '127.0.0.1');

    const timeSelect = useMemo(() => [
        {
          label: <div>10 min</div>,
          value: 60 * 10
        },
        {
          label: <div>30 min</div>,
          value: 60 * 30
        },
        {
          label: <div>1 hour</div>,
          value: 60 * 60
        },
        {
          label: <div>2 hours</div>,
          value: 60 * 60 * 2
        },
        {
          label: <div>1 day</div>,
          value: 60 * 60 * 24
        },
        {
          label: <div>2 days</div>,
          value: 60 * 60 * 24 * 2
        },
        {
          label: <div>3 days</div>,
          value: 60 * 60 * 24 * 3
        },
        {
          label: <div>1 week</div>,
          value: 60 * 60 * 24 * 7
        },
        {
          label: <div>Forever</div>,
          value: 60 * 60 * 24 * 10000
        }
      ], []);

    const [removeBefore, setRemoveBefore] = useState(60 * 60 * 24);

    const callsSinceSelectValue = timeSelect.find(time => time.value === showSince);
    const removeBeforeSelectValue = timeSelect.find(time => time.value === removeBefore);

    const getBarChart = useCallback(() => {
        return <Bar
          getElementAtEvent={(el) => {
            setShowOnlyFreq(el[0]._view.label.split(' ')[0]);
            handleClose();
          }}
          data={{
            labels: namedFreqStats.map(stat => stat.freq + " " + stat.name.substr(0, 8)),
            datasets: [
              {
                label: 'Call count',
                data: freqStats.map(stat => stat.count)
              }
            ]
    
          }}
          options={{
            scales: {
              yAxes: [{
                ticks: {
                  stepSize: 1,
                  min: 1
                }
              }]
            }
          }}
        />;
      }, [freqStats]);
    
      const selectStyles = {
        option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: isFocused
            ? '#9e9e9e'
            : null
        })
      };

    const handleModal = () => {
    setModal(!modal)
    }
    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <>
        <GlobalStyles/>
        <Button onClick={() => handleModal()}>Settings</Button>
            <Modal className="modal" show={modal} onHide={() => handleModal()} >
            <Modal.Header closeButton>Settings</Modal.Header>
            <Modal.Body> 
            <DataItem
                title="WAV directory size"
                type={"MB"}
                value={(dirSize / 1024 / 1024).toFixed(2)}
            />

            <DataItem
                title="Disk space available"
                type={"MB"}
                value={(freeSpace / 1024 / 1024).toFixed(2)}
            />

            <DataItem
                title="Total audio"
                type={"MB"}
                value={sec2time(dirSize / 16000, true)}
            />
            
                <div>Activity for last {callsSinceSelectValue.label.props.children}</div>
                {getBarChart()}

          <span>Server IP</span>
          <input
            type={'text'}
            value={serverIP}
            onChange={(event) => {
              setServerIP(event.target.value)
            }}
          />
          <Button
            type={"input"}
            onClick={() => window.location.reload()}
          >Set</Button>

          <span>Show calls since</span>
          <Select id="react-select-container" classNamePrefix="react-select"
            styles={selectStyles}
            theme={{theme}}
            value={callsSinceSelectValue}
            options={timeSelect}
            onChange={(res) => {
              setShowSince(res.value)
            }}
          />

          <span>Remove calls older than</span>
          <Select id="react-select-container" classNamePrefix="react-select"
            styles={selectStyles}
            //theme={theme => ({
            //  ...theme,
            //  colors: {
            //    ...theme.colors,
            //    text: 'hotpink'
            //  },
            //})}
            value={removeBeforeSelectValue}
            options={timeSelect}
            onChange={(res) => {
              setRemoveBefore(res.value)
            }}
          />
          <Button
            onClick={async () => {
              if (window.confirm(`Are you sure you want to delete calls older than ${removeBeforeSelectValue.label.props.children}?`)) {
                handleDeleteBefore(removeBefore);
              }
            }}
          >Remove</Button>

          <div>Restore backup by uploading it below</div>
          <input
            type={'file'}
            onChange={(event) => {
              const fileReader = new FileReader();

              fileReader.onloadend = () => {
                if (window.confirm('Are you sure you want to restore this data?')) {
                  const data = fileReader.result;
                  writeLocalStorage(data);

                  window.location.reload();
                }
              };

              fileReader.readAsText(event.target.files[0]);
            }}
          />

            <Button
                secondary={true}
                onClick={() => {
                const storage = getLocalStorage();

                download('Ham2Mon-Gui-Backup-' + new Date().toDateString() + ".bak", storage);
                }}
            >Backup Data</Button>
          <Toggle theme={theme} toggleTheme={toggleTheme} />
          </Modal.Body>
          </Modal>
        </>
        </ThemeProvider>
    )
}
export default ModalExample