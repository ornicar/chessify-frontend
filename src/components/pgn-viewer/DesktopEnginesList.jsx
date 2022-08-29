import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CustomDropDown from '../common/CustomDropDown';
import SavedAnalysisArea from './SavedAnalysisArea';
import { setOrderedCores, setSavedAnalyzeInfo } from '../../actions/cloud';
import {
  getEnginesListFromAvailableServers,
  showAnalizeButton,
  ENGINES_NAMES,
} from '../../utils/engine-list-utils';
import {
  getAvailableServers,
  getEnginesOptions,
  orderServer,
  pingAlive,
} from '../../utils/api';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Accordion from 'react-bootstrap/Accordion';
import $ from 'jquery';

const mapStateToProps = (state) => {
  return {
    freeAnalyzer: state.cloud.freeAnalyzer,
    proAnalyzers: state.cloud.proAnalyzers,
    userFullInfo: state.cloud.userFullInfo,
    orderedCores: state.cloud.orderedCores,
    savedAnalyzeInfo: state.cloud.savedAnalyzeInfo,
  };
};

const loadingOrderedServer = () => {
  return (
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

const DisplayEngineOption = ({
  engineName,
  enginesOptionsList,
  handleOptionChange,
  engineNameStyleClassName,
}) => {
  const [cpuctVlue, setCpuctValue] = useState();
  const engineOptions = enginesOptionsList[engineName];
  const optionLabels = engineOptions ? Object.keys(engineOptions) : [];

  const hnadleCpuctChnage = (e, option, engineName, type) => {
    if (e.target.value < 0 || e.target.value > 100) {
      return;
    }
    handleEngineOptionChnage(e.target, option, engineName, type);
    setCpuctValue(e.target.value);
  };

  const decrementCpuctValue = (option, engineName, type) => {
    const inputNumber = document.getElementById('cpuct');
    inputNumber.stepDown(1);
    const val = document.getElementById('cpuct').value;
    setCpuctValue(val);
    handleEngineOptionChnage({ value: val }, option, engineName, type);
  };

  const incrementCpuctValue = (option, engineName, type) => {
    const inputNumber = document.getElementById('cpuct');
    inputNumber.stepUp(1);
    const val = document.getElementById('cpuct').value;
    setCpuctValue(val);
    handleEngineOptionChnage({ value: val }, option, engineName, type);
  };

  const handleEngineOptionChnage = (event, option, engine, type) => {
    const { value, checked } = event;
    if (type === 'option') {
      enginesOptionsList[engine][option].options.sort(function (x, y) {
        return x === value ? -1 : y === value ? 1 : 0;
      });
    } else if (type === 'number') {
      const num = typeof value === 'number' ? parseFloat(value) : value;
      const { valid_range } = enginesOptionsList[engine][option];
      if (!num || (valid_range[0] <= num && num <= valid_range[1])) {
        enginesOptionsList[engine][option].options[0] = num;
      }
    } else if (type === 'boolean') {
      enginesOptionsList[engine][option].options[0] = checked;
    }
    handleOptionChange(enginesOptionsList);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row-reverse',
        width: 'max-content',
      }}
    >
      {optionLabels.map((option, index) => {
        return (
          <>
            {engineOptions[option].type === 'option' && (
              <>
                <CustomDropDown
                  key={index}
                  option={option}
                  engineName={engineName}
                  type={engineOptions[option].type}
                  items={engineOptions[option].options}
                  handleEngineOptionChnage={handleEngineOptionChnage}
                  engineNameStyleClassName={engineNameStyleClassName}
                />
              </>
            )}
            {engineOptions[option].type === 'number' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <label style={{ margin: 0, verticalAlign:'unset' }} for="cpuct">
                  {option}:{' '}
                </label>
                <input
                  id="cpuct"
                  min={engineOptions[option].valid_range[0]}
                  max={engineOptions[option].valid_range[1]}
                  step="0.1"
                  type="number"
                  value={cpuctVlue || engineOptions[option].options[0]}
                  onChange={(e) => {
                    hnadleCpuctChnage(
                      e,
                      option,
                      engineName,
                      engineOptions[option].type
                    );
                  }}
                  className="option-number-input"
                />
                <button
                  className="number-option-button"
                  onClick={() => {
                    decrementCpuctValue(
                      option,
                      engineName,
                      engineOptions[option].type
                    );
                  }}
                >
                  <IoIosArrowBack />
                </button>
                <button
                  className="number-option-button"
                  onClick={() => {
                    incrementCpuctValue(
                      option,
                      engineName,
                      engineOptions[option].type
                    );
                  }}
                >
                  <IoIosArrowForward />
                </button>
              </form>
            )}
          </>
        );
      })}
    </div>
  );
};

const DesktopEnginesList = (props) => {
  const {
    userFullInfo,
    orderedCores,
    setOrderedCores,
    savedAnalyzeInfo,
    setSavedAnalyzeInfo,
  } = props;
  const [pingAliveIntervalId, setPingAliveIntervalId] = useState(null);
  const [availableServersIntervalId, setAvailableServersIntervalId] = useState(
    null
  );
  const [enginesOptionsList, setEnginesOptionsList] = useState({});
  const [availableServers, setAvailableServers] = useState([]);
  const [isServerOrdering, setIsServerOrdering] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [coreIndex, setCoreIndex] = useState({
    asmfish: 0,
    stockfish10: 0,
    sugar: 0,
    lc0: 0,
    berserk: 0,
    koivisto: 0,
  });

  useEffect(() => {
    _getEnginesOptions();
  }, []);

  useEffect(() => {
    const savedAnalyzeInfoFromSessionStorage = JSON.parse(
      sessionStorage.getItem('latest_analyze_info')
    );
    _getAvailableServers();
    _pingAliveServers();

    if (servers && Object.keys(servers).length > 0) {
      if (sessionStorage.getItem('ordered_cores')) {
        setOrderedCores(JSON.parse(sessionStorage.getItem('ordered_cores')));
      }
    } else {
      sessionStorage.removeItem('ordered_cores');
    }

    if (savedAnalyzeInfoFromSessionStorage) {
      setSavedAnalyzeInfo(savedAnalyzeInfoFromSessionStorage);
    }

    return () => {
      clearInterval(availableServersIntervalId);
      clearInterval(pingAliveIntervalId);
      setAvailableServersIntervalId(null);
      setPingAliveIntervalId(null);
    };
  }, [userFullInfo]);

  const { servers } = userFullInfo;

  const enginesStockfishLc0 = Object.keys(
    getEnginesListFromAvailableServers(availableServers, userFullInfo)
  ).filter(
    (serverName) => serverName === 'lc0' || serverName === 'stockfish10'
  );

  const restEngineList = Object.keys(
    getEnginesListFromAvailableServers(availableServers, userFullInfo)
  ).filter(
    (serverName) => serverName !== 'lc0' && serverName !== 'stockfish10'
  );
  const engineList = [
    getEnginesListFromAvailableServers(availableServers, userFullInfo),
  ];
  const updateEnginesList = (availableServersList) => {
    setAvailableServers(availableServersList);
  };

  const _getAvailableServers = () => {
    const interval = setInterval(() => {
      getAvailableServers()
        .then((serversList) => {
          updateEnginesList(serversList);
        })
        .catch((e) => {
          console.error(e);
        });
    }, 3000);

    setAvailableServersIntervalId(interval);
  };

  const _getEnginesOptions = () => {
    getEnginesOptions()
      .then((enginesOptionsList) => {
        setEnginesOptionsList(enginesOptionsList);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handelCoreChange = (indexValue, name) => {
    const newObj = { ...coreIndex };
    newObj[name] = indexValue;
    setCoreIndex(newObj);
  };

  const handleOrderServer = (core, serverName) => {
    const options = enginesOptionsList[serverName];
    const coreIndexObj = { ...coreIndex };
    coreIndexObj[serverName] = 0;
    setCoreIndex(coreIndexObj);
    isServerOrdering[serverName] = true;
    setIsServerOrdering(isServerOrdering);

    orderServer(core, serverName, options)
      .then((response) => {
        if (response.error) {
          delete isServerOrdering[serverName];
          setIsServerOrdering(isServerOrdering);
          console.log('ERROR ORDERING');
          return;
        }
        delete isServerOrdering[serverName];
        orderedCores[serverName] = core;
        setIsServerOrdering(isServerOrdering);
        setOrderedCores(orderedCores);
        sessionStorage.setItem('ordered_cores', JSON.stringify(orderedCores));
      })
      .catch((e) => {
        delete isServerOrdering[serverName];
        setIsServerOrdering(isServerOrdering);
        console.log('IN CATCH', e);
      });
  };

  function _pingAliveServers (){
    const interval = setInterval(() => {
      // pingAlive(userFullInfo)
      //   .then((response) => {
      //     if (response.error) {
      //       console.log('ERROR STOPPING');
      //       return;
      //     } else {
      //       console.log('Pinged');
      //     }
      //   })
      //   .catch((e) => {
      //     console.error('IN CATCH', e);
      //   });
      if (servers && Object.keys(servers).length > 0) {
        const engines = Object.keys(servers);

        for (let i = 0; i < engines.length; i++) {
          $.ajax({
            url: `/api/ping_alive?engine=${engines[i]}`,
            method: 'GET',
            success() {
              console.log('Pinged');
            },
          });
        }
      }
    }, 5000);

    setPingAliveIntervalId(interval);
  };

  const handleOptionChange = (optionsList) => {
    setEnginesOptionsList(optionsList);
  };

  return (
    <>
      {enginesStockfishLc0.map((name, index) => {
        return (
          <div
            className="main-container-wrapper"
            key={index}
            style={{ display: servers[name] ? 'none' : '' }}
          >
            {engineList.map((engine, index) => {
              return (
                <div className="analize-info" key={index}>
                  <div className="analize-info-item">
                    {name === 'stockfish10' ? (
                      <DisplayEngineOption
                        engineName={name}
                        engineNameStyleClassName={'engine-name-wrapper'}
                        enginesOptionsList={enginesOptionsList}
                        handleOptionChange={handleOptionChange}
                      />
                    ) : (
                      <h6 className="engine-name-wrapper">
                        {ENGINES_NAMES[name]}
                      </h6>
                    )}
                  </div>
                  {name !== 'stockfish10' && (
                    <div className="analize-info-item-wrapper">
                      <DisplayEngineOption
                        engineName={name}
                        enginesOptionsList={enginesOptionsList}
                        handleOptionChange={handleOptionChange}
                      />
                    </div>
                  )}
                  {name !== 'lc0' && (
                    <div className="analize-info-core-item-wraper">
                      <span style={{ margin: 'auto 0px' }}>Server:&nbsp;</span>
                      <CustomDropDown
                        coreIndex={coreIndex}
                        type={'cores'}
                        items={engine[name]}
                        engineName={name}
                        userFullInfo={userFullInfo}
                        handelCoreChange={handelCoreChange}
                      />
                    </div>
                  )}
                  <div className="analize-info-item-wrapper">
                    {
                      (
                        engineList[0][name][coreIndex[name]] ||
                        engineList[0][name][0]
                      ).price_per_minute
                    }
                    <span>&nbsp;coins/min</span>
                  </div>
                  <div className="analize-button-wrapper">
                    {isServerOrdering[name] && loadingOrderedServer()}
                    {servers &&
                      !servers[name] &&
                      !isServerOrdering[name] &&
                      showAnalizeButton(
                        userFullInfo,
                        engineList[0][name][coreIndex[name]].cores,
                        (
                          engineList[0][name][coreIndex[name]] ||
                          engineList[0][name][0]
                        ).price_per_minute
                      ) && (
                        <button
                          className="analize-button"
                          onClick={() => {
                            handleOrderServer(
                              engineList[0][name][coreIndex[name]].cores,
                              name
                            );
                          }}
                        >
                          Analyze
                        </button>
                      )}
                    {servers &&
                      !servers[name] &&
                      !isServerOrdering[name] &&
                      !showAnalizeButton(
                        userFullInfo,
                        engineList[0][name][coreIndex[name]].cores,
                        (
                          engineList[0][name][coreIndex[name]] ||
                          engineList[0][name][0]
                        ).price_per_minute
                      ) && (
                        <button className="analize-button-disabled ">
                          Analyze
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
            {savedAnalyzeInfo &&
              savedAnalyzeInfo.map((info, index) => {
                if (info.name === name && info.analysis ) {
                  return (
                    <SavedAnalysisArea
                      key={index}
                      serverName={name}
                      handleAnalyze={props.handleAnalyze}
                      fenToAnalyze={props.fenToAnalyze}
                      setFenToAnalyze={props.BodysetFenToAnalyze}
                    />
                  );
                }
                return null;
              })}
          </div>
        );
      })}
      <Accordion>
        <Accordion.Item eventKey="0" className="accordion-item">
          <Accordion.Button
            className="accordion-button"
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            <b> Show more Engines:&nbsp;&nbsp;</b>
            {!isExpanded &&
              restEngineList.map((serverName, index) => (
                <span key={index}>
                  &nbsp;&nbsp;{ENGINES_NAMES[serverName]}&nbsp;&nbsp;
                </span>
              ))}
          </Accordion.Button>
          {restEngineList.map((name, index) => (
            <Accordion.Body
              className="accordion-body"
              key={index}
              style={{ display: servers[name] ? 'none' : '' }}
            >
              <div className="main-container-wrapper">
                <div>
                  {engineList.map((engine, index) => {
                    return (
                      <div className="analize-info" key={index}>
                        {enginesOptionsList[name] ? (
                          <DisplayEngineOption
                            engineName={name}
                            engineNameStyleClassName={'engine-name-wrapper'}
                            enginesOptionsList={enginesOptionsList}
                            handleOptionChange={handleOptionChange}
                          />
                        ) : (
                          <div className="analize-info-item">
                            <h6 className="engine-name-wrapper">{name}</h6>
                          </div>
                        )}
                        <div className="analize-info-core-item-wraper">
                          <span style={{ margin: 'auto 0px' }}>
                            Server:&nbsp;
                          </span>
                          <CustomDropDown
                            coreIndex={coreIndex}
                            type={'cores'}
                            items={engine[name]}
                            engineName={name}
                            userFullInfo={userFullInfo}
                            handelCoreChange={handelCoreChange}
                          />
                        </div>
                        <div className="analize-info-item-wrapper">
                          {
                            (
                              engineList[0][name][coreIndex[name]] ||
                              engineList[0][name][0]
                            ).price_per_minute
                          }
                          <span>&nbsp;coins/min</span>
                        </div>
                        <div className="analize-button-wrapper">
                          {isServerOrdering[name] && loadingOrderedServer()}
                          {servers &&
                            !servers[name] &&
                            !isServerOrdering[name] &&
                            showAnalizeButton(
                              userFullInfo,
                              engineList[0][name][coreIndex[name]].cores,
                              (
                                engineList[0][name][coreIndex[name]] ||
                                engineList[0][name][0]
                              ).price_per_minute
                            ) && (
                              <button
                                className="analize-button"
                                onClick={() => {
                                  handleOrderServer(
                                    engineList[0][name][coreIndex[name]].cores,
                                    name
                                  );
                                }}
                              >
                                Analyze
                              </button>
                            )}
                          {servers &&
                            !servers[name] &&
                            !isServerOrdering[name] &&
                            !showAnalizeButton(
                              userFullInfo,
                              engineList[0][name][coreIndex[name]].cores,
                              (
                                engineList[0][name][coreIndex[name]] ||
                                engineList[0][name][0]
                              ).price_per_minute
                            ) && (
                              <button className="analize-button-disabled">
                                Analyze
                              </button>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {savedAnalyzeInfo &&
                  savedAnalyzeInfo.map((info, index) => {
                    if (info.name === name && info.analysis) {
                      return (
                        <SavedAnalysisArea
                          key={index}
                          serverName={name}
                          handleAnalyze={props.handleAnalyze}
                          fenToAnalyze={props.fenToAnalyze}
                          setFenToAnalyze={props.BodysetFenToAnalyze}
                        />
                      );
                    }
                    return null;
                  })}
              </div>
            </Accordion.Body>
          ))}
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default connect(mapStateToProps, {
  setOrderedCores,
  setSavedAnalyzeInfo,
})(React.memo(DesktopEnginesList));
